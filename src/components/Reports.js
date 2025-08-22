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
        const setupReportsListener = async () => {
            if (!auth.currentUser) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                
                // Import onSnapshot for real-time listener
                const { onSnapshot } = await import('firebase/firestore');
                
                // Set up real-time listener for report changes
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
                                ...data,
                                hasRead: data.readBy?.includes(auth.currentUser?.uid)
                            });
                        }
                    });
                    
                    reportsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    setAdminReports(reportsData);
                    setLoading(false);
                });
                
                return unsubscribe;
            } catch (error) {
                console.error("Error setting up reports listener:", error);
                setLoading(false);
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

            // Navigate to user report view
            navigate(`/user-report-view/${reportId}`);
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
