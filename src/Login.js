import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { signInUser } from './authFunctions'; // Adjust path as needed
import './Login.css';

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        // Check if admin credentials first
        if (username === "admin" && password === "1234") {
            setLoading(false);
            navigate('/admin-dashboard');
            return;
        }

        // For regular users, authenticate with Firebase
        try {
            const result = await signInUser(username, password);
            
            if (result.success) {
                // Check if user is admin based on email or other criteria
                if (username === "admin@voxpulse.com") {
                    navigate('/admin-dashboard');
                } else {
                    navigate('/dashboard');
                }
            } else {
                setError(result.error);
            }
        } catch (error) {
            setError('An unexpected error occurred');
            console.error('Login error:', error);
        }
        
        setLoading(false);
    };

    return (
        <div className="login-page">
            <div className="logInCont">
                <h2>Login</h2>
                
                {/* Error Message */}
                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Email / Username</label>
                        <input 
                            type="text" 
                            id="username"
                            required 
                            placeholder="Enter email or username..." 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input 
                            type="password" 
                            id="password"
                            required 
                            placeholder="Enter password..." 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                    
                    <button 
                        type="submit"
                        className="login-btn"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div className="login-links">
                    <p>Don't have an account? <a href="/signup">Sign up here</a></p>
                    <p><a href="/forgot-password">Forgot Password?</a></p>
                </div>
            </div>
        </div>
    );
}