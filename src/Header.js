import './Header.css'
import logo from './Assets/logo.png'
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
                    {isMenuOpen ? <X size={24} className="close-icon" /> : <Menu size={24} />}
                </button>

                {isMenuOpen && (
                    <>
                        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
                        <div className="sidebar">
                            <div className="sidebar-header">
                                <h3>Trending Topics</h3>
                                <button className="close-sidebar" onClick={toggleSidebar}>
                                    <X size={20} />
                                </button>
                            </div>
                            <ul>
                                <li><a href="/">Crime</a></li>
                                <li><a href="/">Psychology</a></li>
                                <li><a href="/">Sports</a></li>
                                <li><a href="/">Politics</a></li>
                                <li><a href="/">Movies</a></li>
                            </ul>
                        </div>
                    </>
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