import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import AdminNavbar from './components/AdminNavbar';
import { db } from './firebase';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState([
        { title: 'Total Users', value: '...' },
        { title: 'Active Polls', value: '...' },
        { title: 'Total Votes', value: '...' },
        { title: 'Reports Generated', value: '...' }
    ]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch total users
                const usersSnapshot = await getDocs(collection(db, 'users'));
                const totalUsers = usersSnapshot.size;

                // Fetch polls and calculate active polls and total votes
                const pollsSnapshot = await getDocs(collection(db, 'polls'));
                let totalVotes = 0;
                let activePollCount = 0;

                pollsSnapshot.forEach(doc => {
                    const poll = doc.data();
                    
                    // Sum up all votes from each poll
                    if (poll.votes) {
                        totalVotes += poll.votes.reduce((sum, current) => sum + current, 0);
                    }
                    
                    // Check if poll is active (not expired)
                    const endDate = poll.endDate ? new Date(poll.endDate) : null;
                    if (!endDate || endDate > new Date()) {
                        activePollCount++;
                    }
                });

                // Fetch reports count
                const reportsSnapshot = await getDocs(collection(db, 'reports'));
                const totalReports = reportsSnapshot.size;

                // Format numbers for display
                const formatNumber = (num) => {
                    if (num >= 1000) {
                        return (num / 1000).toFixed(1) + 'K';
                    }
                    return num.toString();
                };

                setStats([
                    { title: 'Total Users', value: formatNumber(totalUsers) },
                    { title: 'Active Polls', value: formatNumber(activePollCount) },
                    { title: 'Total Votes', value: formatNumber(totalVotes) },
                    { title: 'Reports Generated', value: formatNumber(totalReports) }
                ]);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        };

        fetchDashboardData();
    }, []);

    const [recentActivity, setRecentActivity] = useState([]);

    useEffect(() => {
        const fetchRecentActivity = async () => {
            try {
                // Get recent polls
                const recentPollsQuery = query(
                    collection(db, 'polls'),
                    where('createdAt', '>=', Timestamp.fromDate(new Date(Date.now() - 24 * 60 * 60 * 1000)))
                );
                const recentPollsSnapshot = await getDocs(recentPollsQuery);
                
                // Get recent reports
                const recentReportsQuery = query(
                    collection(db, 'reports'),
                    where('createdAt', '>=', Timestamp.fromDate(new Date(Date.now() - 24 * 60 * 60 * 1000)))
                );
                const recentReportsSnapshot = await getDocs(recentReportsQuery);

                const activities = [];

                recentPollsSnapshot.forEach(doc => {
                    const data = doc.data();
                    activities.push({
                        title: `New Poll Created: ${data.title}`,
                        time: formatTimeAgo(data.createdAt.toDate()),
                        status: 'active'
                    });
                });

                recentReportsSnapshot.forEach(doc => {
                    const data = doc.data();
                    activities.push({
                        title: `Report Generated: ${data.title}`,
                        time: formatTimeAgo(data.createdAt.toDate()),
                        status: data.status || 'pending'
                    });
                });

                // Sort by time and take the most recent 4
                activities.sort((a, b) => new Date(b.time) - new Date(a.time));
                setRecentActivity(activities.slice(0, 4));
            } catch (error) {
                console.error('Error fetching recent activity:', error);
            }
        };

        const formatTimeAgo = (date) => {
            const now = new Date();
            const diffInMinutes = Math.floor((now - date) / (1000 * 60));
            
            if (diffInMinutes < 60) {
                return `${diffInMinutes} minutes ago`;
            } else if (diffInMinutes < 1440) {
                const hours = Math.floor(diffInMinutes / 60);
                return `${hours} hour${hours > 1 ? 's' : ''} ago`;
            } else {
                const days = Math.floor(diffInMinutes / 1440);
                return `${days} day${days > 1 ? 's' : ''} ago`;
            }
        };

        fetchRecentActivity();
        // Refresh every 5 minutes
        const interval = setInterval(fetchRecentActivity, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="admin-dashboard">
            <AdminNavbar />
            <div style={{ padding: '2rem' }}>
                <h1 style={{ marginBottom: '2rem' }}>Admin Dashboard</h1>

                <div className="admin-stats">
                    {stats.map((stat, index) => (
                        <div key={index} className="stat-card">
                            <h3>{stat.title}</h3>
                            <div className="stat-value">{stat.value}</div>
                        </div>
                    ))}
                </div>

                <div className="admin-actions">
                    <div className="action-card">
                        <h3>Poll Management</h3>
                        <div className="action-buttons">
                            <button className="action-btn btn-primary" onClick={() => navigate('/admin-create-poll')}>Create Poll</button>
                            <button className="action-btn btn-secondary" onClick={() => navigate('/admin-create-polls')}>View All</button>
                        </div>
                    </div>

                    <div className="action-card">
                        <h3>User Management</h3>
                        <div className="action-buttons">
                            <button className="action-btn btn-secondary" onClick={()=>navigate('/admin-manage-access')}>Manage Access</button>
                        </div>
                    </div>
                </div>

                <div className="recent-activity">
                    <h3>Recent Activity</h3>
                    <div className="activity-list">
                        {recentActivity.map((activity, index) => (
                            <div key={index} className="activity-item">
                                <div className="activity-info">
                                    <div className="activity-title">{activity.title}</div>
                                    <div className="activity-time">{activity.time}</div>
                                </div>
                                <span className={`status-badge status-${activity.status}`}>
                                    {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
