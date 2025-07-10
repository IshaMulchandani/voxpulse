import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PollsForYou.css';
import Navbar from './components/Navbar';


import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from './firebase';

const PollsForYou = () => {
    const navigate = useNavigate();
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPolls = async () => {
            try {
                const q = query(collection(db, 'polls'), orderBy('createdAt', 'desc'));
                const querySnapshot = await getDocs(q);
                const pollList = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        title: data.title,
                        category: data.category || 'General',
                    };
                });
                setPolls(pollList);
            } catch (err) {
                setPolls([]);
            } finally {
                setLoading(false);
            }
        };
        fetchPolls();
    }, []);

    const handleVoteNow = (pollId) => {
        navigate(`/vote/${pollId}`);
    };

    // Group polls by category
    const pollsByCategory = polls.reduce((acc, poll) => {
        if (!acc[poll.category]) acc[poll.category] = [];
        acc[poll.category].push(poll);
        return acc;
    }, {});

    return (
        <div className="polls-page">
            <Navbar/><br />
            <br />
            <h1 className="polls-title">Polls For You</h1>
            <div className="categories-grid">
                {loading ? (
                    <div>Loading polls...</div>
                ) : polls.length === 0 ? (
                    <div>No polls found.</div>
                ) : (
                    Object.entries(pollsByCategory).map(([category, pollsArr], index) => (
                        <div key={index} className="category-section">
                            <h2 className="category-title">{category}</h2>
                            <div className="polls-container">
                                {pollsArr.map((poll) => (
                                    <div key={poll.id} className="poll-item">
                                        <div className="poll-content">
                                            <h3 className="poll-title">{poll.title}</h3>
                                            <button className="vote-button" onClick={() => handleVoteNow(poll.id)}>Vote Now</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default PollsForYou;
