import React from 'react';
import { useEffect } from 'react';
import { logPageViewGA } from '../../utils/analytics';

import ServiceSection from '../../components/sections/ServiceSection/ServiceSection';

const Services = () => {
  useEffect(() => {
    logPageViewGA();
  }, []);

  return (
    <>
      <ServiceSection />
    </>
  );
};

export default Services;
