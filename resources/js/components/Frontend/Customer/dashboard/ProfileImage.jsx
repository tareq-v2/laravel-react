import React, { useRef, useEffect, useState } from 'react';
import ColorThief from 'colorthief';

const ProfileImage = ({ src }) => {
  const imgRef = useRef(null);
  const [shadowColor, setShadowColor] = useState('rgba(0,0,0,0.1)');

  useEffect(() => {
    if (imgRef.current && src) {
      const colorThief = new ColorThief();
      
      const updateShadow = () => {
        try {
          const dominantColor = colorThief.getColor(imgRef.current);
          const [r, g, b] = dominantColor;
          setShadowColor(`rgba(${r},${g},${b},0.4)`);
        } catch (error) {
          setShadowColor('rgba(255,99,71,0.4)');
        }
      };

      if (imgRef.current.complete) {
        updateShadow();
      } else {
        imgRef.current.addEventListener('load', updateShadow);
      }

      return () => {
        imgRef.current?.removeEventListener('load', updateShadow);
      };
    }
  }, [src]);

  return (
    <img
      ref={imgRef}
      src={src}
      alt="Profile"
      className="profile-image"
      style={{ 
        borderRadius: '50%',
        boxShadow: `0 8px 20px ${shadowColor}`,
        transition: 'box-shadow 0.3s ease-in-out'
      }}
    />
  );
};

export default ProfileImage;