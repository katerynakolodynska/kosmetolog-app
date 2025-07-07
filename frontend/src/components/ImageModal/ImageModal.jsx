import ReactDOM from 'react-dom';
import React, { useEffect } from 'react';
import s from './ImageModal.module.css';
import { FaTimes } from 'react-icons/fa';

const ImageModal = ({ src, alt, onClose }) => {
  useEffect(() => {
    document.body.classList.add('modal-open');
    return () => document.body.classList.remove('modal-open');
  }, []);

  return ReactDOM.createPortal(
    <div className={s.overlay} onClick={onClose}>
      <div className={s.modal} onClick={(e) => e.stopPropagation()}>
        <img src={src} alt={alt} className={s.image} />
        <button className={s.closeBtn} onClick={onClose}>
          <FaTimes />
        </button>
      </div>
    </div>,
    document.body
  );
};

export default ImageModal;
