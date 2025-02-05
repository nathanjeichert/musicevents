import React, { useEffect, useState } from 'react';
import EventTable from './EventTable';
import { Event, EventSchema } from '../eventSchema';

const dummyRawEvents = [
  {
    title: "Science Fair",
    date: "2025-03-15",
    location: "City Hall",
    description: "A community science fair.",
    url: "https://example.com/event"
  },
  {
    title: "Music Festival",
    date: "2025-04-20",
    location: "Central Park",
    description: "An outdoor music festival.",
    url: "https://example.com/musicfest"
  }
];

const EventTableContainer: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    // Simulate fetching and parsing events data with Structured Outputs
    const parsedEvents: Event[] = [];
    dummyRawEvents.forEach(rawEvent => {
      const result = EventSchema.safeParse(rawEvent);
      if(result.success) {
        parsedEvents.push(result.data);
      } else {
        console.error("Event validation failed", result.error.format());
      }
    });
    setEvents(parsedEvents);
  }, []);

  return (
    <div>
      <h2>Events</h2>
      <EventTable events={events} />
    </div>
  );
};

export default EventTableContainer;
