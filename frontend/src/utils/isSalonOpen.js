export const isSalonOpen = (date, contact, time = null) => {
  if (!date || !contact || !Array.isArray(contact.workHour)) return false;

  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
  const entry = contact.workHour.find((w) => w.date === dayName);
  if (!entry || !entry.open || !entry.close) return false;

  if (time) {
    const [hour, minute] = time.split(':').map(Number);
    const bookingTime = new Date(date);
    bookingTime.setHours(hour, minute, 0, 0);

    const [openH, openM] = entry.open.split(':').map(Number);
    const [closeH, closeM] = entry.close.split(':').map(Number);

    const openTime = new Date(date);
    openTime.setHours(openH, openM, 0, 0);

    const closeTime = new Date(date);
    closeTime.setHours(closeH, closeM, 0, 0);

    return bookingTime >= openTime && bookingTime < closeTime;
  }

  return true;
};
