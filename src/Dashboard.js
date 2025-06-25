import React from 'react';
import './Dashboard.css';
import Navbar from './components/Navbar';
import Header2 from './Header2';
import Header from './Header';
const Dashboard = () => {
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
        <Header/>
        <Navbar/>

            <h1 className="dashboard-title">Your Dashboard</h1>
            
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
