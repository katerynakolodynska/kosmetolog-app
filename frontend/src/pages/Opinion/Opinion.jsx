import React from 'react';
import { useEffect } from 'react';
import OpinionsSection from '../../components/sections/OpinionsSection/OpinionsSection';
import { logPageViewGA } from '../../utils/analytics';

const Opinion = () => {
  useEffect(() => {
    logPageViewGA();
  }, []);

  return (
    <>
      <OpinionsSection />
    </>
  );
};

export default Opinion;
