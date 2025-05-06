import { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import './Design//ScrollToTop.css'; // Create this CSS file

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <div className="scroll-to-top">
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="scroll-button"
          aria-label="Scroll to top"
        >
          <FaArrowUp className="scroll-icon" />
        </button>
      )}
    </div>
  );
};

export default ScrollToTop;