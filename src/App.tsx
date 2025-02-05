import React, { useState } from 'react';
import EventTable from './components/EventTable';

const App: React.FC = () => {
  const [email, setEmail] = useState('');
  const [urls, setUrls] = useState('');
  const [events, setEvents] = useState<any[]>([]);
  const [icsUrl, setIcsUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/processEvents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, urls })
      });
      
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to process events');
      }
      
      const data = await response.json();
      setEvents(data.events);
      setIcsUrl(data.icsUrl);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1>Event Aggregator</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label htmlFor="email">Email:</label><br />
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label htmlFor="urls">Event URLs (one per line):</label><br />
          <textarea
            id="urls"
            value={urls}
            onChange={(e) => setUrls(e.target.value)}
            rows={5}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <button type="submit" disabled={loading} style={{ padding: '10px 20px' }}>
          {loading ? 'Processing...' : 'Submit'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {events.length > 0 && (
        <div>
          <h2>Processed Events</h2>
          <EventTable events={events} />
        </div>
      )}
      {icsUrl && (
        <p>
          Your ICS file:{" "}
          <a href={icsUrl} target="_blank" rel="noopener noreferrer">
            Download
          </a>
        </p>
      )}
    </div>
  );
};

export default App;
