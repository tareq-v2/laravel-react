import React, { useState, useEffect } from "react";
import Marquee from "react-fast-marquee";
import axios from "axios";

const NewsTicker = () => {
  const [quote, setQuote] = useState("Loading inspirational quote...");
  
  const fetchQuote = async () => {
    try {
      const response = await axios.get('/get/inspire');
      setQuote(response.data.quote);
    } catch (error) {
      setQuote("The whole future lies in uncertainty: live immediately. 🔥 🚀 ⚛️");
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchQuote();
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchQuote, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <Marquee 
      speed={50} 
      gradient={false}
      direction="left"
      pauseOnHover={true}
      className="custom-marquee"
    >
      <span style={{ padding: '0 2rem', color: 'tomato' }}>
        {quote}
      </span>
    </Marquee>
  );
};

export default NewsTicker;