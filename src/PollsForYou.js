import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PollsForYou.css';
import Navbar from './components/Navbar';

const PollsForYou = () => {
    const navigate = useNavigate();

    const handleVoteNow = () => {
        // Generate a random poll ID between 1 and 12 (matching your VotingPage data)
        const randomPollId = Math.floor(Math.random() * 12) + 1;
        navigate(`/vote/${randomPollId}`);
    };

    const categories = {
        forYou: {
            title: "For You",
            polls: [
                "What's your preferred work schedule?",
                "Which programming language do you use most?",
                "How often do you exercise?",
                "Favorite way to learn new skills?",
                "What's your ideal vacation type?",
                "How do you prefer to commute?"
            ]
        },
        recommended: {
            title: "Recommended Polls",
            polls: [
                "Best productivity tools for remote work",
                "Most effective learning platforms",
                "Preferred social media platform",
                "Favorite weekend activity",
                "Best method for stress management",
                "Most important job benefit"
            ]
        },
        technology: {
            title: "Technology",
            polls: [
                "Favorite smartphone brand?",
                "Best cloud storage service?",
                "Preferred OS for development?",
                "Most used social app?",
                "AI in daily life: Good or Bad?",
                "Best laptop for students?"
            ]
        },
        sports: {
            title: "Sports",
            polls: [
                "Favorite sport to watch?",
                "Best Olympic moment?",
                "Most inspiring athlete?",
                "Team or individual sports?",
                "Best way to stay fit?",
                "Should e-sports be in Olympics?"
            ]
        },
        politics: {
            title: "Politics",
            polls: [
                "Views on environmental policies",
                "Opinion on universal basic income",
                "Local government effectiveness",
                "Education system reforms",
                "Healthcare policy preferences",
                "Economic recovery measures"
            ]
        },
        theatre: {
            title: "Theatre",
            polls: [
                "Best theatre production of 2025",
                "Favorite theatre genre",
                "Opinion on modern adaptations",
                "Best local theatre venue",
                "Preferred seating location",
                "Most anticipated upcoming show"
            ]
        },
        crime: {
            title: "Crime",
            polls: [
                "Most effective crime prevention methods",
                "Opinion on rehabilitation programs",
                "Community policing effectiveness",
                "Cyber crime concerns",
                "Public safety measures",
                "Justice system reforms"
            ]
        },
        psychology: {
            title: "Psychology",
            polls: [
                "Impact of social media on mental health",
                "Work-life balance importance",
                "Stress management techniques",
                "Remote work psychological effects",
                "Digital wellness practices",
                "Personal growth priorities"
            ]
        }
    };

    return (
        <div className="polls-page">
            <Navbar/><br />
            <br />
            <h1 className="polls-title">Polls For You</h1>
            <div className="categories-grid">
                {Object.values(categories).map((category, index) => (
                    <div key={index} className="category-section">
                        <h2 className="category-title">{category.title}</h2>
                        <div className="polls-container">
                            {category.polls.map((poll, pollIndex) => (
                                <div key={pollIndex} className="poll-item">
                                    <div className="poll-content">
                                        <h3 className="poll-title">{poll}</h3>
                                        <button className="vote-button" onClick={handleVoteNow}>Vote Now</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PollsForYou;
