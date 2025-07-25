import React, { use } from 'react';
import ContactSection from '../../components/sections/ContactSection/ContactSection';
import { useEffect } from 'react';
import { logPageViewGA } from '../../utils/analytics';

const Contact = () => {
  useEffect(() => {
    logPageViewGA();
  }, []);

  return <ContactSection />;
};

export default Contact;
