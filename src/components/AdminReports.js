import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import './AdminPages.css';

const AdminReports = () => {
    const navigate = useNavigate();
    
    // Dummy data for existing reports
    const [reports] = useState([
        {
            id: 1,
            title: "AI Development Regulations Poll Analysis",
            category: "poll report",
            createdOn: "2025-07-02",
            readBy: 12,
            pollId: 1
        },
        {
            id: 2,
            title: "Monthly User Activity Report",
            category: "system report",
            createdOn: "2025-07-01",
            readBy: 8,
            pollId: null
        },
        {
            id: 3,
            title: "Climate Action Poll Results",
            category: "poll report",
            createdOn: "2025-06-30",
            readBy: 15,
            pollId: 2
        },
        {
            id: 4,
            title: "Platform Usage Analytics",
            category: "system report",
            createdOn: "2025-06-28",
            readBy: 6,
            pollId: null
        },
        {
            id: 5,
            title: "Remote Work Trends Analysis",
            category: "poll report",
            createdOn: "2025-06-26",
            readBy: 22,
            pollId: 3
        },
        {
            id: 6,
            title: "Weekly Security Report",
            category: "system report",
            createdOn: "2025-06-25",
            readBy: 4,
            pollId: null
        },
        {
            id: 7,
            title: "E-Sports Olympics Poll Summary",
            category: "poll report",
            createdOn: "2025-06-24",
            readBy: 18,
            pollId: 4
        },
        {
            id: 8,
            title: "User Engagement Metrics",
            category: "system report",
            createdOn: "2025-06-22",
            readBy: 9,
            pollId: null
        },
        {
            id: 9,
            title: "Social Media Age Restrictions Report",
            category: "poll report",
            createdOn: "2025-06-20",
            readBy: 26,
            pollId: 5
        },
        {
            id: 10,
            title: "Database Performance Analysis",
            category: "system report",
            createdOn: "2025-06-18",
            readBy: 3,
            pollId: null
        }
    ]);

    const handleCreateReport = () => {
        navigate('/admin-create-report');
    };

    const handleViewReport = (reportId) => {
        navigate(`/admin-report-view/${reportId}`);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    };

    const getCategoryBadgeClass = (category) => {
        return category === 'poll report' ? 'poll-report' : 'system-report';
    };

    const formatCategory = (category) => {
        return category === 'poll report' ? 'Poll Report' : 'System Report';
    };

    return (
        <div>
            <AdminNavbar />
            <div className="admin-page">
                <div className="admin-page-container">
                    <div className="reports-management-header">
                        <h1 className="admin-page-title">Generate Reports</h1>
                        <button 
                            className="create-report-btn"
                            onClick={handleCreateReport}
                        >
                            + Create New Report
                        </button>
                    </div>
                    
                    <div className="reports-list">
                        {reports.map(report => (
                            <div key={report.id} className="report-management-card">
                                <div className="report-details">
                                    <h3 className="report-title">{report.title}</h3>
                                    <div className="report-meta">
                                        <div className="meta-item">
                                            <span className="meta-label">Category:</span>
                                            <span className={`meta-value category-badge ${getCategoryBadgeClass(report.category)}`}>
                                                {formatCategory(report.category)}
                                            </span>
                                        </div>
                                        <div className="meta-item">
                                            <span className="meta-label">Created on:</span>
                                            <span className="meta-value">{formatDate(report.createdOn)}</span>
                                        </div>
                                        <div className="meta-item">
                                            <span className="meta-label">Read by:</span>
                                            <span className="meta-value">{report.readBy} users</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="report-actions">
                                    <button 
                                        className="view-report-btn"
                                        onClick={() => handleViewReport(report.id)}
                                    >
                                        View Report
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminReports;
