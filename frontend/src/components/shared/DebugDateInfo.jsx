import React from 'react';
import { format, isSameDay, parseISO } from 'date-fns';

const DebugDateInfo = ({ selectedDate }) => {
  const now = new Date();
  let parsedSelected = null;

  try {
    parsedSelected = selectedDate ? new Date(selectedDate) : null;
    if (parsedSelected?.toString() === 'Invalid Date') parsedSelected = null;
  } catch {
    parsedSelected = null;
  }

  return (
    <div
      style={{
        padding: '1rem',
        background: '#ffe8e8',
        border: '1px solid #ff0000',
        borderRadius: '8px',
        marginBottom: '1rem',
        fontFamily: 'monospace',
        fontSize: '0.9rem',
      }}
    >
      <div>
        <strong>🕓 Local Today:</strong> {format(now, 'EEEE, dd MMMM yyyy')}
      </div>
      <div>
        <strong>📆 Selected Date:</strong>{' '}
        {parsedSelected ? format(parsedSelected, 'EEEE, dd MMMM yyyy') : '❌ Invalid or null'}
      </div>
      <div>
        <strong>⏳ isSameDay:</strong>{' '}
        {parsedSelected ? (isSameDay(parsedSelected, now) ? '✅ true' : '❌ false') : 'N/A'}
      </div>
      <div>
        <strong>🧭 Timezone:</strong> {Intl.DateTimeFormat().resolvedOptions().timeZone}
      </div>
    </div>
  );
};

export default DebugDateInfo;
