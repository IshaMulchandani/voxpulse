import React, { useEffect, useRef, useState } from 'react';
import './Dashboard.css';
import Navbar from './components/Navbar';
import Header2 from './Header2';
import PollsForYou from './PollsForYou';

// Inline Speedometer component
const Speedometer = ({ percent, duration = 1500 }) => {
    const [displayPercent, setDisplayPercent] = useState(0);
    const requestRef = useRef();
    const startTimeRef = useRef();

    useEffect(() => {
        const animate = (timestamp) => {
            if (!startTimeRef.current) startTimeRef.current = timestamp;
            const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);
            const current = Math.floor(progress * percent);
            setDisplayPercent(current);
            if (progress < 1) {
                requestRef.current = requestAnimationFrame(animate);
            } else {
                setDisplayPercent(percent);
            }
        };
        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current);
    }, [percent, duration]);

    // SVG semi-circle gauge
    const radius = 80;
    const stroke = 16;
    const normalizedRadius = radius - stroke / 2;
    const circumference = Math.PI * normalizedRadius;
    const offset = circumference * (1 - displayPercent / 100);

    return (
        <div className="speedometer-container">
            <svg width={radius * 2} height={radius + stroke}>
                <path
                    d={`M${stroke},${radius} A${normalizedRadius},${normalizedRadius} 0 0,1 ${radius * 2 - stroke},${radius}`}
                    fill="none"
                    stroke="#f0f0f0"
                    strokeWidth={stroke}
                />
                <path
                    d={`M${stroke},${radius} A${normalizedRadius},${normalizedRadius} 0 0,1 ${radius * 2 - stroke},${radius}`}
                    fill="none"
                    stroke="#a695ff"
                    strokeWidth={stroke}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                />
                <text
                    x={radius}
                    y={radius - 10}
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    fontSize="1.5rem"
                    fontWeight="bold"
                    fill="#333"
                >
                    {displayPercent}%
                </text>
            </svg>
        </div>
    );
};

const Dashboard = () => {
    // Reports data
    const reports = [
        {
            title: "Vote Analysis Report",
            description: "Detailed analysis of voting patterns and trends"
        },
        {
            title: "Comment Analysis",
            description: "Analysis of user comments and feedback"
        },
        {
            title: "Activity Report",
            description: "Overview of user engagement and participation"
        }
    ];

    return (
        <div className="dashboard">
            <Header2 />
            <Navbar />
            <div className="dashboard-speedometer-section">
                <Speedometer percent={80} duration={1500} />
                <div className="speedometer-title">Polls Completed</div>
            </div>
            <div className="dashboard-polls-reports">
                <PollsForYou />
                <div className="dashboard-section">
                    <h2>Reports</h2>
                    <div className="reports-list">
                        {reports.map((report, index) => (
                            <div key={index} className="report-card">
                                <h3>{report.title}</h3>
                                <p>{report.description}</p>
                                <button className="view-report-btn">View Report</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
