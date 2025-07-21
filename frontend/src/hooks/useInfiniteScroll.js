import { useEffect, useRef } from 'react';

export const useInfiniteScroll = (callback, hasMore, loading) => {
  const observerRef = useRef();

  useEffect(() => {
    if (loading || !hasMore) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) callback();
    });
    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [callback, hasMore, loading]);

  return observerRef;
};
