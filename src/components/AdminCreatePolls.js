import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import './AdminPages.css';

const AdminCreatePolls = () => {
    const navigate = useNavigate();
    
    // Dummy data for existing polls
    const existingPolls = [
        {
            id: 1,
            title: "Should AI Development Have Stricter Regulations?",
            createdOn: "2025-07-01",
            votes: 245,
            image: "https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&q=80&w=200"
        },
        {
            id: 2,
            title: "Global Climate Action: Individual vs Corporate Responsibility",
            createdOn: "2025-06-28",
            votes: 189,
            image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=200"
        },
        {
            id: 3,
            title: "The Future of Remote Work",
            createdOn: "2025-06-25",
            votes: 156,
            image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=200"
        },
        {
            id: 4,
            title: "E-Sports in Olympics",
            createdOn: "2025-06-22",
            votes: 134,
            image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=200"
        },
        {
            id: 5,
            title: "Social Media Age Restrictions",
            createdOn: "2025-06-20",
            votes: 198,
            image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=200"
        },
        {
            id: 6,
            title: "Universal Basic Income Implementation",
            createdOn: "2025-06-18",
            votes: 276,
            image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=200"
        },
        {
            id: 7,
            title: "Mental Health Education in Schools",
            createdOn: "2025-06-15",
            votes: 167,
            image: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&q=80&w=200"
        },
        {
            id: 8,
            title: "Digital Privacy Rights and Data Protection",
            createdOn: "2025-06-12",
            votes: 213,
            image: "https://images.unsplash.com/photo-1563237023-b1e970526dcb?auto=format&fit=crop&q=80&w=200"
        },
        {
            id: 9,
            title: "Future of Public Transportation Systems",
            createdOn: "2025-06-10",
            votes: 145,
            image: "https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?auto=format&fit=crop&q=80&w=200"
        },
        {
            id: 10,
            title: "Renewable Energy Transition Timeline",
            createdOn: "2025-06-08",
            votes: 289,
            image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=200"
        }
    ];

    const handleClosePoll = (pollId) => {
        // Handle poll closure logic
        console.log(`Closing poll with ID: ${pollId}`);
        // In a real app, you would make an API call here
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    };

    const handleCreatePoll = () => {
        navigate('/admin-create-poll');
    };

    return (
        <div>
            <AdminNavbar />
            <div className="admin-page">
                <div className="admin-page-container">
                    <div className="create-poll-header">
                        <h1 className="admin-page-title">Poll Management</h1>
                        <button 
                            className="create-poll-btn"
                            onClick={handleCreatePoll}
                        >
                            + Create New Poll
                        </button>
                    </div>
                    
                    <div className="polls-list">
                        {existingPolls.map(poll => (
                            <div key={poll.id} className="poll-management-card">
                                <div className="poll-image">
                                    <img src={poll.image} alt={poll.title} />
                                </div>
                                
                                <div className="poll-details">
                                    <h3 className="poll-title">{poll.title}</h3>
                                    <div className="poll-meta">
                                        <div className="meta-item">
                                            <span className="meta-label">Created on:</span>
                                            <span className="meta-value">{formatDate(poll.createdOn)}</span>
                                        </div>
                                        <div className="meta-item">
                                            <span className="meta-label">Votes received:</span>
                                            <span className="meta-value">{poll.votes}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="poll-actions">
                                    <button 
                                        className="close-poll-btn"
                                        onClick={() => handleClosePoll(poll.id)}
                                    >
                                        Close Poll
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminCreatePolls;
