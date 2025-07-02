import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Check if admin credentials
        if (username === "admin" && password === "1234") {
            navigate('/admin-dashboard');
        } else {
            // For any other credentials, redirect to user dashboard
            navigate('/dashboard');
        }
    };

    return (
        <div className="logInCont">
            <h1>Log In</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username</label>
                <br />
                <input 
                    type="text" 
                    required 
                    placeholder="Enter username..." 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <br /><br />
                <label htmlFor="password">Password</label>
                <br />
                <input 
                    type="password" 
                    required 
                    placeholder="Enter password..." 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <br /><br />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}
