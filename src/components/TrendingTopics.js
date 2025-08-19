import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import './TrendingTopics.css';

const TrendingTopics = () => {
    const navigate = useNavigate();
    
    const handleCardClick = (pollId) => {
        navigate(`/poll/${pollId}`);
    };

    // Sample trending polls data
    const trendingPolls = [
        {
            id: 1,
            title: "Should AI Development Have Stricter Regulations?",
            description: "With recent advances in artificial intelligence, should there be more oversight on AI development and deployment?",
            category: "technology",
            image: "https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&q=80&w=500"
        },
        {
            id: 2,
            title: "Global Climate Action: Individual vs Corporate Responsibility",
            description: "Who should bear more responsibility for climate change action - individuals or corporations?",
            category: "environment",
            image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=500"
        },
        {
            id: 3,
            title: "The Future of Remote Work",
            description: "Should companies maintain remote work policies post-pandemic, or return to traditional office settings?",
            category: "social",
            image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=500"
        },
        {
            id: 4,
            title: "E-Sports in Olympics",
            description: "Should e-sports be included as an official Olympic sport in future games?",
            category: "sports",
            image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=500"
        },
        {
            id: 5,
            title: "Social Media Age Restrictions",
            description: "Should there be stricter age verification for social media platform access?",
            category: "technology",
            image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=500"
        },
        {
            id: 6,
            title: "Universal Basic Income",
            description: "Should governments implement universal basic income to address economic inequality?",
            category: "politics",
            image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=500"
        },
        {
            id: 7,
            title: "Mental Health in Education",
            description: "Should mental health education be mandatory in all schools?",
            category: "education",
            image: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&q=80&w=500"
        },
        {
            id: 8,
            title: "Digital Privacy Rights",
            description: "How much control should users have over their personal data online?",
            category: "technology",
            image: "https://images.unsplash.com/photo-1563237023-b1e970526dcb?auto=format&fit=crop&q=80&w=500"
        },
        {
            id: 9,
            title: "Future of Public Transportation",
            description: "Should cities invest more in public transport or focus on autonomous vehicles?",
            category: "social",
            image: "https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?auto=format&fit=crop&q=80&w=500"
        },
        {
            id: 10,
            title: "Renewable Energy Transition",
            description: "How quickly should countries transition to 100% renewable energy?",
            category: "environment",
            image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=500"
        },
        {
            id: 11,
            title: "Healthcare System Reform",
            description: "What changes are needed in the current healthcare system?",
            category: "health",
            image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=500"
        },
        {
            id: 12,
            title: "Space Exploration Funding",
            description: "Should more public funding be allocated to space exploration?",
            category: "technology",
            image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=500"
        }
    ];

    return (
        <div className="section-page">
        <Navbar/><br /><br />
            <div className="page-header">
                <h1 className="section-title">Trending Topics</h1>
                <button 
                    className="create-poll-btn"
                    onClick={() => navigate('/create-poll')}
                >
                    Create a Poll
                </button>
            </div>
            <div className="trending-grid">
                {trendingPolls.map(poll => (
                    <div 
                        key={poll.id} 
                        className="trending-card"
                        onClick={() => handleCardClick(poll.id)}
                    >
                        <img src={poll.imageUrl || poll.image} alt={poll.title} className="card-image" />
                        <div className="card-content">
                            <span className={`card-category category-${poll.category}`}>
                                {poll.category}
                            </span>
                            <h2 className="card-title">{poll.title}</h2>
                            <p className="card-description">{poll.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TrendingTopics;
