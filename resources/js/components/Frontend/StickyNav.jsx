import React, { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";
import AuthAndLang from "./AuthAndLang";


export const DefaultHeader = () => {
    return (
        <header className="p-3 mt-0" style={{ width: "100%", backgroundColor: "#2450a0"}}>
            <div className="d-flex justify-content-center align-items-center gap-4" >
              <li className="list-unstyled"> 
                <Link to="/" className="footer-link">About Us</Link>
              </li>
             <li className="text-secondary">
                <Link to="/" className="footer-link">Advertise With Us</Link>
             </li>
             <li className="text-secondary">
                <Link to="/" className="footer-link">Classified Ads</Link>
             </li>
             <li className="text-secondary">
               <Link to="/" className="footer-link">Business Directory</Link>
             </li>
        </div>
    </header>
    )
}

export const CompectHeader = () => {
    return (
        <header  className="p-3 mt-0 d-flex justify-content-between align-items-center gap-4 px-5" style={{ width: "100%", backgroundColor: "#2450a0", color: "#fff"}}>
            <div className="d-flex justify-content-center align-items-center gap-4" >
              <li className="list-unstyled"> 
                <Link to="/" className="footer-link">About Us</Link>
              </li>
             <li className="text-secondary">
                <Link to="/" className="footer-link">Advertise With Us</Link>
             </li>
             <li className="text-secondary">
                <Link to="/" className="footer-link">Classified Ads</Link>
             </li>
             <li className="text-secondary">
               <Link to="/" className="footer-link">Business Directory</Link>
             </li>
          </div>
          <div >
            <AuthAndLang />
          </div>
       </header>
    )
}