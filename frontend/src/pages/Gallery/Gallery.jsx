import React from 'react';
import { useEffect } from 'react';
import BeforeAfterGallery from '../../components/gallery/BeforeAfterGallery/BeforeAfterGallery';
import { logPageViewGA } from '../../utils/analytics';

const Gallery = () => {
  useEffect(() => {
    logPageViewGA();
  }, []);

  return <BeforeAfterGallery />;
};

export default Gallery;
