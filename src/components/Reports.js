import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase';
import './Reports.css';

const Reports = () => {
    const navigate = useNavigate();
    const [adminReports, setAdminReports] = useState([]);
    const [loading, setLoading] = useState(true);
    // const [showUserReports, setShowUserReports] = useState(true);
    const auth = getAuth();

    useEffect(() => {
        const fetchReports = async () => {
            try {
                setLoading(true);
                // Fetch reports from the publicReports collection
                const reportsSnapshot = await getDocs(collection(db, 'publicReports'));
                const reportsData = [];
                
                for (const doc of reportsSnapshot.docs) {
                    const data = doc.data();
                    reportsData.push({
                        id: doc.id,
                        ...data,
                        hasRead: data.readBy?.includes(auth.currentUser?.uid)
                    });
                }
                
                // Sort reports by creation date (newest first)
                reportsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                
                setAdminReports(reportsData);
            } catch (error) {
                console.error("Error fetching reports:", error);
            } finally {
                setLoading(false);
            }
        };
        
        if (auth.currentUser) {
            fetchReports();
        } else {
            setLoading(false);
        }
    }, [auth.currentUser]);

    const handleViewReport = async (reportId) => {
        try {
            if (!auth.currentUser) {
                alert('Please login to view this report');
                return;
            }

            // Get reference to the public report
            const reportRef = doc(db, 'publicReports', reportId);
            const reportDoc = await getDoc(reportRef);
            
            if (!reportDoc.exists()) {
                console.error("Report not found");
                alert('Report not found');
                return;
            }

            const reportData = reportDoc.data();

            // Check if user hasn't read this report yet
            if (!reportData.readBy?.includes(auth.currentUser.uid)) {
                await updateDoc(reportRef, {
                    readBy: arrayUnion(auth.currentUser.uid),
                    views: (reportData.views || 0) + 1
                });
            }

            // Navigate to admin report view (works for public reports too)
            navigate(`/admin-report-view/${reportId}`);
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
                
                {loading ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Loading reports...</p>
                    </div>
                ) : (
                    <>
                        {/* Admin Generated Reports Section */}
                        {adminReports.length > 0 ? (
                            <div className="admin-reports-section">
                                <h2 className="section-subtitle">Latest Reports</h2>
                                <div className="admin-reports-container">
                                    {adminReports.map(report => (
                                        <div key={report.id} className="admin-report-card">
                                            <h2>{report.title}</h2>
                                            <p>{report.description}</p>
                                            <div className="report-meta">
                                                <span className="report-type">
                                                    {report.type === 'poll' ? '📊 Poll Report' : '⚙️ System Report'}
                                                </span>
                                                <span className="report-date">
                                                    {new Date(report.createdAt).toLocaleDateString()}
                                                </span>
                                                {report.hasRead && (
                                                    <span className="read-indicator">✓ Read</span>
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
                        ) : (
                            <div className="no-reports-container">
                                <div className="no-reports-message">
                                    <h3>No Reports Available</h3>
                                    <p>There are currently no public reports available. Check back later for updates.</p>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Reports;
