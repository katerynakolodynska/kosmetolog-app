import React from 'react';
import { format, isSameDay, parseISO } from 'date-fns';

const DebugDateInfo = ({ selectedDate }) => {
  const now = new Date();
  const parsedSelected = selectedDate ? new Date(selectedDate) : null;

  return (
    <div
      style={{
        padding: '1rem',
        background: '#ffe8e8',
        border: '1px solid #ff0000',
        borderRadius: '8px',
        marginBottom: '1rem',
        fontFamily: 'monospace',
      }}
    >
      <div>
        <strong>🕓 Local Now:</strong> {format(now, 'yyyy-MM-dd HH:mm:ss')}
      </div>
      <div>
        <strong>📆 Selected Date:</strong> {selectedDate || 'null'}
      </div>
      <div>
        <strong>⏳ isSameDay(now, selectedDate):</strong>{' '}
        {parsedSelected ? (isSameDay(parsedSelected, now) ? '✅ true' : '❌ false') : 'N/A'}
      </div>
    </div>
  );
};

export default DebugDateInfo;
