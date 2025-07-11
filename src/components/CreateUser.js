import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import './AdminPages.css';

const CreateUser = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'user',
        avatar: ''
    });
    const [notification, setNotification] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        if (!formData.firstName.trim()) {
            setNotification({ type: 'error', message: 'First name is required' });
            return false;
        }
        
        if (!formData.lastName.trim()) {
            setNotification({ type: 'error', message: 'Last name is required' });
            return false;
        }
        
        if (!formData.email.trim()) {
            setNotification({ type: 'error', message: 'Email is required' });
            return false;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setNotification({ type: 'error', message: 'Please enter a valid email address' });
            return false;
        }
        
        if (!formData.password) {
            setNotification({ type: 'error', message: 'Password is required' });
            return false;
        }
        
        if (formData.password.length < 6) {
            setNotification({ type: 'error', message: 'Password must be at least 6 characters long' });
            return false;
        }
        
        if (formData.password !== formData.confirmPassword) {
            setNotification({ type: 'error', message: 'Passwords do not match' });
            return false;
        }
        
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        // Simulate user creation
        console.log('Creating user:', {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            role: formData.role,
            avatar: formData.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100',
            accountCreated: new Date().toISOString(),
            interactions: 0
        });

        setNotification({ type: 'success', message: 'User created successfully!' });
        
        // Redirect after 2 seconds
        setTimeout(() => {
            navigate('/admin-manage-access');
        }, 2000);
    };

    const handleCancel = () => {
        navigate('/admin-manage-access');
    };

    const generateAvatar = () => {
        const avatars = [
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100',
            'https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&q=80&w=100',
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100',
            'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100',
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100',
            'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100'
        ];
        const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
        setFormData(prev => ({ ...prev, avatar: randomAvatar }));
    };

    return (
        <div>
            <AdminNavbar />
            <div className="admin-page">
                <div className="admin-page-container">
                    <div className="create-user-header">
                        <h1 className="admin-page-title">Create New User</h1>
                        <button 
                            type="button" 
                            className="cancel-btn"
                            onClick={handleCancel}
                        >
                            Back to Users
                        </button>
                    </div>

                    {notification && (
                        <div className={`notification ${notification.type}`}>
                            {notification.message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="create-user-form">
                        <div className="form-section">
                            <h3>Personal Information</h3>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="firstName">First Name *</label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        placeholder="Enter first name..."
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="lastName">Last Name *</label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        placeholder="Enter last name..."
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email Address *</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Enter email address..."
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="avatar">Profile Picture URL (Optional)</label>
                                <div className="avatar-input-group">
                                    <input
                                        type="url"
                                        id="avatar"
                                        name="avatar"
                                        value={formData.avatar}
                                        onChange={handleInputChange}
                                        placeholder="https://example.com/avatar.jpg"
                                    />
                                    <button
                                        type="button"
                                        className="generate-avatar-btn"
                                        onClick={generateAvatar}
                                    >
                                        Random Avatar
                                    </button>
                                </div>
                                {formData.avatar && (
                                    <div className="avatar-preview">
                                        <img src={formData.avatar} alt="User avatar preview" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="form-section">
                            <h3>Account Settings</h3>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="password">Password *</label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        placeholder="Enter password..."
                                        minLength="6"
                                        required
                                    />
                                    <small className="help-text">Password must be at least 6 characters long</small>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="confirmPassword">Confirm Password *</label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        placeholder="Confirm password..."
                                        minLength="6"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="role">Role</label>
                                <select
                                    id="role"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleInputChange}
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                                <small className="help-text">
                                    Admins have full access to manage polls, users, and reports
                                </small>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button 
                                type="button" 
                                className="cancel-btn"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                className="submit-btn"
                            >
                                Create User
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateUser;
