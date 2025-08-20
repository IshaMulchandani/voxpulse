import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from './Navbar';
import './VotingPage.css';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const VotingPage = () => {
    const navigate = useNavigate();
    const { pollId } = useParams();
    const [selectedOption, setSelectedOption] = useState('');
    const [showNotification, setShowNotification] = useState(false);
    const [poll, setPoll] = useState(null);

    useEffect(() => {
        const fetchPoll = async () => {
            try {
                const pollDoc = await getDoc(doc(db, 'polls', pollId));
                if (pollDoc.exists()) {
                    setPoll(pollDoc.data());
                } else {
                    setPoll({
                        title: "Poll Not Found",
                        description: "The requested poll could not be found.",
                        options: []
                    });
                }
            } catch (e) {
                setPoll({
                    title: "Poll Not Found",
                    description: "The requested poll could not be found.",
                    options: []
                });
            }
        };
        fetchPoll();
    }, [pollId]);

    const handleOptionChange = (e) => {
        setSelectedOption(e.target.value);
    };


    const handleSubmit = async () => {
        if (!selectedOption || !poll) return;
        try {
            // Find the index of the selected option
            const optionIndex = poll.options.findIndex(opt => opt === selectedOption);
            if (optionIndex === -1) return;

            // Get current user
            const { getAuth } = await import('firebase/auth');
            const auth = getAuth();
            const user = auth.currentUser;
            if (!user) {
                alert('You must be logged in to vote.');
                return;
            }

            // Fetch user profile for detailed tracking
            const userProfileSnap = await getDoc(doc(db, 'users', user.uid));
            const profile = userProfileSnap.exists() ? userProfileSnap.data() : {};

            // Prepare user vote data with demographics
            const userVoteData = {
                userId: user.uid,
                optionIndex: optionIndex,
                option: selectedOption,
                timestamp: new Date(),
                userDetails: {
                    gender: profile.gender || 'Not Specified',
                    age: profile.age || 'Not Specified',
                    location: profile.location || 'Not Specified',
                    profession: profile.profession || 'Not Specified',
                    annualIncome: profile.annualIncome || 'Not Specified'
                }
            };

            // Get current poll data
            const pollRef = doc(db, 'polls', pollId);
            const currentPollSnap = await getDoc(pollRef);
            const currentPoll = currentPollSnap.data();

            // Initialize or get existing votesWithDetails array
            let votesWithDetails = currentPoll.votesWithDetails || [];
            
            // Check if user has already voted
            const existingVoteIndex = votesWithDetails.findIndex(vote => vote.userId === user.uid);
            if (existingVoteIndex !== -1) {
                // Update existing vote
                votesWithDetails[existingVoteIndex] = userVoteData;
            } else {
                // Add new vote
                votesWithDetails.push(userVoteData);
            }

            // Calculate total votes for each option
            const newVotes = Array(poll.options.length).fill(0);
            votesWithDetails.forEach(vote => {
                if (vote.optionIndex >= 0 && vote.optionIndex < newVotes.length) {
                    newVotes[vote.optionIndex]++;
                }
            });

            // Update the poll document with both votes array and detailed votes
            await updateDoc(pollRef, { 
                votes: newVotes,
                votesWithDetails: votesWithDetails
            });

            setShowNotification(true);
            // After 2 seconds, redirect back to trending topics
            setTimeout(() => {
                navigate('/trending');
            }, 2000);
        } catch (e) {
            console.error('Error submitting vote:', e);
            alert('Failed to submit vote. Please try again.');
        }
    };

    if (!poll) return (
        <div>
            <Navbar />
            <div className="voting-page">
                <div className="back-arrow" onClick={() => navigate(`/poll/${pollId}`)}>
                    ←
                </div>
                <div className="voting-container">
                    <h1>Loading...</h1>
                </div>
            </div>
        </div>
    );

    return (
        <div>
            <Navbar />
            <div className="voting-page">
                <div className="back-arrow" onClick={() => navigate(`/poll/${pollId}`)}>
                    ←
                </div>
                <div className="voting-container">
                    <h1 className="poll-title">{poll.title}</h1>
                    <p className="poll-description">{poll.description}</p>
                    
                    <div className="options-container">
                        {poll.options.map((option, index) => (
                            <div key={index} className="option-wrapper">
                                <input
                                    type="radio"
                                    id={`option-${index}`}
                                    name="poll-option"
                                    value={option}
                                    onChange={handleOptionChange}
                                    className="radio-button"
                                />
                                <label htmlFor={`option-${index}`} className="option-label">
                                    <span className="custom-radio"></span>
                                    <span className="option-text">{option}</span>
                                </label>
                            </div>
                        ))}
                    </div>

                    <button 
                        className={`submit-button ${selectedOption ? 'visible' : ''}`}
                        onClick={handleSubmit}
                        disabled={!selectedOption}
                    >
                        Submit Vote
                    </button>
                </div>

                {showNotification && (
                    <div className="toast-notification">
                        Vote has been registered
                    </div>
                )}
            </div>
        </div>
    );
};

export default VotingPage;
