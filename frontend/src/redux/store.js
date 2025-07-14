import { configureStore } from '@reduxjs/toolkit';
import { reviewsReducer } from './reviews/reviewsSlice';
import { bookingsReducer } from './bookings/bookingsSlice';
import { adminReducer } from './admin/adminSlice';
import { servicesReducer } from './services/servicesSlice';
import { specialistsReducer } from './specialists/specialistsSlice';
import { contactReducer } from './contact/contactSlice';
import { heroReducer } from './hero/heroSlice';
import { beforeAfterReducer } from './beforeAfter/beforeAfterSlice';
import { notificationsReducer } from './notifications/notificationsSlice';
import loaderReducer from './loader/loaderSlice';
import loadingMiddleware from './loader/loadingMiddleware';

export const store = configureStore({
  reducer: {
    reviews: reviewsReducer,
    bookings: bookingsReducer,
    admin: adminReducer,
    services: servicesReducer,
    specialists: specialistsReducer,
    contact: contactReducer,
    hero: heroReducer,
    beforeAfter: beforeAfterReducer,
    loader: loaderReducer,
    notifications: notificationsReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(loadingMiddleware),
});
