import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import s from './Button.module.css';
import { logEventGA } from '../../../utils/analytics';

const Button = ({ type = 'button', serviceId = '', label, onClick, className }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleClick = (e) => {
    logEventGA('klik_booking', 'Zapis', serviceId ? `Usługa: ${serviceId}` : 'Ogólny przycisk');

    if (onClick) {
      onClick(e);
    } else if (serviceId) {
      navigate(`/booking?service=${serviceId}`);
    } else {
      navigate('/booking');
    }
  };
  return (
    <button className={`${s.cta} ${className || ''}`} type={type} onClick={type === 'submit' ? undefined : handleClick}>
      {label || t('book')}
    </button>
  );
};

export default Button;
