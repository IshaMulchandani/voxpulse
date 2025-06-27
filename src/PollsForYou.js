import React from 'react';
import './PollsForYou.css';

const PollsForYou = () => {
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
        }
    };

    return (
        <div className="polls-page">
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
                                        <button className="vote-button">Vote Now</button>
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
