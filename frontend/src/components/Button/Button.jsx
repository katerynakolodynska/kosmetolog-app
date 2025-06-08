import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import s from './Button.module.css';

const Button = ({ type = 'button', serviceKey = '', label, onClick }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (onClick) {
      onClick(e); // даємо можливість передати кастомний onClick
    } else if (serviceKey) {
      navigate(`/booking?service=${serviceKey}`);
    } else {
      navigate('/booking');
    }
  };

  return (
    <button className={s.cta} type={type} onClick={type === 'submit' ? undefined : handleClick}>
      {label || t('book')}
    </button>
  );
};

export default Button;
