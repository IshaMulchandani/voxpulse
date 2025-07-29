import './Header2.css'
import logo from './Assets/logo.png'
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Header2(){
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    const toggleSidebar = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    return(
        <div className="header2Cont">
            <header className="App-header">
                <button className="hamburger" onClick={toggleSidebar}>
                    {isMenuOpen ? <X size={24} style={{position: 'relative', bottom:'5.5rem'}}/> : <Menu size={24} />}
                </button>

                {isMenuOpen && (
                    <div className="sidebar" style={{zIndex:10000}}>
                    <ul>
                        <li><h3>Trending Topics</h3></li>
                        <li><a href="/">Crime</a></li>
                        <li><a href="/about">Psychology</a></li>
                        <li><a href="/contact">Sports</a></li>
                        <li><a href="/contact">Politics</a></li>
                        <li><a href="/contact">Movies</a></li>
                    </ul>
                    </div>
                )}
                
                <div className="logo">
                    <img src={logo} alt="" width="300rem" />
                </div>
                </header>
        </div>
    )
}