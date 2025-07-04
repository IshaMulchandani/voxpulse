import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import './AdminPages.css';

const CreateReport = () => {
    const navigate = useNavigate();
    const [reportType, setReportType] = useState('');
    const [selectedPoll, setSelectedPoll] = useState('');
    const [systemReportType, setSystemReportType] = useState('');
    const [reportTitle, setReportTitle] = useState('');
    const [reportDescription, setReportDescription] = useState('');
    const [notification, setNotification] = useState(null);

    // Dummy data for available polls
    const availablePolls = [
        {
            id: 1,
            title: "Should AI Development Have Stricter Regulations?",
            votes: 245,
            createdOn: "2025-07-01"
        },
        {
            id: 2,
            title: "Global Climate Action: Individual vs Corporate Responsibility",
            votes: 189,
            createdOn: "2025-06-28"
        },
        {
            id: 3,
            title: "The Future of Remote Work",
            votes: 156,
            createdOn: "2025-06-25"
        },
        {
            id: 4,
            title: "E-Sports in Olympics",
            votes: 134,
            createdOn: "2025-06-22"
        },
        {
            id: 5,
            title: "Social Media Age Restrictions",
            votes: 198,
            createdOn: "2025-06-20"
        },
        {
            id: 6,
            title: "Universal Basic Income Implementation",
            votes: 276,
            createdOn: "2025-06-18"
        },
        {
            id: 7,
            title: "Mental Health Education in Schools",
            votes: 167,
            createdOn: "2025-06-15"
        },
        {
            id: 8,
            title: "Digital Privacy Rights and Data Protection",
            votes: 213,
            createdOn: "2025-06-12"
        }
    ];

    const systemReportTypes = [
        { value: 'user-activity', label: 'User Activity Report' },
        { value: 'platform-usage', label: 'Platform Usage Analytics' },
        { value: 'engagement-metrics', label: 'User Engagement Metrics' },
        { value: 'security-report', label: 'Security Report' },
        { value: 'performance-analysis', label: 'System Performance Analysis' },
        { value: 'content-moderation', label: 'Content Moderation Report' },
        { value: 'revenue-analytics', label: 'Revenue Analytics' },
        { value: 'trend-analysis', label: 'Trend Analysis Report' }
    ];

    const handleReportTypeChange = (type) => {
        setReportType(type);
        setSelectedPoll('');
        setSystemReportType('');
        setReportTitle('');
        setReportDescription('');
    };

    const handlePollSelection = (pollId) => {
        setSelectedPoll(pollId);
        const poll = availablePolls.find(p => p.id === parseInt(pollId));
        if (poll) {
            setReportTitle(`${poll.title} - Analysis Report`);
            setReportDescription(`Comprehensive analysis of the poll "${poll.title}" including voting patterns, demographics, and insights.`);
        }
    };

    const handleSystemReportSelection = (type) => {
        setSystemReportType(type);
        const reportTypeObj = systemReportTypes.find(r => r.value === type);
        if (reportTypeObj) {
            setReportTitle(reportTypeObj.label);
            const descriptions = {
                'user-activity': 'Detailed analysis of user activity patterns, login frequency, and engagement metrics.',
                'platform-usage': 'Comprehensive overview of platform usage statistics and user behavior analytics.',
                'engagement-metrics': 'Analysis of user engagement across different features and content types.',
                'security-report': 'Security analysis including login attempts, potential threats, and system vulnerabilities.',
                'performance-analysis': 'System performance metrics including response times, server load, and optimization recommendations.',
                'content-moderation': 'Content moderation statistics and policy enforcement metrics.',
                'revenue-analytics': 'Revenue analysis and financial performance metrics.',
                'trend-analysis': 'Trend analysis report identifying emerging patterns and user preferences.'
            };
            setReportDescription(descriptions[type] || 'System report with relevant administrative information.');
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!reportType) {
            setNotification({ type: 'error', message: 'Please select a report type' });
            return;
        }
        
        if (reportType === 'poll' && !selectedPoll) {
            setNotification({ type: 'error', message: 'Please select a poll to generate report for' });
            return;
        }
        
        if (reportType === 'system' && !systemReportType) {
            setNotification({ type: 'error', message: 'Please select a system report type' });
            return;
        }
        
        if (!reportTitle.trim()) {
            setNotification({ type: 'error', message: 'Report title is required' });
            return;
        }

        // Simulate report creation
        console.log('Creating report:', {
            type: reportType,
            pollId: reportType === 'poll' ? selectedPoll : null,
            systemType: reportType === 'system' ? systemReportType : null,
            title: reportTitle,
            description: reportDescription,
            createdAt: new Date().toISOString()
        });

        setNotification({ type: 'success', message: 'Report generated successfully!' });
        
        // Redirect after 2 seconds
        setTimeout(() => {
            navigate('/admin-reports');
        }, 2000);
    };

    const handleCancel = () => {
        navigate('/admin-reports');
    };

    return (
        <div>
            <AdminNavbar />
            <div className="admin-page">
                <div className="admin-page-container">
                    <div className="create-report-header">
                        <h1 className="admin-page-title">Create New Report</h1>
                        <button 
                            type="button" 
                            className="cancel-btn"
                            onClick={handleCancel}
                        >
                            Back to Reports
                        </button>
                    </div>

                    {notification && (
                        <div className={`notification ${notification.type}`}>
                            {notification.message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="create-report-form">
                        <div className="form-section">
                            <h3>Report Type</h3>
                            <p className="section-description">Choose the type of report you want to generate</p>
                            
                            <div className="report-type-selection">
                                <div 
                                    className={`report-type-card ${reportType === 'poll' ? 'selected' : ''}`}
                                    onClick={() => handleReportTypeChange('poll')}
                                >
                                    <div className="report-type-icon">📊</div>
                                    <h4>Poll Report</h4>
                                    <p>Generate detailed analysis reports for specific polls including voting patterns and insights.</p>
                                </div>
                                
                                <div 
                                    className={`report-type-card ${reportType === 'system' ? 'selected' : ''}`}
                                    onClick={() => handleReportTypeChange('system')}
                                >
                                    <div className="report-type-icon">⚙️</div>
                                    <h4>System Report</h4>
                                    <p>Generate administrative reports with platform analytics, user metrics, and system insights.</p>
                                </div>
                            </div>
                        </div>

                        {reportType === 'poll' && (
                            <div className="form-section">
                                <h3>Select Poll</h3>
                                <p className="section-description">Choose a poll to generate a report for</p>
                                
                                <div className="polls-selection">
                                    {availablePolls.map(poll => (
                                        <div 
                                            key={poll.id}
                                            className={`poll-selection-card ${selectedPoll === poll.id.toString() ? 'selected' : ''}`}
                                            onClick={() => handlePollSelection(poll.id.toString())}
                                        >
                                            <div className="poll-info">
                                                <h4>{poll.title}</h4>
                                                <div className="poll-stats">
                                                    <span>{poll.votes} votes</span>
                                                    <span>Created: {formatDate(poll.createdOn)}</span>
                                                </div>
                                            </div>
                                            <div className="selection-indicator">
                                                {selectedPoll === poll.id.toString() && <span>✓</span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {reportType === 'system' && (
                            <div className="form-section">
                                <h3>System Report Type</h3>
                                <p className="section-description">Choose the type of system report to generate</p>
                                
                                <div className="system-reports-grid">
                                    {systemReportTypes.map(type => (
                                        <div 
                                            key={type.value}
                                            className={`system-report-card ${systemReportType === type.value ? 'selected' : ''}`}
                                            onClick={() => handleSystemReportSelection(type.value)}
                                        >
                                            <h4>{type.label}</h4>
                                            <div className="selection-indicator">
                                                {systemReportType === type.value && <span>✓</span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {(reportType && ((reportType === 'poll' && selectedPoll) || (reportType === 'system' && systemReportType))) && (
                            <div className="form-section">
                                <h3>Report Details</h3>
                                
                                <div className="form-group">
                                    <label htmlFor="reportTitle">Report Title</label>
                                    <input
                                        type="text"
                                        id="reportTitle"
                                        value={reportTitle}
                                        onChange={(e) => setReportTitle(e.target.value)}
                                        placeholder="Enter report title..."
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="reportDescription">Report Description</label>
                                    <textarea
                                        id="reportDescription"
                                        value={reportDescription}
                                        onChange={(e) => setReportDescription(e.target.value)}
                                        placeholder="Enter report description..."
                                        rows="4"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="form-actions">
                            <button 
                                type="button" 
                                className="cancel-btn"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                className="submit-btn"
                                disabled={!reportType || (reportType === 'poll' && !selectedPoll) || (reportType === 'system' && !systemReportType)}
                            >
                                Generate Report
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateReport;
