import React from "react";
import Marquee from "react-fast-marquee";

const NewsTicker = () => {
  return (
    <Marquee 
      speed={50} 
      gradient={false}
      direction="left"
      pauseOnHover="true"
      className="custom-marquee"
    >
      <span style={{ padding: '0 2rem' }}>
        God is everywhere !! beyond universe 🔥 🚀 ⚛️
      </span>
    </Marquee>
  );
};

export default NewsTicker;