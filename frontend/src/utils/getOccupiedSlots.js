export const getOccupiedSlots = (durationMinutes) => {
  const hours = durationMinutes / 60;

  if (hours <= 1) return 1;
  if (hours <= 1.5) return 1.5;
  if (hours <= 2) return 2;

  // округлення до 0.5
  return Math.ceil(hours * 2) / 2;
};
export const getOccupiedSlotsArray = (start, end, durationMinutes) => {
  const occupiedSlots = [];
  const durationHours = durationMinutes / 60;

  for (let time = start; time < end; time += durationHours) {
    occupiedSlots.push(time);
  }

  return occupiedSlots;
};
