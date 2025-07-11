import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import './AdminPages.css';

const AdminManageAccess = () => {
    const navigate = useNavigate();
    const [notification, setNotification] = useState(null);
    
    // Fetch users from Firestore
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { getDocs, collection } = await import('firebase/firestore');
                const { db } = await import('../firebase');
                const querySnapshot = await getDocs(collection(db, 'users'));
                const userList = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        name: data.name || '',
                        email: data.email || '',
                        avatar: data.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(data.name || 'User'),
                        accountCreated: data.createdAt || '',
                        role: data.role || 'user',
                        interactions: data.interactions || 0
                    };
                });
                setUsers(userList);
            } catch (err) {
                setUsers([]);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

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
                    </div>

                    {notification && (
                        <div className={`notification ${notification.type}`}>
                            {notification.message}
                        </div>
                    )}
                    
                    <div className="users-list">
                        {loading ? (
                            <div>Loading users...</div>
                        ) : users.length === 0 ? (
                            <div>No users found.</div>
                        ) : (
                            users.map(user => (
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
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminManageAccess;
