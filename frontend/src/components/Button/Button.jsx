import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import s from './Button.module.css';

const Button = ({ type = 'button', serviceId = '', label, onClick }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    } else if (serviceId) {
      navigate(`/booking?service=${serviceId}`);
    } else {
      navigate('/booking');
    }
    console.log('🚀 Booking body:', body);
  };

  return (
    <button className={s.cta} type={type} onClick={type === 'submit' ? undefined : handleClick}>
      {label || t('book')}
    </button>
  );
};

export default Button;
