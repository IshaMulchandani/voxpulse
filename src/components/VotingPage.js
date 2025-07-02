import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from './Navbar';
import './VotingPage.css';

const VotingPage = () => {
    const navigate = useNavigate();
    const { pollId } = useParams();
    const [selectedOption, setSelectedOption] = useState('');
    const [showNotification, setShowNotification] = useState(false);
    const [poll, setPoll] = useState(null);

    // Simulated poll data - in a real app, this would come from your backend
    useEffect(() => {
        // This is mock data - replace with actual API call
        const pollData = {
            1: {
                title: "Should AI Development Have Stricter Regulations?",
                description: "With recent advances in artificial intelligence, should there be more oversight on AI development and deployment?",
                options: [
                    "Yes, stricter regulations are needed immediately",
                    "Some regulation is needed but not too restrictive",
                    "Current regulations are sufficient",
                    "No, regulations would hinder innovation",
                    "Need more research before deciding"
                ]
            },
            2: {
                title: "Global Climate Action: Individual vs Corporate Responsibility",
                description: "Who should bear more responsibility for climate change action - individuals or corporations?",
                options: [
                    "Primarily corporate responsibility",
                    "Equally shared responsibility",
                    "Primarily individual responsibility",
                    "Government responsibility",
                    "International organization responsibility"
                ]
            },
            3: {
                title: "The Future of Remote Work",
                description: "Should companies maintain remote work policies post-pandemic, or return to traditional office settings?",
                options: [
                    "Fully remote work should be standard",
                    "Hybrid model is best",
                    "Return to office with flexible hours",
                    "Complete return to traditional office",
                    "Let employees choose their preference"
                ]
            },
            4: {
                title: "E-Sports in Olympics",
                description: "Should e-sports be included as an official Olympic sport in future games?",
                options: [
                    "Yes, include all major e-sports",
                    "Include only select e-sports titles",
                    "Create a separate Olympic e-sports event",
                    "No, keep Olympics traditional",
                    "Need more discussion and research"
                ]
            },
            5: {
                title: "Social Media Age Restrictions",
                description: "Should there be stricter age verification for social media platform access?",
                options: [
                    "Yes, with strict ID verification",
                    "Yes, but with parental controls option",
                    "Keep current age restrictions",
                    "Lower age restrictions with safeguards",
                    "Let parents decide entirely"
                ]
            },
            6: {
                title: "Universal Basic Income",
                description: "Should governments implement universal basic income to address economic inequality?",
                options: [
                    "Yes, implement UBI immediately",
                    "Start with pilot programs",
                    "Only for those in need",
                    "Focus on job creation instead",
                    "Need more economic research"
                ]
            },
            7: {
                title: "Mental Health in Education",
                description: "Should mental health education be mandatory in all schools?",
                options: [
                    "Yes, as a separate subject",
                    "Integrate into existing curriculum",
                    "Optional but encouraged",
                    "Only in higher grades",
                    "Leave it to school discretion"
                ]
            },
            8: {
                title: "Digital Privacy Rights",
                description: "How much control should users have over their personal data online?",
                options: [
                    "Complete control with opt-in only",
                    "Balanced control with transparency",
                    "Current regulations are sufficient",
                    "Basic control with business needs",
                    "Varies by type of data"
                ]
            },
            9: {
                title: "Future of Public Transportation",
                description: "Should cities invest more in public transport or focus on autonomous vehicles?",
                options: [
                    "Prioritize public transportation",
                    "Equal investment in both",
                    "Focus on autonomous vehicles",
                    "Improve existing infrastructure first",
                    "Depends on city size and density"
                ]
            },
            10: {
                title: "Renewable Energy Transition",
                description: "How quickly should countries transition to 100% renewable energy?",
                options: [
                    "Immediate transition (5-10 years)",
                    "Gradual transition (10-20 years)",
                    "Balanced approach (20-30 years)",
                    "Market-driven timeline",
                    "Based on individual country capacity"
                ]
            },
            11: {
                title: "Healthcare System Reform",
                description: "What changes are needed in the current healthcare system?",
                options: [
                    "Universal healthcare for all",
                    "Hybrid public-private system",
                    "Market-based with regulations",
                    "Focus on preventive care",
                    "Technology-driven healthcare"
                ]
            },
            12: {
                title: "Space Exploration Funding",
                description: "Should more public funding be allocated to space exploration?",
                options: [
                    "Significantly increase funding",
                    "Maintain current funding levels",
                    "Reduce public funding",
                    "Switch to private sector funding",
                    "Focus on Earth-based issues first"
                ]
            }
        };

        setPoll(pollData[pollId] || {
            title: "Poll Not Found",
            description: "The requested poll could not be found.",
            options: []
        });
    }, [pollId]);

    const handleOptionChange = (e) => {
        setSelectedOption(e.target.value);
    };

    const handleSubmit = () => {
        // Here you would typically make an API call to submit the vote
        setShowNotification(true);
        
        // After 2 seconds, redirect back to trending topics
        setTimeout(() => {
            navigate('/trending');
        }, 2000);
    };

    if (!poll) return (
        <div>
            <Navbar />
            <div className="voting-page">
                <div className="back-arrow" onClick={() => navigate('/trending')}>
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
                <div className="back-arrow" onClick={() => navigate('/trending')}>
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
