import React, { useEffect, useRef, useState } from 'react';
import './Dashboard.css';
import Header2 from './Header2';
import Navbar from './components/Navbar';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [progress, setProgress] = useState(0);
    const target = 80;
    const speed = 10;
    const requestRef = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        let start = 0;
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

    const handleViewReport = (reportType) => {
        navigate(`/report/${reportType}`);
    };

    // Sample data for voted polls
    const votedPolls = [
        { id: 1, title: "Best Programming Language", userChoice: "Python" },
        { id: 2, title: "Favorite Learning Platform", userChoice: "Udemy" },
        { id: 3, title: "Most Used Framework", userChoice: "React" },
        { id: 4, title: "Preferred Database", userChoice: "MongoDB" },
        { id: 5, title: "Best Code Editor", userChoice: "VS Code" }
    ];

    // Reports data
    const reports = [
        {
            title: "Vote Analysis Report",
            description: "Detailed analysis of voting patterns and trends",
            reportType: "vote-analysis"
        },
        {
            title: "Comment Analysis",
            description: "Analysis of user comments and feedback",
            reportType: "comment-analysis"
        },
        {
            title: "Activity Report",
            description: "Overview of user engagement and participation",
            reportType: "activity-report"
        }
    ];

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
                        {votedPolls.map(poll => (
                            <div key={poll.id} className="poll-card">
                                <h3>{poll.title}</h3>
                                <p>Your choice: <span className="user-choice">{poll.userChoice}</span></p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="dashboard-section">
                    <h2>Reports</h2>
                    <div className="reports-list">
                        {reports.map((report, index) => (
                            <div key={index} className="report-card">
                                <h3>{report.title}</h3>
                                <p>{report.description}</p>
                                <button className="view-report-btn" onClick={()=> handleViewReport(report.reportType)}>View Report</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
