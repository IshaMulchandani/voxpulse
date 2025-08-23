import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PollsForYou.css';
import Navbar from './components/Navbar';
import urlsData from './imgs/img_urls.json';

import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from './firebase';

const PollsForYou = () => {
    const navigate = useNavigate();
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Extract the URLs from the nested structure
    const urls = urlsData.urls;

    useEffect(() => {
        const fetchPolls = async () => {
            try {
                const q = query(
                    collection(db, 'polls'),
                    orderBy('createdAt', 'desc')
                );
                const querySnapshot = await getDocs(q);
                const pollList = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        title: data.title,
                        description: data.description || 'Click to view and vote on this poll',
                        category: data.category || 'General',
                        status: data.status || 'active'
                    };
                }).filter(poll => poll.status !== 'closed'); // Only filter out closed polls
                setPolls(pollList);
            } catch (err) {
                setPolls([]);
            } finally {
                setLoading(false);
            }
        };
        fetchPolls();
    }, []);

    const handleCardClick = (pollId) => {
        navigate(`/vote/${pollId}`);
    };

    const handleVoteNow = (pollId) => {
        navigate(`/vote/${pollId}`);
    };

    return (
        <div className="section-page">
            <Navbar/><br /><br />
            <div className="page-header">
                <h1 className="section-title">Polls For You</h1>
            </div>
            
            {loading ? (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading polls...</p>
                </div>
            ) : polls.length === 0 ? (
                <div className="no-polls-container">
                    <div className="no-polls-message">
                        <h3>No Polls Available</h3>
                        <p>There are currently no active polls. Check back later for new content!</p>
                    </div>
                </div>
            ) : (
                <div className="polls-grid">
                    {polls.map(poll => (
                        <div 
                            key={poll.id} 
                            className="poll-card"
                            onClick={() => handleCardClick(poll.id)}
                        >
                            <img 
                                src={urls[poll.category] || 'https://via.placeholder.com/320x200?text=Poll+Image'} 
                                alt={poll.title} 
                                className="card-image" 
                            />
                            <div className="card-content">
                                <span className={`card-category category-${poll.category.toLowerCase()}`}>
                                    {poll.category}
                                </span>
                                <h2 className="card-title">{poll.title}</h2>
                                <p className="card-description">{poll.description}</p>
                                <button 
                                    className="vote-button" 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleVoteNow(poll.id);
                                    }}
                                >
                                    Vote Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PollsForYou;
