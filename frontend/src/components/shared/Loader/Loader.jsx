import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { BounceLoader } from 'react-spinners';
import s from './Loader.module.css';

const Loader = ({ show = false }) => {
  return show ? (
    <div className={s.backdrop}>
      <BounceLoader color="var(--color-primary)" size={80} />
    </div>
  ) : null;
};

export default Loader;
