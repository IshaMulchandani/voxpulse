import './Header2.css'
import logo from './Assets/logo.png'
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext';

export default function Header2(){
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();
    const { user } = useAuth();
    
    const toggleSidebar = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Hide sidebar for admin pages or when user is not logged in
    const shouldShowSidebar = user && !location.pathname.startsWith('/admin-');

    return(
        <div className="header2Cont">
            <header className="App-header">
                {shouldShowSidebar && (
                    <button className="hamburger" onClick={toggleSidebar}>
                        {isMenuOpen ? <X size={24} className="close-icon" /> : <Menu size={24} />}
                    </button>
                )}

                {shouldShowSidebar && isMenuOpen && (
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
                                <li><Link to="/category/crime" onClick={toggleSidebar}>Crime</Link></li>
                                <li><Link to="/category/psychology" onClick={toggleSidebar}>Psychology</Link></li>
                                <li><Link to="/category/sports" onClick={toggleSidebar}>Sports</Link></li>
                                <li><Link to="/category/politics" onClick={toggleSidebar}>Politics</Link></li>
                                <li><Link to="/category/movies" onClick={toggleSidebar}>Movies</Link></li>
                            </ul>
                        </div>
                    </>
                )}
                
                <div className="logo">
                    <img src={logo} alt="" width="300rem" />
                </div>
                </header>
        </div>
    )
}