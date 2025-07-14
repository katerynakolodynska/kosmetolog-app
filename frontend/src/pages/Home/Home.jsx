import React from 'react';
import HeroSection from '../../components/sections/HeroSection/HeroSection';
import AboutOwner from '../../components/layout/AboutOwner/AboutOwner';
import OpinionsSection from '../../components/sections/OpinionsSection/OpinionsSection';

const Home = () => {
  return (
    <>
      <HeroSection />
      <AboutOwner />
      <OpinionsSection limit={3} />
    </>
  );
};

export default Home;
