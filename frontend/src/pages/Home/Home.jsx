import React from 'react';
import HeroSection from '../../components/HeroSection/HeroSection';
import AboutOwner from '../../components/AboutOwner/AboutOwner';
import OpinionsSection from '../../components/OpinionsSection/OpinionsSection';

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
