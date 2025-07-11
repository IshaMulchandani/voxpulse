import React, { useState, useRef, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeItem, setActiveItem] = useState(location.pathname.substring(1) || 'dashboard');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [userName, setUserName] = useState('');
    const dropdownRef = useRef(null);
    // Fetch user name from Firestore
    useEffect(() => {
        const fetchUserName = async () => {
            try {
                const auth = getAuth();
                const user = auth.currentUser;
                if (user) {
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    if (userDoc.exists()) {
                        const data = userDoc.data();
                        setUserName(data.name || data.email || '');
                    }
                }
            } catch (e) {
                setUserName('');
            }
        };
        fetchUserName();
    }, []);

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

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleEditProfile = () => {
        setDropdownOpen(false);
        // Add navigation to edit profile page later
        console.log('Edit Profile clicked');
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

                <div className="nav-profile" ref={dropdownRef}>
                    <div className="profile-icon" onClick={toggleDropdown}>
                 
                        {userName && (
                            <span className="user-name-navbar" style={{ marginLeft: 8, fontWeight: 500, fontSize: '1rem' }}>{userName}</span>
                        )}
                    </div>
                    {dropdownOpen && (
                        <div className="profile-dropdown">
                            <div className="dropdown-item" onClick={handleEditProfile}>
                                <span className="dropdown-icon">👤</span>
                                <span className="dropdown-text">Edit Profile</span>
                            </div>
                            <div className="dropdown-item" onClick={handleLogout}>
                                <span className="dropdown-icon">🚪</span>
                                <span className="dropdown-text">Logout</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
