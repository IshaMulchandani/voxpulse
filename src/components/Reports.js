import React, { useState, useEffect } from 'react';
import Header2 from '../Header2';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase';
import './Reports.css';

const Reports = () => {
    const navigate = useNavigate();
    const [adminReports, setAdminReports] = useState([]);
    const [showUserReports, setShowUserReports] = useState(true);
    const auth = getAuth();

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const reportsSnapshot = await getDocs(collection(db, 'publicReports'));
                const reportsData = [];
                
                reportsSnapshot.forEach(doc => {
                    const data = doc.data();
                    reportsData.push({
                        id: doc.id,
                        ...data,
                        hasRead: data.readBy?.includes(auth.currentUser?.uid)
                    });
                });
                
                setAdminReports(reportsData);
            } catch (error) {
                console.error("Error fetching reports:", error);
            }
        };
        
        if (auth.currentUser) {
            fetchReports();
        }
    }, [auth.currentUser]);

    const handleViewReport = async (reportId, isUserReport = false) => {
        if (isUserReport) {
            navigate(`/report/${reportId}`);
            return;
        }

        try {
            if (!auth.currentUser) {
                alert('Please login to view this report');
                return;
            }

            // Get reference to both public and admin reports
            const publicReportRef = doc(db, 'publicReports', reportId);
            const publicReportDoc = await getDoc(publicReportRef);
            
            if (!publicReportDoc.exists()) {
                console.error("Report not found");
                return;
            }

            const adminReportId = publicReportDoc.data().reportId;
            const adminReportRef = doc(db, 'reports', adminReportId);

            // Check if user hasn't read this report yet
            if (!publicReportDoc.data().readBy?.includes(auth.currentUser.uid)) {
                // Update readBy array in both collections
                await updateDoc(publicReportRef, {
                    readBy: arrayUnion(auth.currentUser.uid)
                });
                
                await updateDoc(adminReportRef, {
                    readBy: arrayUnion(auth.currentUser.uid),
                    views: (publicReportDoc.data().readBy?.length || 0) + 1
                });
            }

            // Navigate to report view
            navigate(`/report/${reportId}`);
        } catch (error) {
            console.error("Error updating report views:", error);
            alert('Error loading report. Please try again.');
        }
    };

    return (
        <div>
            <Navbar />
            <div className="section-page">
                <h1 className="section-title">Reports</h1>
                
                {/* Admin Generated Reports Section */}
                {adminReports.length > 0 && (
                    <div className="admin-reports-section">
                        <h2 className="section-subtitle">Latest Reports</h2>
                        <div className="admin-reports-container">
                            {adminReports.map(report => (
                                <div key={report.id} className="admin-report-card">
                                    <h2>{report.title}</h2>
                                    <p>{report.description}</p>
                                    <div className="report-meta">
                                        <span className="report-type">
                                            {report.type === 'poll' ? '📊 Poll' : '⚙️ System'}
                                        </span>
                                        {report.hasRead && (
                                            <span className="read-indicator">✓</span>
                                        )}
                                    </div>
                                    <button 
                                        className="admin-view-report-btn"
                                        onClick={() => handleViewReport(report.id)}
                                    >
                                        View Report
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Original User Reports Section */}
                <div className="user-reports-section">
                    <h2 className="section-subtitle">Your Activity Reports</h2>
                    <div className="user-reports-container">
                        <div className="user-report-card">
                            <h2>Vote Analysis Report</h2>
                            <p>A comprehensive overview of your voting patterns, participation rates, and engagement metrics for the past month.</p>
                            <button className="user-view-report-btn" onClick={() => handleViewReport('vote-analysis', true)}>View Report</button>
                        </div>
                        
                        <div className="user-report-card">
                            <h2>Comment Analysis</h2>
                            <p>Detailed breakdown of the comments you've posted across different categories.</p>
                            <button className="user-view-report-btn" onClick={() => handleViewReport('comment-analysis', true)}>View Report</button>
                        </div>
                        
                        <div className="user-report-card">
                            <h2>Activity Report</h2>
                            <p>See how your votes have influenced poll outcomes and your contribution to the community's decision-making process.</p>
                            <button className="user-view-report-btn" onClick={() => handleViewReport('activity-report', true)}>View Report</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
