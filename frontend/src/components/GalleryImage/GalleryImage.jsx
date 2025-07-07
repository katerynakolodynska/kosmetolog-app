import React, { useState } from 'react';
import s from './GalleryImage.module.css';
import ImageModal from '../ImageModal/ImageModal';

const GalleryImage = ({ src, alt }) => {
  const [loaded, setLoaded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <>
      <div className={s.wrapper} onClick={handleOpen}>
        {!loaded && <div className={s.skeleton} />}
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className={`${s.image} ${loaded ? s.visible : s.hidden}`}
          onLoad={() => setLoaded(true)}
        />
      </div>

      {isOpen && <ImageModal src={src} alt={alt} onClose={handleClose} />}
    </>
  );
};

export default GalleryImage;
