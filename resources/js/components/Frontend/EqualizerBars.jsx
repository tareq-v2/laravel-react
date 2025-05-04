import React, { useState, useRef, useEffect } from 'react';
import './Design/EqualizerBars.css'; // Assuming you have a CSS file for styling

const EqualizerBars = () => {
  const [bars, setBars] = useState(Array(32).fill(0));
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);

  useEffect(() => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    audioContextRef.current = ctx;
    analyserRef.current = analyser;

    return () => ctx.close();
  }, []);

  const handleMicClick = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const source = audioContextRef.current.createMediaStreamSource(stream);
    source.connect(analyserRef.current);
    visualize();
  };

  const visualize = () => {
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    
    const updateBars = () => {
      analyserRef.current.getByteFrequencyData(dataArray);
      setBars(Array.from(dataArray));
      requestAnimationFrame(updateBars);
    };
    
    updateBars();
  };

  return (
    <div className="equalizer-container">
      <button onClick={handleMicClick}>Use Microphone</button>
      <div className="bars-container">
        {bars.map((height, index) => (
          <div 
            key={index}
            className="equalizer-bar"
            style={{ 
              height: `${height / 2}px`,
              backgroundColor: `hsl(${index * 10}, 100%, 50%)`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default EqualizerBars;