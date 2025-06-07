import { Route, Routes } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import './App.css';
import Header from './components/Header/Header.jsx';
import Home from './pages/Home/Home.jsx';
import Services from './pages/Services/Services.jsx';
import Booking from './pages/Booking/Booking.jsx';
import Gallery from './pages/Gallery/Gallery.jsx';
import Contact from './pages/Contact/Contact.jsx';
import FooterSection from './components/FooterSection/FooterSection.jsx';
import Opinion from './pages/Opinion/Opinion.jsx';

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
        </Routes>
      </main>
      {location.pathname !== '/contact' && <FooterSection />}
    </>
  );
}

export default App;
