import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import s from './Button.module.css';

const Button = ({ type = 'button', serviceKey = '', label, onClick = null }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (serviceKey) {
      navigate(`/booking?service=${serviceKey}`);
    } else {
      navigate('/booking');
    }
  };
  return (
    <button className={s.cta} type={type} onClick={type === 'button' ? handleClick : undefined}>
      {label || t('book')}
    </button>
  );
};

export default Button;
