import './Header.css'
import logo from './Assets/main_logo.png'
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import SignUp from './SignUp';

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
                        <Link to={'/signUp'}><button>Sign Up</button></Link>
                    </div>
                    <div className="btn">
                        <Link to={'/login'}><button>Log In</button></Link>
                    </div>
                </div>
            </header>
        </div>
    )
}