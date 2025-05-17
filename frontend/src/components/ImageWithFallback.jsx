// frontend/src/components/ImageWithFallback.jsx
import { getImageUrl } from '../utils/imageUtils';
import { useState } from 'react';

const ImageWithFallback = ({ src, alt, className, style }) => {
  const [imgSrc, setImgSrc] = useState(getImageUrl(src));

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      style={style}
      onError={() => setImgSrc('/placeholder-recipe.jpg')}
    />
  );
};

export default ImageWithFallback;