import React from 'react';
import Header2 from '../Header2';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import './Reports.css';

const Reports = () => {
    const navigate = useNavigate();

    const handleViewReport = (reportType) => {
        navigate(`/report/${reportType}`);
    };

    return (
        <div>
            <Navbar />
            <div className="section-page">
                <h1 className="section-title">Your Reports</h1>
                <div className="reports-container">
                    <div className="report-card">
                        <h2>Vote Analysis Report</h2>
                        <p>A comprehensive overview of your voting patterns, participation rates, and engagement metrics for the past month.</p>
                        <button className="view-report-btn" onClick={() => handleViewReport('vote-analysis')}>View Report</button>
                    </div>
                    
                    <div className="report-card">
                        <h2>Comment Analysis</h2>
                        <p>Detailed breakdown of the comments you've posted across different categories.</p>
                        <button className="view-report-btn" onClick={() => handleViewReport('comment-analysis')}>View Report</button>
                    </div>
                    
                    <div className="report-card">
                        <h2>Activity Report</h2>
                        <p>See how your votes have influenced poll outcomes and your contribution to the community's decision-making process.</p>
                        <button className="view-report-btn" onClick={() => handleViewReport('activity-report')}>View Report</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
