import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import AdminNavbar from './AdminNavbar';
import './AdminPages.css';

const AdminReports = () => {
    const navigate = useNavigate();
    const [reports, setReports] = useState([]);
    
    useEffect(() => {
        const fetchReports = async () => {
            try {
                // Fetch reports from Firestore
                const reportsSnapshot = await getDocs(collection(db, 'reports'));
                const reportsData = [];
                
                reportsSnapshot.forEach(doc => {
                    const data = doc.data();
                    reportsData.push({
                        id: doc.id,
                        title: data.title,
                        category: data.type === 'poll' ? 'poll report' : 'system report',
                        createdOn: data.createdAt || data.timestamp,
                        readBy: data.views || 0,
                        pollId: data.pollId || null
                    });
                });
                
                setReports(reportsData);
            } catch (error) {
                console.error("Error fetching reports:", error);
            }
        };
        
        fetchReports();
    }, []);

    const handleCreateReport = () => {
        navigate('/admin-create-report');
    };

    const handleViewReport = (reportId) => {
        navigate(`/admin-report-view/${reportId}`);
    };

    const handleDeleteReport = async (reportId) => {
        if (window.confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
            try {
                // Delete the report from Firestore
                await deleteDoc(doc(db, 'reports', reportId));
                
                // Update the local state to remove the deleted report
                setReports(prevReports => prevReports.filter(report => report.id !== reportId));
            } catch (error) {
                console.error("Error deleting report:", error);
                alert('Failed to delete report. Please try again.');
            }
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
                            <div key={report.id} className="report-management-card" style={{ position: 'relative' }}>
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
                                
                                <button 
                                    className="delete-report-btn"
                                    onClick={() => handleDeleteReport(report.id)}
                                    style={{
                                        position: 'absolute',
                                        top: '10px',
                                        right: '10px',
                                        backgroundColor: 'transparent',
                                        color: '#dc3545',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '18px',
                                        padding: '5px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: '30px',
                                        height: '30px',
                                        borderRadius: '50%',
                                        transition: 'all 0.2s',
                                        opacity: '0.7'
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.backgroundColor = 'rgba(220, 53, 69, 0.1)';
                                        e.currentTarget.style.opacity = '1';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                        e.currentTarget.style.opacity = '0.7';
                                    }}
                                    title="Delete Report"
                                >
                                    🗑️
                                </button>
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
