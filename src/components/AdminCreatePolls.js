import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import './AdminPages.css';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const AdminCreatePolls = () => {
    const navigate = useNavigate();
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleCreatePoll = () => {
        navigate('/admin-create-poll');
    };

    const formatDate = (timestamp) => {
        const date = timestamp?.toDate?.();
        return date
            ? date.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
              })
            : 'N/A';
    };

    const handleClosePoll = (pollId) => {
        console.log(`Closing poll with ID: ${pollId}`);
        // Future: implement poll closing logic
    };

    useEffect(() => {
        const fetchPolls = async () => {
            try {
                const snapshot = await getDocs(collection(db, 'polls'));
                const pollList = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setPolls(pollList);
            } catch (error) {
                console.error('Error fetching polls:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPolls();
    }, []);

    return (
        <div>
            <AdminNavbar />
            <div className="admin-page">
                <div className="admin-page-container">
                    <div className="create-poll-header">
                        <h1 className="admin-page-title">Poll Management</h1>
                        <button className="create-poll-btn" onClick={handleCreatePoll}>
                            + Create New Poll
                        </button>
                    </div>

                    {loading ? (
                        <p>Loading polls...</p>
                    ) : polls.length === 0 ? (
                        <p>No polls found.</p>
                    ) : (
                        <div className="polls-list">
                            {polls.map(poll => (
                                <div key={poll.id} className="poll-management-card">
                                    <div className="poll-image">
                                        <img
                                            src={poll.imageUrl || 'https://via.placeholder.com/200x150?text=No+Image'}
                                            alt={poll.title}
                                        />
                                    </div>

                                    <div className="poll-details">
                                        <h3 className="poll-title">{poll.title}</h3>
                                        <div className="poll-meta">
                                            <div className="meta-item">
                                                <span className="meta-label">Created on:</span>
                                                <span className="meta-value">
                                                    {formatDate(poll.createdAt)}
                                                </span>
                                            </div>
                                            <div className="meta-item">
                                                <span className="meta-label">Votes received:</span>
                                                <span className="meta-value">
                                                    {poll.votes?.reduce((a, b) => a + b, 0) ?? 0}
                                                </span>
                                            </div>
                                            <div className="meta-item">
                                                <span className="meta-label">Votes per option:</span>
                                                <ul className="votes-per-option-list">
                                                    {poll.options && poll.options.map((option, idx) => (
                                                        <li key={idx}>
                                                            {option}: {poll.votes && poll.votes[idx] !== undefined ? poll.votes[idx] : 0}
                                                        </li>
                                                    ))}
                                                </ul>
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
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminCreatePolls;
