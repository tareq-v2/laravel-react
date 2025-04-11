import React from 'react';
import Ticker from 'react-ticker'; // Imported Ticker
import './Design/Ticker.css';

// Rename your component to avoid naming conflict
const NewsTicker = () => {
    return (
        <div className="ticker-wrapper">
            <Ticker 
                speed={5} 
                mode="smooth" 
                height={40}
                move={true}
            >
                {({ index }) => (
                    <div className="ticker-content">
                        <span>Breaking News: New Feature Released • </span>
                        <span>Special Offer: 50% Off Today • </span>
                        <span>Important Update: System Maintenance at 3 AM • </span>
                    </div>
                )}
            </Ticker>
        </div>
    );
};

export default NewsTicker;