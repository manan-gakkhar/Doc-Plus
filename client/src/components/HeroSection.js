// import React from 'react';
import React, { useEffect } from 'react';
import '../App.css';
// import { Button } from './Button';
import './HeroSection.css';
import { Link } from 'react-router-dom';



function HeroSection() {
    
    return (
        <div className='hero-container'>
            
            <div className="hero-gradient"></div>
            <div className="hero-text">
                <h1><span1>ALL your</span1> <br/> Health related documents <br />
                    <span> At one place</span><br />
                </h1>
                <p><span2>Find your documents now </span2></p>
                <p><span2>Start a new Medial checkup here</span2></p>
                <Link to="/register" className='hero-free-trial-button'><button>Get started</button></Link>
            </div>



        </div>

    );
}

export default HeroSection;