import { lazy, Suspense } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Header = lazy(() => import('./components/layout/Header/Header'));
const Loader = lazy(() => import('./components/shared/Loader/Loader'));
import PrivateRoute from './routes/PrivateRoute.jsx';
import CookieBannerPro from './components/Police/CookieBannerPro.jsx';
import GoogleAnalytics from './components/shared/GoogleAnalytics.jsx';

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
const FooterSection = lazy(() => import('./components/layout/FooterSection/FooterSection.jsx'));
const PolitykaPrywatnosci = lazy(() => import('./pages/PolitykaPrywatnosci.jsx'));

function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const isContact = location.pathname === '/contact';
  const isLoading = useSelector((state) => state.loader.isLoading);

  return (
    <>
      {isLoading && <Loader />}
      <Suspense fallback={null}>
        <Header />
      </Suspense>
      <main>
        <Suspense fallback={<Loader show />}>
          <CookieBannerPro />
          {localStorage.getItem('cookieConsentCosmetolog') &&
            JSON.parse(localStorage.getItem('cookieConsentCosmetolog')).analytics && <GoogleAnalytics />}

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/opinion" element={<Opinion />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin-login" element={<AdminLog />} />
            <Route path="/polityka-prywatnosci" element={<PolitykaPrywatnosci />} />

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

      {!isAdmin && !isContact && (
        <Suspense fallback={null}>
          <FooterSection />
        </Suspense>
      )}
    </>
  );
}

export default App;
