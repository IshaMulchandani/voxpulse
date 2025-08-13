import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { changePassword } from '../authFunctions';
import Navbar from './Navbar';
import './EditProfile.css';

const EditProfile = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [notification, setNotification] = useState(null);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNo: '',
        gender: '',
        dateOfBirth: '',
        age: '',
        profession: '',
        annualIncome: '',
        avatar: '',
        bio: '',
        location: '',
        interests: ''
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const auth = getAuth();
                const user = auth.currentUser;
                if (user) {
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    if (userDoc.exists()) {
                        const data = userDoc.data();
                        setFormData({
                            name: data.name || '',
                            email: data.email || user.email || '',
                            phoneNo: data.phoneNo || '',
                            gender: data.gender || '',
                            dateOfBirth: data.dateOfBirth || '',
                            age: data.age || '',
                            profession: data.profession || '',
                            annualIncome: data.annualIncome || '',
                            avatar: data.avatar || '',
                            bio: data.bio || '',
                            location: data.location || '',
                            interests: data.interests || ''
                        });
                    }
                } else {
                    navigate('/login');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                setNotification({ 
                    type: 'error', 
                    message: 'Failed to load profile data' 
                });
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const generateAvatar = () => {
        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || 'User')}&background=667eea&color=fff&size=200&font-size=0.6`;
        setFormData(prev => ({
            ...prev,
            avatar: avatarUrl
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const auth = getAuth();
            const user = auth.currentUser;
            if (user) {
                await updateDoc(doc(db, 'users', user.uid), {
                    name: formData.name,
                    phoneNo: formData.phoneNo,
                    gender: formData.gender,
                    dateOfBirth: formData.dateOfBirth,
                    profession: formData.profession,
                    annualIncome: formData.annualIncome,
                    bio: formData.bio,
                    location: formData.location,
                    interests: formData.interests,
                    avatar: formData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || 'User')}&background=667eea&color=fff&size=200&font-size=0.6`,
                    updatedAt: new Date().toISOString()
                });

                setNotification({ 
                    type: 'success', 
                    message: 'Profile updated successfully!' 
                });

                setTimeout(() => {
                    navigate('/dashboard');
                }, 2000);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setNotification({ 
                type: 'error', 
                message: 'Failed to update profile' 
            });
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setNotification({ 
                type: 'error', 
                message: 'New passwords do not match' 
            });
            return;
        }

        if (passwordForm.newPassword.length < 6) {
            setNotification({ 
                type: 'error', 
                message: 'Password must be at least 6 characters' 
            });
            return;
        }

        try {
            const result = await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
            
            if (result.success) {
                setNotification({ 
                    type: 'success', 
                    message: 'Password changed successfully!' 
                });
                setShowPasswordModal(false);
                setPasswordForm({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
            } else {
                setNotification({ 
                    type: 'error', 
                    message: result.error || 'Failed to change password' 
                });
            }
        } catch (error) {
            setNotification({ 
                type: 'error', 
                message: 'Failed to change password' 
            });
        }
    };

    if (loading) {
        return (
            <div className="edit-profile-loading">
                <div className="loading-spinner"></div>
                <p>Loading profile data...</p>
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <div className="edit-profile-page">
                <div className="edit-profile-container">
                    <div className="edit-profile-header">
                        <h1 className="edit-profile-title">Edit Profile</h1>
                        <p className="edit-profile-subtitle">Update your personal information and preferences</p>
                    </div>

                    {notification && (
                        <div className={`notification ${notification.type}`}>
                            {notification.message}
                        </div>
                    )}

                    <form className="edit-profile-form" onSubmit={handleSubmit}>
                        <div className="form-section">
                            <h3 className="section-title">Basic Information</h3>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="name">Full Name *</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Enter your full name"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        readOnly
                                        placeholder="Email cannot be changed"
                                        className="readonly-input"
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="phoneNo">Phone Number</label>
                                    <input
                                        type="tel"
                                        id="phoneNo"
                                        name="phoneNo"
                                        value={formData.phoneNo}
                                        onChange={handleInputChange}
                                        placeholder="Enter your phone number"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="gender">Gender</label>
                                    <select
                                        id="gender"
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Select gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="dateOfBirth">Date of Birth</label>
                                    <input
                                        type="date"
                                        id="dateOfBirth"
                                        name="dateOfBirth"
                                        value={formData.dateOfBirth}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="profession">Profession</label>
                                    <input
                                        type="text"
                                        id="profession"
                                        name="profession"
                                        value={formData.profession}
                                        onChange={handleInputChange}
                                        placeholder="Enter your profession"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="annualIncome">Annual Income</label>
                                <select
                                    id="annualIncome"
                                    name="annualIncome"
                                    value={formData.annualIncome}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select income range</option>
                                    <option value="0-100000">₹0 - ₹1,00,000</option>
                                    <option value="100001-300000">₹1,00,001 - ₹3,00,000</option>
                                    <option value="300001-600000">₹3,00,001 - ₹6,00,000</option>
                                    <option value="600001-1000000">₹6,00,001 - ₹10,00,000</option>
                                    <option value="1000000+">₹10,00,000+</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="bio">Bio</label>
                                <textarea
                                    id="bio"
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleInputChange}
                                    placeholder="Tell us about yourself..."
                                    rows="4"
                                    maxLength="500"
                                />
                                <span className="char-count">{formData.bio.length}/500</span>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="location">Location</label>
                                    <input
                                        type="text"
                                        id="location"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        placeholder="City, Country"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="interests">Interests</label>
                                    <input
                                        type="text"
                                        id="interests"
                                        name="interests"
                                        value={formData.interests}
                                        onChange={handleInputChange}
                                        placeholder="Technology, Sports, Music..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-section">
                            <h3 className="section-title">Security</h3>
                            
                            <div className="password-section">
                                <div className="form-group">
                                    <label>Password</label>
                                    <div className="password-display">
                                        <button 
                                            type="button" 
                                            className="change-password-btn"
                                            onClick={() => setShowPasswordModal(true)}
                                        >
                                            Change Password
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="form-section">
                            <h3 className="section-title">Profile Picture</h3>
                            
                            <div className="avatar-section">
                                <div className="avatar-preview">
                                    {formData.avatar && (
                                        <img 
                                            src={formData.avatar} 
                                            alt="Profile Preview" 
                                            onError={(e) => {
                                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || 'User')}&background=667eea&color=fff&size=200&font-size=0.6`;
                                            }}
                                        />
                                    )}
                                </div>
                                
                                <div className="avatar-controls">
                                    <div className="form-group">
                                        <label htmlFor="avatar">Avatar URL</label>
                                        <input
                                            type="url"
                                            id="avatar"
                                            name="avatar"
                                            value={formData.avatar}
                                            onChange={handleInputChange}
                                            placeholder="Enter image URL or generate one"
                                        />
                                        <button 
                                            type="button" 
                                            className="generate-avatar-btn"
                                            onClick={generateAvatar}
                                        >
                                            Generate
                                        </button>
                                        <span className="help-text">
                                            You can use a custom image URL or generate one based on your name
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button 
                                type="button" 
                                className="cancel-btn"
                                onClick={() => navigate('/dashboard')}
                            >
                                Cancel
                            </button>
                            
                            <button 
                                type="submit" 
                                className="save-btn"
                                disabled={saving}
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>

                    {/* Password Change Modal */}
                    {showPasswordModal && (
                        <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
                            <div className="password-modal" onClick={(e) => e.stopPropagation()}>
                                <h3>Change Password</h3>
                                <form onSubmit={handlePasswordSubmit}>
                                    <div className="form-group">
                                        <label htmlFor="currentPassword">Current Password</label>
                                        <input
                                            type="password"
                                            id="currentPassword"
                                            name="currentPassword"
                                            value={passwordForm.currentPassword}
                                            onChange={handlePasswordChange}
                                            placeholder="Enter current password"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="newPassword">New Password</label>
                                        <input
                                            type="password"
                                            id="newPassword"
                                            name="newPassword"
                                            value={passwordForm.newPassword}
                                            onChange={handlePasswordChange}
                                            placeholder="Enter new password (min 6 characters)"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="confirmPassword">Confirm New Password</label>
                                        <input
                                            type="password"
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            value={passwordForm.confirmPassword}
                                            onChange={handlePasswordChange}
                                            placeholder="Confirm new password"
                                            required
                                        />
                                    </div>

                                    <div className="modal-actions">
                                        <button 
                                            type="button" 
                                            className="cancel-btn"
                                            onClick={() => setShowPasswordModal(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            type="submit" 
                                            className="save-btn"
                                        >
                                            Change Password
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditProfile;
