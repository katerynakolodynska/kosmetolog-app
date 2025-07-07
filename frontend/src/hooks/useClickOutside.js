import { useEffect } from 'react';

/**
 * @param {Object|Array} refs - Ref або масив ref'ів для перевірки кліків ззовні.
 * @param {Function} callback - Що викликати при кліку поза.
 * @param {Boolean} enabled - Чи активний хук.
 * @param {Number} delay - Затримка перед викликом callback (мс).
 */
export function useClickOutside(refs, callback, enabled = true, delay = 300) {
  useEffect(() => {
    if (!enabled) return;

    const refList = Array.isArray(refs) ? refs : [refs];

    const handleClick = (event) => {
      const clickedOutsideAll = refList.every((ref) => ref.current && !ref.current.contains(event.target));

      if (clickedOutsideAll) {
        setTimeout(() => {
          callback(event);
        }, delay);
      }
    };

    document.addEventListener('mousedown', handleClick);
    document.addEventListener('touchstart', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('touchstart', handleClick);
    };
  }, [refs, callback, enabled, delay]);
}
