import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import Navbar from './Navbar';
import './CategoryPage.css';

const CategoryPage = () => {
    const { categoryName } = useParams();
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalPolls: 0,
        totalVotes: 0,
        activePolls: 0,
        topPoll: null
    });

    useEffect(() => {
        const fetchCategoryPolls = async () => {
            try {
                // Fetch polls from the category
                const pollsQuery = query(
                    collection(db, 'polls'),
                    where('category', '==', categoryName)
                );
                const querySnapshot = await getDocs(pollsQuery);
                
                const pollsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setPolls(pollsData);
                
                // Calculate stats
                const totalVotes = pollsData.reduce((sum, poll) => {
                    const pollVotes = poll.options ? poll.options.reduce((optSum, opt) => optSum + (opt.votes || 0), 0) : 0;
                    return sum + pollVotes;
                }, 0);

                const activePolls = pollsData.filter(poll => {
                    const endDate = new Date(poll.endDate);
                    return endDate > new Date();
                }).length;

                const topPoll = pollsData.reduce((max, poll) => {
                    const pollVotes = poll.options ? poll.options.reduce((sum, opt) => sum + (opt.votes || 0), 0) : 0;
                    const maxVotes = max.options ? max.options.reduce((sum, opt) => sum + (opt.votes || 0), 0) : 0;
                    return pollVotes > maxVotes ? poll : max;
                }, pollsData[0] || null);

                setStats({
                    totalPolls: pollsData.length,
                    totalVotes,
                    activePolls,
                    topPoll
                });
            } catch (error) {
                console.error('Error fetching category polls:', error);
                // Fallback to mock data for demonstration
                const mockPolls = generateMockPolls(categoryName);
                setPolls(mockPolls);
                setStats(calculateMockStats(mockPolls));
            } finally {
                setLoading(false);
            }
        };

        fetchCategoryPolls();
    }, [categoryName]);

    const generateMockPolls = (categoryName) => {
        const mockData = {
            Crime: [
                {
                    id: 1,
                    title: "Should surveillance be increased in public areas to reduce crime?",
                    description: "Exploring the balance between security and privacy",
                    category: "Crime",
                    options: [
                        { text: "Yes, increase surveillance", votes: 145 },
                        { text: "No, preserve privacy", votes: 89 },
                        { text: "Only in high-crime areas", votes: 203 }
                    ],
                    endDate: "2025-08-15",
                    createdBy: "SafetyAdvocate"
                },
                {
                    id: 2,
                    title: "Are current penalties for cybercrime sufficient?",
                    description: "Evaluating the effectiveness of cybercrime legislation",
                    category: "Crime",
                    options: [
                        { text: "Yes, they're adequate", votes: 67 },
                        { text: "No, too lenient", votes: 234 },
                        { text: "Need specialized courts", votes: 123 }
                    ],
                    endDate: "2025-08-20",
                    createdBy: "CyberExpert"
                }
            ],
            Psychology: [
                {
                    id: 3,
                    title: "Does social media negatively impact mental health?",
                    description: "Understanding the psychological effects of social platforms",
                    category: "Psychology",
                    options: [
                        { text: "Significantly negative", votes: 312 },
                        { text: "Mostly positive", votes: 78 },
                        { text: "Depends on usage", votes: 445 }
                    ],
                    endDate: "2025-08-25",
                    createdBy: "MindMatters"
                },
                {
                    id: 4,
                    title: "Should mental health education be mandatory in schools?",
                    description: "Exploring early intervention in mental health",
                    category: "Psychology",
                    options: [
                        { text: "Yes, from elementary", votes: 289 },
                        { text: "Only high school", votes: 134 },
                        { text: "Optional programs", votes: 97 }
                    ],
                    endDate: "2025-09-01",
                    createdBy: "EduPsych"
                }
            ],
            Sports: [
                {
                    id: 5,
                    title: "Should esports be considered traditional sports?",
                    description: "Defining modern competitive activities",
                    category: "Sports",
                    options: [
                        { text: "Yes, they're legitimate sports", votes: 456 },
                        { text: "No, separate category", votes: 234 },
                        { text: "Hybrid classification", votes: 189 }
                    ],
                    endDate: "2025-08-30",
                    createdBy: "GameChanger"
                }
            ],
            Politics: [
                {
                    id: 6,
                    title: "Should voting age be lowered to 16?",
                    description: "Youth participation in democratic processes",
                    category: "Politics",
                    options: [
                        { text: "Yes, engage youth early", votes: 203 },
                        { text: "No, maintain current age", votes: 345 },
                        { text: "Only for local elections", votes: 156 }
                    ],
                    endDate: "2025-09-05",
                    createdBy: "CivicVoice"
                }
            ],
            Movies: [
                {
                    id: 7,
                    title: "Are streaming services killing cinema culture?",
                    description: "The future of movie-watching experiences",
                    category: "Movies",
                    options: [
                        { text: "Yes, destroying theaters", votes: 198 },
                        { text: "No, just evolving", votes: 267 },
                        { text: "Both can coexist", votes: 389 }
                    ],
                    endDate: "2025-08-28",
                    createdBy: "FilmBuff"
                }
            ]
        };

        return mockData[categoryName] || [];
    };

    const calculateMockStats = (pollsData) => {
        const totalVotes = pollsData.reduce((sum, poll) => {
            return sum + poll.options.reduce((optSum, opt) => optSum + opt.votes, 0);
        }, 0);

        const activePolls = pollsData.filter(poll => {
            const endDate = new Date(poll.endDate);
            return endDate > new Date();
        }).length;

        const topPoll = pollsData.reduce((max, poll) => {
            const pollVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
            const maxVotes = max.options ? max.options.reduce((sum, opt) => sum + opt.votes, 0) : 0;
            return pollVotes > maxVotes ? poll : max;
        }, pollsData[0] || null);

        return {
            totalPolls: pollsData.length,
            totalVotes,
            activePolls,
            topPoll
        };
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    };

    const getVotePercentage = (option, poll) => {
        const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
        return totalVotes > 0 ? ((option.votes / totalVotes) * 100).toFixed(1) : 0;
    };

    if (loading) {
        return (
            <div>
                <Navbar />
                <div className="category-loading">
                    <div className="loading-spinner"></div>
                    <p>Loading {categoryName} polls...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <div className="category-page">
                <div className="category-container">
                    {/* Category Header */}
                    <div className="category-header">
                        <div className="category-title-section">
                            <h1 className="category-title">{categoryName}</h1>
                            <p className="category-subtitle">
                                Explore polls and discussions in the {categoryName?.toLowerCase()} category
                            </p>
                        </div>
                        
                        {/* Stats Dashboard */}
                        <div className="category-stats">
                            <div className="stat-card">
                                <div className="stat-number">{stats.totalPolls}</div>
                                <div className="stat-label">Total Polls</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-number">{stats.totalVotes.toLocaleString()}</div>
                                <div className="stat-label">Total Votes</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-number">{stats.activePolls}</div>
                                <div className="stat-label">Active Polls</div>
                            </div>
                            <div className="stat-card highlight">
                                <div className="stat-number">
                                    {stats.topPoll ? stats.topPoll.options.reduce((sum, opt) => sum + opt.votes, 0) : 0}
                                </div>
                                <div className="stat-label">Most Voted Poll</div>
                            </div>
                        </div>
                    </div>

                    {/* Top Poll Highlight */}
                    {stats.topPoll && (
                        <div className="top-poll-section">
                            <h2 className="section-title">🏆 Most Popular Poll</h2>
                            <div className="top-poll-card">
                                <h3 className="poll-title">{stats.topPoll.title}</h3>
                                <p className="poll-description">{stats.topPoll.description}</p>
                                <div className="poll-options">
                                    {stats.topPoll.options.map((option, index) => (
                                        <div key={index} className="option-result">
                                            <div className="option-info">
                                                <span className="option-text">{option.text}</span>
                                                <span className="option-percentage">
                                                    {getVotePercentage(option, stats.topPoll)}%
                                                </span>
                                            </div>
                                            <div className="option-bar">
                                                <div 
                                                    className="option-fill"
                                                    style={{ width: `${getVotePercentage(option, stats.topPoll)}%` }}
                                                ></div>
                                            </div>
                                            <span className="option-votes">{option.votes} votes</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="poll-meta">
                                    <span className="poll-author">By {stats.topPoll.createdBy}</span>
                                    <span className="poll-date">Ends {formatDate(stats.topPoll.endDate)}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* All Polls Grid */}
                    <div className="polls-section">
                        <h2 className="section-title">All {categoryName} Polls</h2>
                        {polls.length > 0 ? (
                            <div className="polls-grid">
                                {polls.map(poll => (
                                    <div key={poll.id} className="poll-card">
                                        <div className="poll-card-header">
                                            <h3 className="poll-card-title">{poll.title}</h3>
                                            <div className="poll-status">
                                                {new Date(poll.endDate) > new Date() ? (
                                                    <span className="status-active">Active</span>
                                                ) : (
                                                    <span className="status-ended">Ended</span>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <p className="poll-card-description">{poll.description}</p>
                                        
                                        <div className="poll-quick-stats">
                                            <div className="quick-stat">
                                                <span className="quick-stat-number">
                                                    {poll.options.reduce((sum, opt) => sum + opt.votes, 0)}
                                                </span>
                                                <span className="quick-stat-label">votes</span>
                                            </div>
                                            <div className="quick-stat">
                                                <span className="quick-stat-number">{poll.options.length}</span>
                                                <span className="quick-stat-label">options</span>
                                            </div>
                                        </div>
                                        
                                        <div className="poll-card-footer">
                                            <span className="poll-author">By {poll.createdBy}</span>
                                            <span className="poll-date">Ends {formatDate(poll.endDate)}</span>
                                        </div>
                                        
                                        <button 
                                            className="view-poll-btn"
                                            onClick={() => window.location.href = `/poll/${poll.id}`}
                                        >
                                            View Poll
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="no-polls">
                                <div className="no-polls-icon">📊</div>
                                <h3>No polls found in {categoryName}</h3>
                                <p>Be the first to create a poll in this category!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryPage;
