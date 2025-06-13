import './Header.css'
import logo from './Assets/main_logo.png'
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react'

export default function Header(){
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleSidebar = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return(
        <div className="headerCont">
            <header className="App-header">
                <button className="hamburger" onClick={toggleSidebar}>
                    {isMenuOpen ? <X size={24} style={{position: 'relative', bottom:'4rem'}}/> : <Menu size={24} />}
                </button>

                {isMenuOpen && (
                    <div className="sidebar">
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
                
                <div className="btns">
                    <div className="btn">
                        <button>Sign Up</button>
                    </div>
                    <div className="btn">
                        <button>Log In</button>
                    </div>
                </div>
            </header>
        </div>
    )
}