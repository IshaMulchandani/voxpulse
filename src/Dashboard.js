import React, { useEffect, useRef, useState } from 'react';
import './Dashboard.css';
import Navbar from './components/Navbar';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {

    const [progress, setProgress] = useState(0);
    const [votedPolls, setVotedPolls] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const requestRef = useRef();

    useEffect(() => {
        let start = 0;
        const target = 80;
        const speed = 10;
        function animate() {
            if (start < target) {
                start += 1;
                setProgress(start);
                requestRef.current = setTimeout(animate, speed);
            } else {
                setProgress(target);
            }
        }
        animate();
        return () => clearTimeout(requestRef.current);
    }, []);

    useEffect(() => {
        const fetchVotedPolls = async () => {
            setLoading(true);
            try {
                const { getAuth } = await import('firebase/auth');
                const { db } = await import('./firebase');
                const { collection, getDocs } = await import('firebase/firestore');
                const auth = getAuth();
                const user = auth.currentUser;
                if (!user) {
                    setVotedPolls([]);
                    setLoading(false);
                    return;
                }
                // Fetch all polls
                const pollsSnapshot = await getDocs(collection(db, 'polls'));
                const voted = [];
                pollsSnapshot.forEach(doc => {
                    const data = doc.data();
                    // Check if user has voted using votesWithDetails array
                    if (data.votesWithDetails && Array.isArray(data.votesWithDetails)) {
                        const userVote = data.votesWithDetails.find(vote => vote.userId === user.uid);
                        if (userVote) {
                            voted.push({
                                id: doc.id,
                                title: data.title,
                                userChoice: userVote.option || data.options[userVote.optionIndex],
                                votedAt: userVote.timestamp
                            });
                        }
                    }
                });
                setVotedPolls(voted);
            } catch (err) {
                setVotedPolls([]);
            } finally {
                setLoading(false);
            }
        };
        fetchVotedPolls();
    }, []);

    const [reports, setReports] = useState([]);
    const [reportsLoading, setReportsLoading] = useState(true);

    useEffect(() => {
        const setupReportsListener = async () => {
            try {
                setReportsLoading(true);
                const { collection, onSnapshot } = await import('firebase/firestore');
                const { db } = await import('./firebase');
                
                // Set up real-time listener for reports
                const unsubscribe = onSnapshot(collection(db, 'publicReports'), (snapshot) => {
                    const reportsData = [];
                    const seenTitles = new Set();
                    
                    snapshot.forEach(doc => {
                        const data = doc.data();
                        const uniqueKey = `${data.title}-${data.createdAt}`;
                        
                        if (!seenTitles.has(uniqueKey)) {
                            seenTitles.add(uniqueKey);
                            reportsData.push({
                                id: doc.id,
                                title: data.title,
                                description: data.description,
                                type: data.type,
                                createdAt: data.createdAt
                            });
                        }
                    });
                    
                    // Sort by creation date (newest first) and take only the first 3
                    reportsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    setReports(reportsData.slice(0, 3));
                    setReportsLoading(false);
                });
                
                return unsubscribe;
            } catch (error) {
                console.error('Error setting up reports listener:', error);
                setReports([]);
                setReportsLoading(false);
            }
        };

        let unsubscribe;
        setupReportsListener().then(unsub => {
            unsubscribe = unsub;
        });
        
        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, []);

    const handleViewReport = (reportId) => {
        navigate(`/user-report-view/${reportId}`);
    };

    // Calculate stroke for SVG
    const radius = 80;
    const stroke = 14;
    const normalizedRadius = radius - stroke / 2;
    const circumference = Math.PI * normalizedRadius;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <div className="dashboard">
            <Navbar/>
            <div className="speedometer-container">
                <svg
                    width={radius * 2}
                    height={radius + 30}
                    viewBox={`0 0 ${radius * 2} ${radius + 30}`}
                    className="speedometer-svg"
                >
                    <path
                        d={`M${stroke / 2},${radius} A${normalizedRadius},${normalizedRadius} 0 0,1 ${radius * 2 - stroke / 2},${radius}`}
                        fill="none"
                        stroke="#e6e6e6"
                        strokeWidth={stroke}
                        strokeLinecap="round"
                    />
                    <path
                        d={`M${stroke / 2},${radius} A${normalizedRadius},${normalizedRadius} 0 0,1 ${radius * 2 - stroke / 2},${radius}`}
                        fill="none"
                        stroke="#a695ff"
                        strokeWidth={stroke}
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dashoffset 0.3s linear' }}
                    />
                    <text
                        x="50%"
                        y={radius}
                        textAnchor="middle"
                        alignmentBaseline="middle"
                        fontSize="2.5rem"
                        fill="#333"
                        fontWeight="bold"
                        dy="0.3em"
                    >
                        {progress}%
                    </text>
                </svg>
                <div className="speedometer-label">Polls Completed</div>
            </div>
            <div className="dashboard-grid">
                <div className="dashboard-section">
                    <h2>Your Polls</h2>
                    <div className="polls-list">
                        {loading ? (
                            <div>Loading your voted polls...</div>
                        ) : votedPolls.length === 0 ? (
                            <div className="no-polls-message">
                                <h3>😃 You haven't voted in any polls yet!</h3>
                                <p>Explore trending topics and cast your first vote to see your results here.</p>
                            </div>
                        ) : (
                            votedPolls.map(poll => (
                                <div key={poll.id} className="poll-card">
                                    <h3>{poll.title}</h3>
                                    <p>Your choice: <span className="user-choice">{poll.userChoice}</span></p>
                                    {poll.votedAt && (
                                        <p className="vote-date">
                                            Voted on: {poll.votedAt.toDate ? 
                                                poll.votedAt.toDate().toLocaleDateString() : 
                                                new Date(poll.votedAt).toLocaleDateString()
                                            }
                                        </p>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
                <div className="dashboard-section">
                    <h2>Reports</h2>
                    <div className="reports-list">
                        {reportsLoading ? (
                            <div>Loading reports...</div>
                        ) : reports.length === 0 ? (
                            <div className="no-reports-message">
                                <h3>📊 No reports available yet</h3>
                                <p>Check back later for new reports from administrators.</p>
                            </div>
                        ) : (
                            reports.map((report) => (
                                <div key={report.id} className="report-card">
                                    <h3>{report.title}</h3>
                                    <p>{report.description}</p>
                                    <div className="report-meta">
                                        <span className="report-type">
                                            {report.type === 'poll' ? '📊 Poll Report' : '⚙️ System Report'}
                                        </span>
                                        <span className="report-date">
                                            {new Date(report.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <button className="view-report-btn" onClick={() => handleViewReport(report.id)}>View Report</button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
