import React, { useState, useEffect, useRef } from 'react';
import VideoSection from './VideoSection';
import MainContent from './MainContent';
import {CompectHeader, DefaultHeader } from './StickyNav';
import EqualizerBars from './EqualizerBars';

const Front = () => {
  //  const [isSticky, setIsSticky] = useState(false);
  //  const stickyRef = useRef(null);
  //  const sentinelRef = useRef(null);

  return (
    <>
    <div style={{ position: 'relative' }}>
       <div className="container mt-1 bg-light">
        <VideoSection/>
        <MainContent/>
       </div>
     </div>
    </>
  );
};

export default Front;
