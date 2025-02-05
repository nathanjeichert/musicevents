# Project Brief

## Overview
This project is a web-based application designed to aggregate event information from user-provided links. Users input their email address and one or more URLs they wish to be scraped and parsed by an AI. The application then processes these links, extracts relevant event data, and produces a publicly accessible .ics file that can be added to Google Calendar. Additionally, the app sends out a weekly email update summarizing new events and any changes.

This document outlines the key components and functionalities required for a coding agent to recreate this application using a TypeScript frontend deployed on Vercel via GitHub, along with the necessary backend implementations.

## Key Functionalities

### 1. User Interface (Frontend)
- **Technology Stack:** TypeScript, React (or a similar framework).
- **UI Components:**
  - **Email Input:** A form field for users to enter their email address.
  - **Link Input:** A multi-line text area or dynamic input set for users to enter one or more URLs.
  - **Submission Button:** To start the scraping and parsing process.
  - **Result Display:** Once processing is complete, display a link to the generated .ics file.
- **Integration with Vercel:** The frontend codebase should be set up for deployment to Vercel. Use GitHub for version control and deployment pipelines.
- **User Experience Considerations:** Ensure the UI is responsive and provides clear user feedback (e.g., loading states, success messages).

### 2. Backend and Processing Pipeline

#### A. Scraping and Parsing with Selenium
- **Purpose:** Dynamically load web pages to retrieve event data, especially from JavaScript-heavy sites.
- **Implementation:**
  - **Selenium WebDriver:** Use Selenium to automate the browser and fetch complete page content.
  - **Error Handling:** Account for timeouts, dynamic content load failures, and potential bot-detection mechanisms.
  - **Data Extraction:** Parse the scraped content to extract necessary event information (e.g., event title, date, location).

#### B. AI-Based Parsing and Content Interpretation
- **Purpose:** Leverage AI to interpret and normalize event data extracted from various sources.
- **Implementation:**
  - **Model/Service Integration:** Integrate with an AI service or library (for example, using OpenAI APIs or a custom NLP parser) to parse the raw HTML/text.
  - **Data Normalization:** Convert the diverse formats into a standardized structure that can be easily processed further.
  - **Error Correction:** Use AI to flag or correct inconsistencies in the event data.

#### C. ICS File Generation and Google Calendar Integration
- **ICS File Generation:**
  - **Data Conversion:** Convert the standardized event data into the .ics format.
  - **Public Accessibility:** Host the generated .ics file on a publicly accessible URL so that it can be subscribed to or imported by Google Calendar users.
- **Google Calendar Integration:**
  - **Instructions for Users:** Provide clear guidance on how to add the .ics file to their Google Calendar.
  - **Automation:** Optionally, integrate with the Google Calendar API for direct additions if further automation is required (though the primary method is via .ics link).

#### D. Weekly Email Send Functionality
- **Purpose:** Notify users of new events or updates on a weekly basis.
- **Implementation:**
  - **Email Service Integration:** Use an email-sending service (like SendGrid, Mailgun, or AWS SES).
  - **Scheduling:** Implement a scheduler (cron job or scheduled serverless function) which collects updated event data and email content each week.
  - **Email Content:** Summarize the latest events, any changes, and include the link to the updated .ics file.
  - **Error Handling:** Log failures and ensure retries or notifications for unsuccessful email deliveries.

## Technical Architecture

### Frontend (TypeScript/React)
- **Single-Page Application (SPA):** Create a responsive, client-side rendered interface.
- **API Integration:** 
  - Connect to backend endpoints that trigger scraping, AI processing, and ICS file generation.
  - Display real-time status updates for the user submission.
- **Deployment:** 
  - The code repository should be hosted on GitHub and integrated with Vercel for continuous deployment.

### Backend (Python or Node.js)
- **Web Scraping:** 
  - Use Node JS and Puppeteer to pass the whole text of the webpage to the ai (after waiting 1 second to load)
- **AI Processing:** 
  - A dedicated module that interfaces with openai AI APIs to process and normalize scraped data.
- **ICS File Handling:**
  - A module to convert parsed event data into .ics format.
  - Storage or hosting solution (using Vercel serverless functions or a cloud storage bucket) to serve the ICS file.
- **Email Service:**
  - Implement scheduled tasks to send weekly update emails.
  - Ensure the email platform can handle templating and batch email sends securely.

## Deployment and CI/CD
- **GitHub Repository:** Source code managed in GitHub with clear branch strategies for development, staging, and production.
- **Vercel Deployment:**
  - The TypeScript frontend is deployed on Vercel.
  - Backend endpoints (if serverless) can also be hosted on Vercel or integrated through another backend service.
- **Environment Variables:** Securely manage API keys, email service credentials, and any necessary configuration via Vercel’s environment variables interface.

## Summary
A coding agent recreating this project should focus on:
- Building a responsive TypeScript/React UI for data input and result display.
- Implementing a backend that leverages Puppeteer for web scraping and utilizes AI for data normalization.
- Generating a public ICS file link that integrates with Google Calendar.
- Setting up robust weekly email notifications to keep users updated.
- Deploying the entire project with continuous integration using GitHub and Vercel.

## Context
### OpenAI API
OpenAI's API has changed signifigantly since your knowledge was last updated. Here is a relevant portion of their new api docs: 
#### example request:
import OpenAI from "openai";

const openai = new OpenAI();

async function main() {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "developer", content: "You are a helpful assistant." }],
    model: "gpt-4o-mini",
    store: true,
  });

  console.log(completion.choices[0]);
}

main();
#### example response:
{
  "id": "chatcmpl-123",
  "object": "chat.completion",
  "created": 1677652288,
  "model": "gpt-4o-mini",
  "system_fingerprint": "fp_44709d6fcb",
  "choices": [{
    "index": 0,
    "message": {
      "role": "assistant",
      "content": "\n\nHello there, how may I assist you today?",
    },
    "logprobs": null,
    "finish_reason": "stop"
  }],
  "service_tier": "default",
  "usage": {
    "prompt_tokens": 9,
    "completion_tokens": 12,
    "total_tokens": 21,
    "completion_tokens_details": {
      "reasoning_tokens": 0,
      "accepted_prediction_tokens": 0,
      "rejected_prediction_tokens": 0
    }
  }
}



This document serves as a technical and functional guide to build an application with similar capabilities and deployment environment.

