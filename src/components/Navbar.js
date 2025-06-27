import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeItem, setActiveItem] = useState(location.pathname.substring(1) || 'dashboard');

    const navItems = [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Polls for you', path: '/polls' },
        { name: 'Reports', path: '/reports' },
        { name: 'Trending topics', path: '/trending' }
    ];

    const handleNavigation = (path, name) => {
        setActiveItem(name);
        navigate(path);
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <ul className="nav-items">
                    {navItems.map((item, index) => (
                        <li 
                            key={index} 
                            className={`nav-item ${activeItem === item.name ? 'active' : ''}`}
                            onClick={() => handleNavigation(item.path, item.name)}
                        >
                            {item.name}
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
