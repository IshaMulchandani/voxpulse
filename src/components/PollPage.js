import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from './Navbar';
import './PollPage.css';

const PollPage = () => {
    const navigate = useNavigate();
    const { pollId } = useParams();
    const [poll, setPoll] = useState(null);
    const [newComment, setNewComment] = useState('');
    const [comments, setComments] = useState([]);
    const [likedComments, setLikedComments] = useState({});
    const [showFlagModal, setShowFlagModal] = useState(false);
    const [flaggedCommentId, setFlaggedCommentId] = useState(null);
    const [flagReason, setFlagReason] = useState('');
    const [showNotification, setShowNotification] = useState(false);

    useEffect(() => {
        // Mock data - replace with actual API call
        const pollData = {
            1: {
                title: "Should AI Development Have Stricter Regulations?",
                description: "This poll explores the balance between innovation and safety in AI development. The rapid advancement of artificial intelligence raises questions about potential risks and the need for regulatory frameworks. As AI becomes more sophisticated, we need to consider its impact on employment, privacy, security, and society as a whole. The debate centers around whether current self-regulation is sufficient or if government intervention is necessary to ensure responsible development.",
                image: "https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&q=80&w=1200",
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
                description: "This poll addresses the ongoing debate about who bears the primary responsibility for addressing climate change - individuals through lifestyle changes or corporations through systemic reforms. The climate crisis requires urgent action, but there's disagreement about where the focus should be. Some argue that individual actions like reducing consumption and choosing sustainable products are key, while others contend that systemic change driven by corporate responsibility and government policy is more effective.",
                image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=1200",
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
                description: "This poll examines the shifting workplace dynamics post-pandemic and the potential long-term implications for both employers and employees. The COVID-19 pandemic accelerated the adoption of remote work, leading to questions about its sustainability and effectiveness. Some organizations report increased productivity and employee satisfaction, while others struggle with collaboration and company culture. The debate continues about whether remote work is a temporary solution or a permanent shift in how we work.",
                image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1200",
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
                description: "This poll discusses the potential inclusion of electronic sports in the Olympic Games and its implications for traditional sports and competition. E-sports have gained massive popularity and viewership, with professional players demonstrating incredible skill and dedication. The debate centers around whether e-sports should be recognized as legitimate sports worthy of Olympic inclusion, or if they represent a fundamentally different form of competition that should have separate recognition.",
                image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1200",
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
                description: "This poll examines the effectiveness and necessity of age restrictions on social media platforms to protect young users. With growing concerns about mental health impacts, cyberbullying, and privacy issues affecting minors, there's ongoing debate about how to balance digital accessibility with child safety. The discussion includes various approaches from stricter age verification to improved parental controls and digital literacy education.",
                image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=1200",
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
                description: "This poll explores public opinion on implementing UBI as a solution to economic inequality and technological unemployment. As automation and AI continue to reshape the job market, UBI has emerged as a potential policy response to ensure basic economic security for all citizens. The debate encompasses questions about funding mechanisms, work incentives, and the broader social implications of guaranteed income.",
                image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=1200",
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
                description: "This poll addresses the importance of incorporating mental health education in school curricula. With rising rates of anxiety, depression, and other mental health challenges among students, there's growing recognition that schools should play a role in mental health awareness and support. The discussion includes various approaches from dedicated mental health classes to integrating wellness concepts across subjects.",
                image: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&q=80&w=1200",
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
                description: "This poll examines public attitudes towards personal data protection and digital privacy in the modern age. As our lives become increasingly digital, questions about data collection, surveillance, and privacy rights have become more pressing. The debate covers various aspects from government surveillance to corporate data practices and individual control over personal information.",
                image: "https://images.unsplash.com/photo-1563237023-b1e970526dcb?auto=format&fit=crop&q=80&w=1200",
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
                description: "This poll discusses investment priorities for urban transportation infrastructure. Cities worldwide are grappling with traffic congestion, pollution, and accessibility issues. The debate centers on whether to prioritize traditional public transit expansion or focus on emerging technologies like autonomous vehicles and ride-sharing systems to address urban mobility challenges.",
                image: "https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?auto=format&fit=crop&q=80&w=1200",
                comments: [
                    {
                        id: 1,
                        userName: "UrbanPlanner",
                        comment: "Public transportation is more sustainable and equitable than individual autonomous vehicles.",
                        sentiment: "positive",
                        likes: 52,
                        userInitial: "U"
                    },
                    {
                        id: 2,
                        userName: "TechEnthusiast",
                        comment: "Autonomous vehicles could provide door-to-door service more efficiently than traditional transit.",
                        sentiment: "positive",
                        likes: 28,
                        userInitial: "T"
                    }
                ]
            },
            10: {
                title: "Renewable Energy Transition",
                description: "This poll gauges public opinion on the pace and approach to renewable energy adoption. As climate change concerns intensify, there's growing pressure to transition away from fossil fuels. The debate includes questions about transition timelines, economic impacts, energy security, and the role of different renewable technologies in achieving carbon neutrality.",
                image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=1200",
                comments: [
                    {
                        id: 1,
                        userName: "ClimateScientist",
                        comment: "We need rapid transition to avoid catastrophic climate impacts. The technology is ready.",
                        sentiment: "positive",
                        likes: 68,
                        userInitial: "C"
                    },
                    {
                        id: 2,
                        userName: "EnergyWorker",
                        comment: "Transition must be gradual to protect jobs and ensure energy security during the shift.",
                        sentiment: "neutral",
                        likes: 43,
                        userInitial: "E"
                    }
                ]
            },
            11: {
                title: "Healthcare System Reform",
                description: "This poll explores public opinion on necessary changes to healthcare systems. Healthcare accessibility, affordability, and quality remain major concerns worldwide. The discussion encompasses various reform approaches from universal healthcare to market-based solutions, preventive care focus, and the integration of technology in healthcare delivery.",
                image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1200",
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
                description: "This poll gauges public opinion on government funding allocation for space exploration initiatives. As private companies increasingly participate in space activities, questions arise about the appropriate level of public investment in space programs. The debate includes considerations of scientific advancement, national security, commercial opportunities, and opportunity costs compared to terrestrial priorities.",
                image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=1200",
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
            image: "https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&q=80&w=1200",
            comments: []
        });
    }, [pollId]);

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
            userName: "CurrentUser",
            comment: newComment,
            sentiment: "neutral",
            likes: 0,
            userInitial: "C"
        };

        setComments(prev => [comment, ...prev]);
        setNewComment('');
    };

    const handleFlagComment = (commentId) => {
        setFlaggedCommentId(commentId);
        setShowFlagModal(true);
    };

    const handleSubmitFlag = () => {
        if (!flagReason.trim()) return;

        // Here you would typically send the flag report to your backend
        console.log('Flagging comment:', flaggedCommentId, 'Reason:', flagReason);
        
        // Close modal and reset state
        setShowFlagModal(false);
        setFlaggedCommentId(null);
        setFlagReason('');
        
        // Show notification
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 5000);
    };

    const handleVoteNow = () => {
        navigate(`/vote/${pollId}`);
    };

    if (!poll) return null;

    return (
        <div>
            <Navbar />
            <div className="poll-page">
                <div className="poll-banner">
                    <img src={poll.imageUrl || poll.image || 'https://via.placeholder.com/1200x400?text=Poll'} alt={poll.title} className="poll-banner-image" />
                    <div className="poll-banner-overlay">
                        <h1 className="poll-banner-title">{poll.title}</h1>
                    </div>
                </div>

                <div className="poll-content">
                    <div className="back-arrow" onClick={() => navigate('/dashboard')}>
                        ←
                    </div>
                    <div className="poll-description-section">
                        <p className="poll-description">{poll.description}</p>
                        <button className="vote-now-btn" onClick={handleVoteNow}>
                            Vote Now
                        </button>
                    </div>

                    <div className="comments-section">
                        <h2 className="comments-title">Comments</h2>
                        
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
                                        <div className="comment-actions">
                                            <button 
                                                className={`like-button ${likedComments[comment.id] ? 'liked' : ''}`}
                                                onClick={() => handleLike(comment.id)}
                                            >
                                                ♥ {comment.likes + (likedComments[comment.id] ? 1 : 0)}
                                            </button>
                                            <button 
                                                className="flag-button"
                                                onClick={() => handleFlagComment(comment.id)}
                                                title="Flag this comment"
                                            >
                                                🚩
                                            </button>
                                        </div>
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

                {/* Flag Modal */}
                {showFlagModal && (
                    <div className="modal-overlay" onClick={() => setShowFlagModal(false)}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <h3>Flag Comment</h3>
                            <p>Please provide a reason for flagging this content:</p>
                            <textarea
                                className="flag-reason-input"
                                placeholder="Enter your reason for flagging this comment..."
                                value={flagReason}
                                onChange={(e) => setFlagReason(e.target.value)}
                                rows="4"
                            />
                            <div className="modal-actions">
                                <button 
                                    className="cancel-btn"
                                    onClick={() => setShowFlagModal(false)}
                                >
                                    Cancel
                                </button>
                                <button 
                                    className="submit-flag-btn"
                                    onClick={handleSubmitFlag}
                                    disabled={!flagReason.trim()}
                                >
                                    Submit Report
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Notification */}
                {showNotification && (
                    <div className="notification">
                        Your concerns have been noted! A member of our team will review the report and take necessary action.
                    </div>
                )}
            </div>
        </div>
    );
};

export default PollPage;
