import i18n from 'i18next';

const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const formatWorkingHours = (workHour) => {
  const grouped = {};

  const sorted = [...workHour].sort((a, b) => daysOrder.indexOf(a.date) - daysOrder.indexOf(b.date));

  for (const d of sorted) {
    const key = d.open && d.close ? `${d.open}–${d.close}` : i18n.t('closed');
    const comment = d.comment && !d.comment.toLowerCase().includes('зачинено') ? `, ${d.comment}` : '';

    if (!grouped[key]) grouped[key] = [];
    grouped[key].push({ day: d.date, comment });
  }

  const result = [];

  const getDayLabel = (name) => i18n.t(`weekdays.${name.toLowerCase().slice(0, 3)}`);

  const customSort = (day) => {
    const order = { Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6, Sunday: 7 };
    return order[day] || 100;
  };

  for (const [time, entries] of Object.entries(grouped)) {
    const days = entries.map((d) => d.day).sort((a, b) => customSort(a) - customSort(b));
    const comments = entries.map((d) => d.comment);

    const indexes = days.map((d) => daysOrder.indexOf(d));
    const ranges = [];
    let temp = [indexes[0]];

    for (let i = 1; i < indexes.length; i++) {
      if (indexes[i] === indexes[i - 1] + 1) {
        temp.push(indexes[i]);
      } else {
        ranges.push(temp);
        temp = [indexes[i]];
      }
    }
    ranges.push(temp);

    for (let r = 0; r < ranges.length; r++) {
      const range = ranges[r];
      const label =
        range.length === 1
          ? getDayLabel(daysOrder[range[0]])
          : `${getDayLabel(daysOrder[range[0]])}–${getDayLabel(daysOrder[range.at(-1)])}`;

      result.push(`${label}: ${time}${comments[r]}`);
    }
  }

  return result;
};
