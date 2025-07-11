import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import AdminNavbar from './components/AdminNavbar';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const stats = [
        { title: 'Total Users', value: '1,234' },
        { title: 'Active Polls', value: '45' },
        { title: 'Total Votes', value: '12.5K' },
        { title: 'Reports Generated', value: '89' }
    ];

    const recentActivity = [
        {
            title: 'New Poll Created',
            time: '2 minutes ago',
            status: 'active'
        },
        {
            title: 'User Report Generated',
            time: '15 minutes ago',
            status: 'resolved'
        },
        {
            title: 'Comment Flagged',
            time: '1 hour ago',
            status: 'pending'
        },
        {
            title: 'New User Registration',
            time: '2 hours ago',
            status: 'resolved'
        }
    ];

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
