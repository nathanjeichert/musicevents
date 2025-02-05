import express from 'express';
import bodyParser from 'body-parser';
import * as puppeteer from 'puppeteer';
import OpenAI from 'openai';
import { createEvents } from 'ics';
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';

// Initialize Express app
const app = express();
const port = process.env.PORT || 3001;

// Use body-parser middleware to parse JSON
app.use(bodyParser.json());

// Serve static files from public folder (for the generated ICS file)
app.use(express.static(path.join(__dirname, 'public')));

// Configure OpenAI with API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Helper function: Scrape page content using Puppeteer
async function scrapePageContent(url: string): Promise<string> {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
    // Wait 1 second to ensure dynamic content has loaded
    await page.waitForTimeout(1000);
    const content = await page.evaluate(() => document.body.innerText);
    return content;
  } finally {
    await browser.close();
  }
}

// Helper function: Use OpenAI to parse event data using Structured Outputs
async function parseEventData(pageContent: string): Promise<{
  title: string;
  date: string;
  location?: string;
  description?: string;
  url?: string;
}> {
  // Use a system prompt and provide the page content.
  // The assistant is instructed to extract the event information as JSON.
  const response = await openai.chat.completions.create({
    model: "gpt-4o-2024-08-06",
    messages: [
      {
        role: "system",
        content: "Extract the event information from the provided text. Format the output as a JSON object with the keys: title (string), date (string), location (string, optional), description (string, optional), and url (string, optional)."
      },
      {
        role: "user",
        content: pageContent
      }
    ],
    // Use a response_format to encourage structured output.
    // Note: In a production app, proper error handling and validation should be added.
    response_format: { type: "json_object" }
  });
  
  // Assume the response content is valid JSON.
  const content = response.choices[0].message.content;
  try {
    return JSON.parse(content);
  } catch (err) {
    throw new Error("Failed to parse OpenAI response as JSON.");
  }
}

// Helper function: Generate ICS file content from events using 'ics' package
async function generateICS(events: {
  title: string;
  date: string;
  location?: string;
  description?: string;
  url?: string;
}[]): Promise<string> {
  const icsEvents = events.map(event => {
    // Parse date string into [year, month, day] assuming format YYYY-MM-DD
    const dateParts = event.date.split('-').map(Number);
    return {
      title: event.title,
      start: dateParts,
      location: event.location || "",
      description: event.description || "",
      url: event.url || ""
    };
  });

  return new Promise<string>((resolve, reject) => {
    createEvents(icsEvents, (error, value) => {
      if (error) {
        return reject(error);
      }
      resolve(value as string);
    });
  });
}

// POST endpoint to process events
app.post('/processEvents', async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const { email, urls } = req.body;
    if (!email || !urls) {
      res.status(400).json({ error: "Missing email or urls in request body." });
      return;
    }
    // Expect urls as a string with one URL per line
    const urlList = urls.split('\n').map((url: string) => url.trim()).filter((url: string) => url);
    
    const events: Array<{ title: string; date: string; location?: string; description?: string; url?: string; }> = [];
    for (const url of urlList) {
      // Scrape page content for each URL
      const pageContent = await scrapePageContent(url);
      // Parse event data using OpenAI
      const eventData = await parseEventData(pageContent);
      // If the parsed event data does not include a URL, add the original URL
      if (!eventData.url) {
        eventData.url = url;
      }
      events.push(eventData);
    }
    
    // Generate ICS file content from the events
    const icsContent = await generateICS(events);
    
    // Save the ICS file to the public folder to be accessible by a URL
    const publicDir = path.join(__dirname, 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir);
    }
    const icsFileName = 'events.ics';
    const icsFilePath = path.join(publicDir, icsFileName);
    fs.writeFileSync(icsFilePath, icsContent);
    
    // Schedule/send weekly email update (stub implementation using nodemailer)
    // In a full implementation, you would integrate a scheduling system like node-cron.
    // Here we send an immediate email as a demonstration.
    const transporter = nodemailer.createTransport({
      // Example: using Gmail SMTP (for production, secure credentials with environment variables)
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS
      }
    });
    const rawHost = req.get('host');
    const host: string = rawHost !== null && rawHost !== undefined ? rawHost : 'localhost';
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Event Aggregator ICS File',
      text: `Your events have been processed. You can download your ICS file at: ${req.protocol}://${host}/${icsFileName}`
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email", error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    
    res.json({
      events,
      icsUrl: `${req.protocol}://${host}/${icsFileName}`
    });
  } catch (error) {
    console.error("Error in /processEvents:", error);
    res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Backend server is running on port ${port}`);
});
