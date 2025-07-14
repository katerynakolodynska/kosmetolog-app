import React from 'react';
import s from './UniversalModal.module.css';

const UniversalModal = ({ title, children, onClose }) => {
  return (
    <div className={s.overlay} onClick={onClose}>
      <div className={s.modal} onClick={(e) => e.stopPropagation()}>
        <div className={s.header}>
          <h2>{title}</h2>
          <button className={s.closeBtn} onClick={onClose}>
            ×
          </button>
        </div>
        <div className={s.content}>{children}</div>
      </div>
    </div>
  );
};

export default UniversalModal;
