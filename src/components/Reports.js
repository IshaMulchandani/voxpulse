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
                const reportsSnapshot = await getDocs(collection(db, 'reports'));
                const reportsData = [];
                
                for (const doc of reportsSnapshot.docs) {
                    const data = doc.data();
                    // Only include reports that are marked as public
                    if (data.isPublic) {
                        reportsData.push({
                            id: doc.id,
                            ...data,
                            hasRead: data.readBy?.includes(auth.currentUser?.uid)
                        });
                    }
                }
                
                setAdminReports(reportsData);
            } catch (error) {
                console.error("Error fetching reports:", error);
            }
        };
        
        if (auth.currentUser) {
            fetchReports();
        }
    }, [auth.currentUser]);

    const handleViewReport = async (reportId) => {
        try {
            if (!auth.currentUser) {
                alert('Please login to view this report');
                return;
            }

            // Get reference to the report
            const reportRef = doc(db, 'reports', reportId);
            const reportDoc = await getDoc(reportRef);
            
            if (!reportDoc.exists()) {
                console.error("Report not found");
                return;
            }

            if (!reportDoc.data().isPublic) {
                console.error("This report is not public");
                return;
            }

            // Check if user hasn't read this report yet
            if (!reportDoc.data().readBy?.includes(auth.currentUser.uid)) {
                await updateDoc(reportRef, {
                    readBy: arrayUnion(auth.currentUser.uid),
                    views: (reportDoc.data().views || 0) + 1
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

                {/* Removed legacy dummy user reports section */}
            </div>
        </div>
    );
};

export default Reports;
