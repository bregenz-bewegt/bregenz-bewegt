import { useState, useEffect } from 'react';

export function useInViewport(ref: any) {
  const [isIntersecting, setIntersecting] = useState<boolean>(false);

  const observer = new IntersectionObserver(([entry]) =>
    setIntersecting(entry.isIntersecting)
  );

  useEffect(() => {
    observer.observe(ref.current);
    return () => {
      observer.disconnect();
    };
  }, []);

  return isIntersecting;
}
