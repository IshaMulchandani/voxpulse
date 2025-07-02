import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from './Navbar';
import './CommentsPage.css';

const CommentsPage = () => {
    const navigate = useNavigate();
    const { pollId } = useParams();
    const [poll, setPoll] = useState(null);
    const [newComment, setNewComment] = useState('');
    const [comments, setComments] = useState([]);

    useEffect(() => {
        // This is mock data - replace with actual API call
        const pollData = {
            1: {
                title: "Should AI Development Have Stricter Regulations?",
                description: "This poll explores the balance between innovation and safety in AI development. The rapid advancement of artificial intelligence raises questions about potential risks and the need for regulatory frameworks.",
                comments: [
                    {
                        id: 1,
                        userName: "TechExpert",
                        comment: "While innovation is crucial, we need to establish clear guidelines to prevent potential misuse. The recent developments in AI have shown both promise and concerns.",
                        sentiment: "neutral",
                        likes: 15,
                        userInitial: "T"
                    },
                    {
                        id: 2,
                        userName: "AIResearcher",
                        comment: "As someone working in the field, I believe strict regulations could significantly slow down progress. Instead, we should focus on establishing ethical guidelines.",
                        sentiment: "negative",
                        likes: 8,
                        userInitial: "A"
                    },
                    {
                        id: 3,
                        userName: "PolicyAnalyst",
                        comment: "The key is finding the right balance. We've seen great examples of AI regulation in some countries that haven't hindered innovation.",
                        sentiment: "positive",
                        likes: 23,
                        userInitial: "P"
                    }
                ]
            },
            2: {
                title: "Global Climate Action: Individual vs Corporate Responsibility",
                description: "This poll addresses the ongoing debate about who bears the primary responsibility for addressing climate change - individuals through lifestyle changes or corporations through systemic reforms.",
                comments: [
                    {
                        id: 1,
                        userName: "EcoActivist",
                        comment: "Corporate responsibility should be the focus. Individual actions matter, but 100 companies are responsible for 71% of global emissions.",
                        sentiment: "negative",
                        likes: 45,
                        userInitial: "E"
                    },
                    {
                        id: 2,
                        userName: "BusinessAnalyst",
                        comment: "Both parties need to take action. Corporations need to change practices, but consumer behavior drives corporate decisions.",
                        sentiment: "neutral",
                        likes: 32,
                        userInitial: "B"
                    }
                ]
            },
            3: {
                title: "The Future of Remote Work",
                description: "This poll examines the shifting workplace dynamics post-pandemic and the potential long-term implications for both employers and employees.",
                comments: [
                    {
                        id: 1,
                        userName: "WorkCulture",
                        comment: "Hybrid models offer the best of both worlds. They maintain company culture while providing flexibility.",
                        sentiment: "positive",
                        likes: 28,
                        userInitial: "W"
                    },
                    {
                        id: 2,
                        userName: "RemoteWorker",
                        comment: "Full remote work has dramatically improved my work-life balance and productivity.",
                        sentiment: "positive",
                        likes: 19,
                        userInitial: "R"
                    }
                ]
            },
            4: {
                title: "E-Sports in Olympics",
                description: "This poll discusses the potential inclusion of electronic sports in the Olympic Games and its implications for traditional sports and competition.",
                comments: [
                    {
                        id: 1,
                        userName: "ESportsPlayer",
                        comment: "E-sports require incredible skill, strategy, and teamwork. They deserve Olympic recognition.",
                        sentiment: "positive",
                        likes: 42,
                        userInitial: "E"
                    },
                    {
                        id: 2,
                        userName: "OlympicFan",
                        comment: "The Olympics should focus on physical athletic achievement. E-sports belong in their own competition.",
                        sentiment: "negative",
                        likes: 31,
                        userInitial: "O"
                    }
                ]
            },
            5: {
                title: "Social Media Age Restrictions",
                description: "This poll examines the effectiveness and necessity of age restrictions on social media platforms to protect young users.",
                comments: [
                    {
                        id: 1,
                        userName: "DigitalParent",
                        comment: "Current age restrictions aren't effective. We need better verification systems.",
                        sentiment: "neutral",
                        likes: 37,
                        userInitial: "D"
                    },
                    {
                        id: 2,
                        userName: "YouthAdvocate",
                        comment: "Education about online safety is more important than strict age limits.",
                        sentiment: "positive",
                        likes: 25,
                        userInitial: "Y"
                    }
                ]
            },
            6: {
                title: "Universal Basic Income",
                description: "This poll explores public opinion on implementing UBI as a solution to economic inequality and technological unemployment.",
                comments: [
                    {
                        id: 1,
                        userName: "Economist",
                        comment: "UBI could help address growing automation-related job losses, but funding remains a major challenge.",
                        sentiment: "neutral",
                        likes: 29,
                        userInitial: "E"
                    },
                    {
                        id: 2,
                        userName: "SocialPolicy",
                        comment: "Pilot programs have shown promising results in reducing poverty and improving mental health.",
                        sentiment: "positive",
                        likes: 34,
                        userInitial: "S"
                    }
                ]
            },
            7: {
                title: "Mental Health in Education",
                description: "This poll addresses the importance of incorporating mental health education in school curricula.",
                comments: [
                    {
                        id: 1,
                        userName: "SchoolCounselor",
                        comment: "Students need these tools early. Mental health education is as important as physical education.",
                        sentiment: "positive",
                        likes: 56,
                        userInitial: "S"
                    },
                    {
                        id: 2,
                        userName: "TeenAdvocate",
                        comment: "Speaking from experience, this could help so many students who are struggling silently.",
                        sentiment: "positive",
                        likes: 41,
                        userInitial: "T"
                    }
                ]
            },
            8: {
                title: "Digital Privacy Rights",
                description: "This poll examines public attitudes towards personal data protection and digital privacy in the modern age.",
                comments: [
                    {
                        id: 1,
                        userName: "PrivacyExpert",
                        comment: "Current regulations aren't keeping pace with technological advancement. We need stronger protections.",
                        sentiment: "negative",
                        likes: 47,
                        userInitial: "P"
                    },
                    {
                        id: 2,
                        userName: "TechAnalyst",
                        comment: "Users should have complete control over their data, including the right to be forgotten.",
                        sentiment: "neutral",
                        likes: 39,
                        userInitial: "T"
                    }
                ]
            },
            9: {
                title: "Future of Public Transportation",
                description: "This poll explores preferences between expanding public transit systems and embracing autonomous vehicle technology.",
                comments: [
                    {
                        id: 1,
                        userName: "UrbanPlanner",
                        comment: "Public transport is essential for reducing traffic and emissions. We can't rely solely on autonomous vehicles.",
                        sentiment: "neutral",
                        likes: 33,
                        userInitial: "U"
                    },
                    {
                        id: 2,
                        userName: "TransitUser",
                        comment: "We need both! Better public transport for dense areas and autonomous vehicles for less accessible regions.",
                        sentiment: "positive",
                        likes: 28,
                        userInitial: "T"
                    }
                ]
            },
            10: {
                title: "Renewable Energy Transition",
                description: "This poll examines public opinion on the timeline and approach for transitioning to renewable energy sources.",
                comments: [
                    {
                        id: 1,
                        userName: "ClimateScientist",
                        comment: "The technology exists for a faster transition. We need political will and investment.",
                        sentiment: "neutral",
                        likes: 52,
                        userInitial: "C"
                    },
                    {
                        id: 2,
                        userName: "EnergyAnalyst",
                        comment: "A gradual transition is more realistic to maintain grid stability and economic balance.",
                        sentiment: "neutral",
                        likes: 37,
                        userInitial: "E"
                    }
                ]
            },
            11: {
                title: "Healthcare System Reform",
                description: "This poll explores different approaches to improving healthcare accessibility and affordability.",
                comments: [
                    {
                        id: 1,
                        userName: "HealthcareWorker",
                        comment: "The current system needs complete restructuring. Access to healthcare should be a basic right.",
                        sentiment: "negative",
                        likes: 64,
                        userInitial: "H"
                    },
                    {
                        id: 2,
                        userName: "PolicyMaker",
                        comment: "Incremental changes with focus on preventive care could make significant improvements.",
                        sentiment: "positive",
                        likes: 43,
                        userInitial: "P"
                    }
                ]
            },
            12: {
                title: "Space Exploration Funding",
                description: "This poll gauges public opinion on government funding allocation for space exploration initiatives.",
                comments: [
                    {
                        id: 1,
                        userName: "SpaceEnthusiast",
                        comment: "Space exploration drives innovation in countless other fields. The investment is worth it.",
                        sentiment: "positive",
                        likes: 45,
                        userInitial: "S"
                    },
                    {
                        id: 2,
                        userName: "EarthScientist",
                        comment: "We should focus on solving pressing issues on Earth before expanding into space.",
                        sentiment: "negative",
                        likes: 38,
                        userInitial: "E"
                    }
                ]
            }
        };

        setPoll(pollData[pollId] || {
            title: "Poll not found",
            description: "This poll could not be found.",
            comments: []
        });
    }, [pollId]);

    const [likedComments, setLikedComments] = useState({});

    const handleLike = (commentId) => {
        setLikedComments(prev => {
            const newState = { ...prev };
            if (newState[commentId]) {
                delete newState[commentId];
            } else {
                newState[commentId] = true;
            }
            return newState;
        });
    };

    const handleSubmitComment = () => {
        if (!newComment.trim()) return;

        const comment = {
            id: Date.now(),
            userName: "CurrentUser", // Replace with actual user name
            comment: newComment,
            sentiment: "neutral", // You might want to add sentiment analysis
            likes: 0,
            userInitial: "C"
        };

        setComments(prev => [comment, ...prev]);
        setNewComment('');
    };

    if (!poll) return null;

    return (
        <div>
            <Navbar />
            <div className="comments-page">
                <div className="comments-container">
                    <div className="back-arrow" onClick={() => navigate('/trending')}>
                        ←
                    </div>

                    <div className="poll-header">
                        <h1 className="poll-title">{poll.title}</h1>
                        <p className="poll-description">{poll.description}</p>
                    </div>

                    <div className="comment-input-section">
                        <div className="user-badge">
                            <div className="user-avatar">C</div>
                            <div className="user-name">CurrentUser</div>
                        </div>
                        <textarea
                            className="comment-input"
                            placeholder="What are your thoughts?"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                        <button 
                            className="submit-comment-btn"
                            onClick={handleSubmitComment}
                            disabled={!newComment.trim()}
                        >
                            Submit Comment
                        </button>
                    </div>

                    <div className="comments-list">
                        {[...comments, ...poll.comments].map(comment => (
                            <div key={comment.id} className="comment-card">
                                <div className="comment-header">
                                    <div className="comment-user-info">
                                        <div className="user-avatar">{comment.userInitial}</div>
                                        <div className="user-name">{comment.userName}</div>
                                    </div>
                                    <button 
                                        className={`like-button ${likedComments[comment.id] ? 'liked' : ''}`}
                                        onClick={() => handleLike(comment.id)}
                                    >
                                        ♥ {comment.likes + (likedComments[comment.id] ? 1 : 0)}
                                    </button>
                                </div>
                                <p className="comment-text">{comment.comment}</p>
                                <span className={`sentiment-badge sentiment-${comment.sentiment}`}>
                                    {comment.sentiment.charAt(0).toUpperCase() + comment.sentiment.slice(1)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommentsPage;
