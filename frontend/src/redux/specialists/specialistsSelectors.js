export const selectSpecialists = (state) => state.specialists.items;
export const selectSpecialistsLoading = (state) => state.specialists.isLoading;
export const selectSpecialistsError = (state) => state.specialists.error;
export const toggleSpecialistStatus = (state) => state.specialists.toggleStatus;
