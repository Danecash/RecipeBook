import { useEffect, useRef } from 'react';

export default function useHeaderBgBlurHeight() {
  const featuredRef = useRef(null);
  useEffect(() => {
    function setBlurHeight() {
      const blur = document.querySelector('.header-bg-blur');
      const featured = featuredRef.current;
      if (blur && featured) {
        const rect = featured.getBoundingClientRect();
        const scrollTop = window.scrollY || window.pageYOffset;
        const top = rect.top + scrollTop;
        const height = top + featured.offsetHeight;
        blur.style.height = height + 'px';
      }
    }
    setBlurHeight();
    window.addEventListener('resize', setBlurHeight);
    window.addEventListener('scroll', setBlurHeight);
    return () => {
      window.removeEventListener('resize', setBlurHeight);
      window.removeEventListener('scroll', setBlurHeight);
    };
  }, []);
  return featuredRef;
}
