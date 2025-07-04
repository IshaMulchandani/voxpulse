import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import './AdminPages.css';

const AdminManageAccess = () => {
    const navigate = useNavigate();
    const [notification, setNotification] = useState(null);
    
    // Dummy data for existing users
    const [users, setUsers] = useState([
        {
            id: 1,
            name: "John Doe",
            email: "john.doe@example.com",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100",
            accountCreated: "2025-01-15",
            role: "user",
            interactions: 142
        },
        {
            id: 2,
            name: "Sarah Wilson",
            email: "sarah.wilson@example.com",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&q=80&w=100",
            accountCreated: "2025-02-03",
            role: "admin",
            interactions: 298
        },
        {
            id: 3,
            name: "Mike Johnson",
            email: "mike.johnson@example.com",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100",
            accountCreated: "2025-02-10",
            role: "user",
            interactions: 87
        },
        {
            id: 4,
            name: "Emily Chen",
            email: "emily.chen@example.com",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100",
            accountCreated: "2025-02-18",
            role: "user",
            interactions: 203
        },
        {
            id: 5,
            name: "David Brown",
            email: "david.brown@example.com",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100",
            accountCreated: "2025-03-01",
            role: "user",
            interactions: 156
        },
        {
            id: 6,
            name: "Lisa Anderson",
            email: "lisa.anderson@example.com",
            avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100",
            accountCreated: "2025-03-08",
            role: "user",
            interactions: 94
        },
        {
            id: 7,
            name: "Alex Martinez",
            email: "alex.martinez@example.com",
            avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100",
            accountCreated: "2025-03-15",
            role: "user",
            interactions: 67
        },
        {
            id: 8,
            name: "Rachel Green",
            email: "rachel.green@example.com",
            avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=100",
            accountCreated: "2025-03-22",
            role: "user",
            interactions: 234
        }
    ]);

    const handleCreateUser = () => {
        navigate('/admin-create-user');
    };

    const handleGrantAdmin = (userId) => {
        setUsers(prevUsers => 
            prevUsers.map(user => 
                user.id === userId 
                    ? { ...user, role: user.role === 'admin' ? 'user' : 'admin' }
                    : user
            )
        );
        
        const user = users.find(u => u.id === userId);
        const action = user.role === 'admin' ? 'revoked admin access from' : 'granted admin access to';
        setNotification({ 
            type: 'success', 
            message: `Successfully ${action} ${user.name}` 
        });
        
        setTimeout(() => setNotification(null), 3000);
    };

    const handleDeleteUser = (userId) => {
        const user = users.find(u => u.id === userId);
        if (window.confirm(`Are you sure you want to delete ${user.name}'s account? This action cannot be undone.`)) {
            setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
            setNotification({ 
                type: 'success', 
                message: `Successfully deleted ${user.name}'s account` 
            });
            setTimeout(() => setNotification(null), 3000);
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

    return (
        <div>
            <AdminNavbar />
            <div className="admin-page">
                <div className="admin-page-container">
                    <div className="user-management-header">
                        <h1 className="admin-page-title">User Management</h1>
                        <button 
                            className="create-user-btn"
                            onClick={handleCreateUser}
                        >
                            + Create User
                        </button>
                    </div>

                    {notification && (
                        <div className={`notification ${notification.type}`}>
                            {notification.message}
                        </div>
                    )}
                    
                    <div className="users-list">
                        {users.map(user => (
                            <div key={user.id} className="user-management-card">
                                <div className="user-avatar">
                                    <img src={user.avatar} alt={user.name} />
                                </div>
                                
                                <div className="user-details">
                                    <h3 className="user-name">{user.name}</h3>
                                    <p className="user-email">{user.email}</p>
                                    <div className="user-meta">
                                        <div className="meta-item">
                                            <span className="meta-label">Account created:</span>
                                            <span className="meta-value">{formatDate(user.accountCreated)}</span>
                                        </div>
                                        <div className="meta-item">
                                            <span className="meta-label">Role:</span>
                                            <span className={`meta-value role-badge ${user.role}`}>
                                                {user.role === 'admin' ? 'Admin' : 'User'}
                                            </span>
                                        </div>
                                        <div className="meta-item">
                                            <span className="meta-label">Interactions:</span>
                                            <span className="meta-value">{user.interactions}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="user-actions">
                                    <button 
                                        className={`admin-toggle-btn ${user.role === 'admin' ? 'revoke' : 'grant'}`}
                                        onClick={() => handleGrantAdmin(user.id)}
                                    >
                                        {user.role === 'admin' ? 'Revoke Admin' : 'Grant Admin'}
                                    </button>
                                    <button 
                                        className="delete-user-btn"
                                        onClick={() => handleDeleteUser(user.id)}
                                    >
                                        Delete User
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

export default AdminManageAccess;
