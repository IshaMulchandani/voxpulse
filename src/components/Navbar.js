import React, { useState } from 'react';
import './Navbar.css';

const Navbar = () => {
    const [activeItem, setActiveItem] = useState('Dashboard');

    const navItems = [
        'Dashboard',
        'Polls for you',
        'Reports',
        'Trending topics'
    ];

    return (
        <nav className="navbar">
            <div className="navbar-container">
                
                
                <ul className="nav-items">
                    {navItems.map((item, index) => (
                        <li 
                            key={index} 
                            className={`nav-item ${activeItem === item ? 'active' : ''}`}
                            onClick={() => setActiveItem(item)}
                        >
                            {item}
                        </li>
                    ))}
                </ul>

                <div className="nav-profile">
                    <div className="profile-icon">
                        <span>JS</span>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
