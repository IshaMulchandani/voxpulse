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
        <div className="logInCont">
            <h1>Log In</h1>
            
            {/* Error Message */}
            {error && (
                <div style={{
                    backgroundColor: '#fee', 
                    border: '1px solid #f66', 
                    color: '#c33', 
                    padding: '10px', 
                    borderRadius: '5px', 
                    marginBottom: '15px'
                }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Email / Username</label>
                <br />
                <input 
                    type="text" 
                    id="username"
                    required 
                    placeholder="Enter email or username..." 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={loading}
                />
                <br /><br />
                <label htmlFor="password">Password</label>
                <br />
                <input 
                    type="password" 
                    id="password"
                    required 
                    placeholder="Enter password..." 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                />
                <br /><br />
                <button 
                    type="submit"
                    disabled={loading}
                    style={{
                        opacity: loading ? 0.6 : 1,
                        cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <p>Don't have an account? <a href="/signup">Sign up here</a></p>
                <p><a href="/forgot-password">Forgot Password?</a></p>
            </div>
        </div>
    );
}