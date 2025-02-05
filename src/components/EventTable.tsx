import React from 'react';
import { Event } from '../eventSchema';

interface EventTableProps {
  events: Event[];
}

const EventTable: React.FC<EventTableProps> = ({ events }) => {
  return (
    <table style={{ borderCollapse: 'collapse', width: '100%' }}>
      <thead>
        <tr>
          <th style={{ border: '1px solid #ddd', padding: '8px' }}>Title</th>
          <th style={{ border: '1px solid #ddd', padding: '8px' }}>Date</th>
          <th style={{ border: '1px solid #ddd', padding: '8px' }}>Location</th>
          <th style={{ border: '1px solid #ddd', padding: '8px' }}>Description</th>
          <th style={{ border: '1px solid #ddd', padding: '8px' }}>URL</th>
        </tr>
      </thead>
      <tbody>
        {events.map((event, index) => (
          <tr key={index}>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{event.title}</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{event.date}</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{event.location || 'N/A'}</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{event.description || 'N/A'}</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
              {event.url ? (
                <a href={event.url} target="_blank" rel="noopener noreferrer">
                  Link
                </a>
              ) : (
                'N/A'
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default EventTable;
