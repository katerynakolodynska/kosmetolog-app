import React, { useState, useEffect, useRef } from 'react';
import s from './ExpandableText.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import { useClickOutside } from '../../../hooks/useClickOutside';

const ExpandableText = ({ text, small = 'mniej', large = 'więcej', initialLimit = 250 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [charLimit, setCharLimit] = useState(initialLimit);
  const [isLong, setIsLong] = useState(false);
  const containerRef = useRef(null);

  useClickOutside(
    containerRef,
    () => {
      if (isExpanded) setIsExpanded(false);
    },
    true,
    200
  );

  useEffect(() => {
    const updateLimit = () => {
      const width = window.innerWidth;
      let newLimit = initialLimit;
      if (width < 380) newLimit = 80;
      else if (width < 768) newLimit = 100;
      setCharLimit(newLimit);
      setIsLong(text.length > newLimit);
    };

    updateLimit();
    window.addEventListener('resize', updateLimit);
    return () => window.removeEventListener('resize', updateLimit);
  }, [text, initialLimit]);

  useEffect(() => {
    setIsLong(text.length > charLimit);
  }, [charLimit, text]);

  const displayed = isExpanded || !isLong ? text : text.slice(0, charLimit) + '...';

  return (
    <div ref={containerRef} className={s.wrapper}>
      <AnimatePresence mode="wait">
        <motion.p
          key={isExpanded ? 'expanded' : 'collapsed'}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className={s.text}
        >
          {displayed}
        </motion.p>
      </AnimatePresence>

      {isLong && (
        <motion.button onClick={() => setIsExpanded((prev) => !prev)} className={s.toggle} whileTap={{ scale: 0.95 }}>
          {isExpanded ? small : large}
        </motion.button>
      )}
    </div>
  );
};

export default ExpandableText;
