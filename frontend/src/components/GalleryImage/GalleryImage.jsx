import React, { useState } from 'react';
import s from './GalleryImage.module.css';

const GalleryImage = ({ src, alt }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={s.wrapper}>
      {!loaded && <div className={s.skeleton} />}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={`${s.image} ${loaded ? s.visible : s.hidden}`}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
};

export default GalleryImage;
