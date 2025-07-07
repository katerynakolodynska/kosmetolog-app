import { Route, Routes, useLocation } from 'react-router-dom';

import './App.css';
import Header from './components/Header/Header.jsx';
import Home from './pages/Home/Home.jsx';
import Services from './pages/Services/Services.jsx';
import Booking from './pages/Booking/Booking.jsx';
import Gallery from './pages/Gallery/Gallery.jsx';
import Contact from './pages/Contact/Contact.jsx';
import FooterSection from './components/FooterSection/FooterSection.jsx';
import Opinion from './pages/Opinion/Opinion.jsx';

import PrivateRoute from './routes/PrivateRoute.jsx';
import Admin from './pages/Admin/Admin.jsx';
import AdminLog from './pages/AdminLogin/AdminLogin.jsx';
import ReviewsAdmin from './pages/Admin/ReviewsAdmin.jsx';
import GalleryAdmin from './pages/Admin/GalleryAdmin.jsx';
import ServicesAdmin from './pages/Admin/ServicesAdmin.jsx';
import Schedule from './pages/Admin/Schedule.jsx';
import Settings from './pages/Admin/Settings.jsx';
import Bookings from './pages/Admin/Bookings.jsx';
import Specialists from './pages/Admin/Specialists.jsx';

function App() {
  const location = useLocation();
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/opinion" element={<Opinion />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/contact" element={<Contact />} />
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
          </Route>
        </Routes>
      </main>
      {!location.pathname.startsWith('/admin') && location.pathname !== '/contact' && <FooterSection />}
    </>
  );
}

export default App;
