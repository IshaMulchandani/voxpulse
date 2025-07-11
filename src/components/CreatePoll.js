
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import './AdminPages.css';
import { db } from '../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

const CreatePoll = () => {
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
        // Validation
        if (!formData.title.trim()) {
            setNotification({ type: 'error', message: 'Poll title is required' });
            return;
        }
        if (!formData.description.trim()) {
            setNotification({ type: 'error', message: 'Poll description is required' });
            return;
        }
        if (!formData.category) {
            setNotification({ type: 'error', message: 'Please select a category' });
            return;
        }
        const validOptions = formData.options.filter(option => option.trim() !== '');
        if (validOptions.length < 2) {
            setNotification({ type: 'error', message: 'At least 2 options are required' });
            return;
        }

        

        // Save poll to Firestore
        try {
            await addDoc(collection(db, 'polls'), {
                title: formData.title,
                description: formData.description,
                category: formData.category,
                options: validOptions,
                imageUrl: formData.imageUrl,
                duration: formData.duration,
                createdAt: Timestamp.now(),
                votes: Array(validOptions.length).fill(0)
            });
            setNotification({ type: 'success', message: 'Poll created successfully!' });
            setTimeout(() => {
                navigate('/admin-create-polls');
            }, 2000);
        } catch (error) {
            setNotification({ type: 'error', message: 'Failed to create poll. Please try again.' });
            console.error('Error adding poll:', error);
        }
    };

    const handleCancel = () => {
        navigate('/admin-create-polls');
    };

    return (
        <div>
            <AdminNavbar />
            <div className="admin-page">
                <div className="admin-page-container">
                    <div className="create-poll-header">
                        <h1 className="admin-page-title">Create New Poll</h1>
                        <button 
                            type="button" 
                            className="cancel-btn"
                            onClick={handleCancel}
                        >
                            Back to Polls
                        </button>
                    </div>

                    {notification && (
                        <div className={`notification ${notification.type}`}>
                            {notification.message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="create-poll-form">
                        <div className="form-section">
                            <h3>Basic Information</h3>
                            
                            <div className="form-group">
                                <label htmlFor="title">Poll Title *</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="Enter poll title..."
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
                                    placeholder="Provide a detailed description of your poll..."
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
                                    <option value="">Select a category</option>
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
                                    placeholder="https://example.com/image.jpg"
                                />
                                {formData.imageUrl && (
                                    <div className="image-preview">
                                        <img src={formData.imageUrl} alt="Poll preview" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="form-section">
                            <h3>Poll Options</h3>
                            <p className="section-description">Add between 2-6 options for your poll</p>
                            
                            {formData.options.map((option, index) => (
                                <div key={index} className="option-group">
                                    <label htmlFor={`option-${index}`}>Option {index + 1}</label>
                                    <div className="option-input-group">
                                        <input
                                            type="text"
                                            id={`option-${index}`}
                                            value={option}
                                            onChange={(e) => handleOptionChange(index, e.target.value)}
                                            placeholder={`Enter option ${index + 1}...`}
                                            maxLength="100"
                                        />
                                        {formData.options.length > 2 && (
                                            <button
                                                type="button"
                                                className="remove-option-btn"
                                                onClick={() => removeOption(index)}
                                            >
                                                ×
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {formData.options.length < 6 && (
                                <button
                                    type="button"
                                    className="add-option-btn"
                                    onClick={addOption}
                                >
                                    + Add Option
                                </button>
                            )}
                        </div>

                        <div className="form-section">
                            <h3>Poll Settings</h3>
                            
                            <div className="form-group">
                                <label htmlFor="duration">Poll Duration</label>
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
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                className="submit-btn"
                            >
                                Create Poll
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreatePoll;
