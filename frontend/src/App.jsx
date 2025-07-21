import { lazy, Suspense, useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './components/shared/Loader/Loader.jsx';
import Header from './components/layout/Header/Header.jsx';
import FooterSection from './components/layout/FooterSection/FooterSection.jsx';
import PrivateRoute from './routes/PrivateRoute.jsx';

const Home = lazy(() => import('./pages/Home/Home.jsx'));
const Services = lazy(() => import('./pages/Services/Services.jsx'));
const Booking = lazy(() => import('./pages/Booking/Booking.jsx'));
const Gallery = lazy(() => import('./pages/Gallery/Gallery.jsx'));
const Contact = lazy(() => import('./pages/Contact/Contact.jsx'));
const Opinion = lazy(() => import('./pages/Opinion/Opinion.jsx'));
const AdminLog = lazy(() => import('./pages/AdminLogin/AdminLogin.jsx'));
const Admin = lazy(() => import('./pages/Admin/Admin.jsx'));
const ReviewsAdmin = lazy(() => import('./pages/Admin/ReviewsAdmin.jsx'));
const GalleryAdmin = lazy(() => import('./pages/Admin/GalleryAdmin.jsx'));
const ServicesAdmin = lazy(() => import('./pages/Admin/ServicesAdmin.jsx'));
const Schedule = lazy(() => import('./pages/Admin/Schedule.jsx'));
const Settings = lazy(() => import('./pages/Admin/Settings.jsx'));
const Bookings = lazy(() => import('./pages/Admin/Bookings.jsx'));
const Specialists = lazy(() => import('./pages/Admin/Specialists.jsx'));
const Notifications = lazy(() => import('./pages/Admin/Notifications.jsx'));

function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const isContact = location.pathname === '/contact';

  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsFirstLoad(false), 300); // Loader min 300ms for smooth UX
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Header />
      <main>
        <Suspense fallback={<Loader show />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services withTransition={!isFirstLoad} />} />
            <Route path="/gallery" element={<Gallery withTransition={!isFirstLoad} />} />
            <Route path="/opinion" element={<Opinion withTransition={!isFirstLoad} />} />
            <Route path="/booking" element={<Booking withTransition={!isFirstLoad} />} />
            <Route path="/contact" element={<Contact withTransition={!isFirstLoad} />} />
            <Route path="/admin-login" element={<AdminLog />} />

            <Route
              path="/admin"
              element={
                <PrivateRoute>
                  <Admin />
                </PrivateRoute>
              }
            >
              <Route path="reviews" element={<ReviewsAdmin />} />
              <Route path="gallery-admin" element={<GalleryAdmin />} />
              <Route path="services-admin" element={<ServicesAdmin />} />
              <Route path="schedule" element={<Schedule />} />
              <Route path="settings" element={<Settings />} />
              <Route path="bookings" element={<Bookings />} />
              <Route path="specialists" element={<Specialists />} />
              <Route path="notifications" element={<Notifications />} />
            </Route>
          </Routes>
        </Suspense>
      </main>
      <Suspense fallback={<Loader show />}>
       {!isAdmin && !isContact && <FooterSection />}
      </Suspense>
    </>
  );
}

export default App;
