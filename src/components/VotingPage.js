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

            // Prepare new votes array
            let newVotes = poll.votes ? [...poll.votes] : Array(poll.options.length).fill(0);
            newVotes[optionIndex] = (newVotes[optionIndex] || 0) + 1;

            // Update Firestore
            await updateDoc(doc(db, 'polls', pollId), { votes: newVotes });

            setShowNotification(true);
            // After 2 seconds, redirect back to trending topics
            setTimeout(() => {
                navigate('/trending');
            }, 2000);
        } catch (e) {
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
