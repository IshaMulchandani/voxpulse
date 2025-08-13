import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import './UserCreatePoll.css';
import { db } from '../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

const UserCreatePoll = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        options: ['', ''],
        imageUrl: '',
        duration: '7'
    });
    const [notification, setNotification] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const categories = [
        'Technology',
        'Politics',
        'Environment',
        'Education',
        'Health',
        'Entertainment',
        'Sports',
        'Business',
        'Science',
        'Social Issues'
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...formData.options];
        newOptions[index] = value;
        setFormData(prev => ({
            ...prev,
            options: newOptions
        }));
    };

    const addOption = () => {
        if (formData.options.length < 6) {
            setFormData(prev => ({
                ...prev,
                options: [...prev.options, '']
            }));
        }
    };

    const removeOption = (index) => {
        if (formData.options.length > 2) {
            const newOptions = formData.options.filter((_, i) => i !== index);
            setFormData(prev => ({
                ...prev,
                options: newOptions
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Validation
        if (!formData.title.trim()) {
            setNotification({ type: 'error', message: 'Poll title is required' });
            setIsSubmitting(false);
            return;
        }
        if (!formData.description.trim()) {
            setNotification({ type: 'error', message: 'Poll description is required' });
            setIsSubmitting(false);
            return;
        }
        if (!formData.category) {
            setNotification({ type: 'error', message: 'Please select a category' });
            setIsSubmitting(false);
            return;
        }
        const validOptions = formData.options.filter(option => option.trim() !== '');
        if (validOptions.length < 2) {
            setNotification({ type: 'error', message: 'At least 2 options are required' });
            setIsSubmitting(false);
            return;
        }

        // Save poll to Firestore
        try {
            const endDate = formData.duration === '0' 
                ? null 
                : new Date(Date.now() + (parseInt(formData.duration) * 24 * 60 * 60 * 1000));

            await addDoc(collection(db, 'polls'), {
                title: formData.title,
                description: formData.description,
                category: formData.category,
                options: validOptions,
                imageUrl: formData.imageUrl,
                duration: formData.duration,
                endDate: endDate,
                createdAt: Timestamp.now(),
                createdBy: 'User', // You can replace this with actual user info
                votes: Array(validOptions.length).fill(0),
                status: 'active'
            });
            
            setNotification({ type: 'success', message: 'Poll created successfully!' });
            setTimeout(() => {
                navigate('/trending-topics');
            }, 2000);
        } catch (error) {
            setNotification({ type: 'error', message: 'Failed to create poll. Please try again.' });
            console.error('Error adding poll:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate('/trending-topics');
    };

    // Auto-hide notification after 5 seconds
    React.useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    return (
        <div className="user-create-poll-page">
            <Navbar />
            <div className="create-poll-container">
                <div className="create-poll-header">
                    <h1 className="page-title">Create Your Poll</h1>
                    <p className="page-subtitle">Share your ideas and get the community's opinion</p>
                </div>

                {notification && (
                    <div className={`notification ${notification.type}`}>
                        <span className="notification-icon">
                            {notification.type === 'success' ? '✅' : '❌'}
                        </span>
                        {notification.message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="poll-form">
                    <div className="form-section">
                        <h3 className="section-title">Basic Information</h3>
                        
                        <div className="form-group">
                            <label htmlFor="title">Poll Title *</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="What would you like to ask?"
                                maxLength="200"
                                required
                            />
                            <span className="char-count">{formData.title.length}/200</span>
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">Description *</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Provide context and details about your poll..."
                                rows="4"
                                maxLength="1000"
                                required
                            />
                            <span className="char-count">{formData.description.length}/1000</span>
                        </div>

                        <div className="form-group">
                            <label htmlFor="category">Category *</label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Choose a category</option>
                                {categories.map(category => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="imageUrl">Image URL (Optional)</label>
                            <input
                                type="url"
                                id="imageUrl"
                                name="imageUrl"
                                value={formData.imageUrl}
                                onChange={handleInputChange}
                                placeholder="Add an image to make your poll more engaging"
                            />
                            {formData.imageUrl && (
                                <div className="image-preview">
                                    <img 
                                        src={formData.imageUrl} 
                                        alt="Poll preview" 
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="form-section">
                        <h3 className="section-title">Poll Options</h3>
                        <p className="section-description">Add 2-6 options for people to choose from</p>
                        
                        {formData.options.map((option, index) => (
                            <div key={index} className="option-group">
                                <label htmlFor={`option-${index}`}>Option {index + 1} *</label>
                                <div className="option-input-group">
                                    <input
                                        type="text"
                                        id={`option-${index}`}
                                        value={option}
                                        onChange={(e) => handleOptionChange(index, e.target.value)}
                                        placeholder={`Enter option ${index + 1}...`}
                                        maxLength="100"
                                        required={index < 2}
                                    />
                                    {formData.options.length > 2 && (
                                        <button
                                            type="button"
                                            className="remove-option-btn"
                                            onClick={() => removeOption(index)}
                                            title="Remove this option"
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                                <span className="char-count">{option.length}/100</span>
                            </div>
                        ))}

                        {formData.options.length < 6 && (
                            <button
                                type="button"
                                className="add-option-btn"
                                onClick={addOption}
                            >
                                + Add Another Option
                            </button>
                        )}
                    </div>

                    <div className="form-section">
                        <h3 className="section-title">Poll Settings</h3>
                        
                        <div className="form-group">
                            <label htmlFor="duration">How long should this poll run?</label>
                            <select
                                id="duration"
                                name="duration"
                                value={formData.duration}
                                onChange={handleInputChange}
                            >
                                <option value="1">1 day</option>
                                <option value="3">3 days</option>
                                <option value="7">1 week</option>
                                <option value="14">2 weeks</option>
                                <option value="30">1 month</option>
                                <option value="0">No expiration</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button 
                            type="button" 
                            className="cancel-btn"
                            onClick={handleCancel}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className={`submit-btn ${isSubmitting ? 'loading' : ''}`}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Creating Poll...' : 'Create Poll'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserCreatePoll;
