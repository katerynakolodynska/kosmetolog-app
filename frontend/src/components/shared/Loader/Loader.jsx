import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { BounceLoader } from 'react-spinners';
import s from './Loader.module.css';

const Loader = ({ type = 'full' }) => {
  const isLoading = useSelector((state) => state.loader?.isLoading);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setVisible(true);
    } else {
      const timeout = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isLoading]);

  if (!visible && type === 'full') return null;

  return type === 'inline' ? (
    <div className={s.inlineLoader}>
      <BounceLoader color="var(--color-primary)" size={40} />
    </div>
  ) : (
    <div className={`${s.backdrop} ${isLoading ? s.visible : ''}`}>
      <BounceLoader color="var(--color-primary)" size={80} />
    </div>
  );
};

export default Loader;
