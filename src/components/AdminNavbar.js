import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './AdminNavbar.css';

const AdminNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeItem, setActiveItem] = useState(location.pathname.substring(1) || 'admin-dashboard');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const navItems = [
        { name: 'Dashboard', path: '/admin-dashboard' },
        { name: 'Poll Management', path: '/admin-create-polls' },
        { name: 'Generate Reports', path: '/admin-reports' },
        { name: 'User Management', path: '/admin-manage-access' }
    ];

    const handleNavigation = (path, name) => {
        setActiveItem(name);
        navigate(path);
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleLogout = () => {
        setDropdownOpen(false);
        // Navigate to home page on logout
        navigate('/');
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <nav className="admin-navbar">
            <div className="admin-navbar-container">
                <ul className="admin-nav-items">
                    {navItems.map((item, index) => (
                        <li 
                            key={index} 
                            className={`admin-nav-item ${activeItem === item.name ? 'active' : ''}`}
                            onClick={() => handleNavigation(item.path, item.name)}
                        >
                            {item.name}
                        </li>
                    ))}
                </ul>

                <div className="admin-nav-profile" ref={dropdownRef}>
                    <div className="admin-profile-icon" onClick={toggleDropdown}>
                        <span>A</span>
                    </div>
                    
                    {dropdownOpen && (
                        <div className="admin-profile-dropdown">
                            <div className="admin-dropdown-item" onClick={handleLogout}>
                                <span className="admin-dropdown-icon">🚪</span>
                                <span className="admin-dropdown-text">Logout</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default AdminNavbar;
