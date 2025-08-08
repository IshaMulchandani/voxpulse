
import { signUpUser } from './authFunctions';
import { useState, useEffect } from 'react';
import React from "react";
import './SignUp.css'
import { Link, useNavigate } from 'react-router-dom'
export default function SignUp(){
    // State for form handling
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    // Form submission handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);
        setLoading(true);



        // Get form data
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');
        const name = formData.get('name');
        const phoneNo = formData.get('phoneNo');
        const gender = formData.get('gender');
        const dob = formData.get('dob');
        const profession = formData.get('profession');
        const annualIncome = formData.get('annualIncome');

        // Field validation
        if (!name || name.trim().length < 2) {
            setError('Please enter your full name (at least 2 characters).');
            setLoading(false);
            return;
        }
        if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
            setError('Please enter a valid email address.');
            setLoading(false);
            return;
        }
        if (!phoneNo || !/^\d{10}$/.test(phoneNo)) {
            setError('Please enter a valid 10-digit phone number.');
            setLoading(false);
            return;
        }
        if (!password || password.length < 6) {
            setError('Password must be at least 6 characters.');
            setLoading(false);
            return;
        }
        if (!gender) {
            setError('Please select your gender.');
            setLoading(false);
            return;
        }
        if (!dob) {
            setError('Please select your date of birth.');
            setLoading(false);
            return;
        }
        if (!profession || profession.trim().length < 2) {
            setError('Please enter your profession (at least 2 characters).');
            setLoading(false);
            return;
        }
        if (!annualIncome) {
            setError('Please select your annual income range.');
            setLoading(false);
            return;
        }

        // Calculate age from date of birth
        const today = new Date();
        const birthDate = new Date(dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        // Prepare user data for Firestore
        const userData = {
            name: name,
            phoneNo: phoneNo,
            gender: gender,
            dateOfBirth: dob,
            age: age,
            profession: profession,
            annualIncome: annualIncome,
            profileComplete: true
        };

        try {
            const result = await signUpUser(email, password, userData);
            if (result && result.success) {
                setSuccess(true);
                // Do not redirect; just show success message
            } else if (result && result.error && result.error.includes('email-already')) {
                setError('Email already exists. Please log in or use a different email.');
            } else {
                setError(result ? result.error : 'Signup failed');
            }
        } catch (error) {
            if (error.message && error.message.includes('email-already')) {
                setError('Email already exists. Please log in or use a different email.');
            } else {
                setError('An unexpected error occurred');
            }
        }
        setLoading(false);
    };

    return(
        <div className="signUpCont">
            <h1>Sign Up</h1>



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

            {/* Success Message */}
            {success && (
                <div style={{
                    backgroundColor: '#efe', 
                    border: '1px solid #6f6', 
                    color: '#363', 
                    padding: '10px', 
                    borderRadius: '5px', 
                    marginBottom: '15px'
                }}>
                    Account created successfully! You can now <Link to="/login">log in</Link>.
                </div>
            )}

            <form onSubmit={handleSubmit} autoComplete="off">
                <label htmlFor="name">Name</label>
                <input 
                    type="text" 
                    name="name"
                    id="name"
                    required 
                    placeholder="Enter your full name..."
                    disabled={loading}
                />
                
                <label htmlFor="email_id">Email ID</label>
                <input 
                    type="email" 
                    name="email"
                    id="email_id"
                    required 
                    placeholder="Enter your email address..."
                    disabled={loading}
                />
                
                <label htmlFor="phoneNo">Phone Number</label>
                <input 
                    type="tel" 
                    name="phoneNo"
                    id="phoneNo"
                    required 
                    placeholder="Enter your phone number..."
                    disabled={loading}
                    maxLength={10}
                />
                
                <label htmlFor="password">Create Password</label>
                <input 
                    type="password" 
                    name="password"
                    id="password"
                    required 
                    placeholder="Create a secure password (min 6 characters)..."
                    disabled={loading}
                />
                
                <div className="gender-section">
                    <label htmlFor="gender">Choose your gender:</label>
                    <label htmlFor="male">
                        <input 
                            type="radio" 
                            name="gender" 
                            id="male" 
                            value='male'
                            disabled={loading}
                        />
                        Male
                    </label>
                    <label htmlFor="female">
                        <input 
                            type="radio" 
                            name="gender" 
                            id="female" 
                            value='female'
                            disabled={loading}
                        />
                        Female
                    </label>
                    <label htmlFor="other">
                        <input 
                            type="radio" 
                            name="gender" 
                            id="other" 
                            value='other'
                            disabled={loading}
                        />
                        Other
                    </label>
                </div>
                
                <label htmlFor="dob">Date of Birth</label>
                <input 
                    type="date" 
                    name="dob"
                    id="dob" 
                    required
                    disabled={loading}
                />
                
                <label htmlFor="profession">Profession</label>
                <input 
                    type="text" 
                    name="profession"
                    id="profession" 
                    required 
                    placeholder="Enter your profession..."
                    disabled={loading}
                />
                
                <label htmlFor="annualIncome">Annual Income</label>
                <select 
                    name="annualIncome" 
                    id="annualIncome"
                    required
                    disabled={loading}
                >
                    <option value="" disabled>Select your income range</option>
                    <option value="0-100000">₹0 - ₹1,00,000</option>
                    <option value="100001-300000">₹1,00,001 - ₹3,00,000</option>
                    <option value="300001-600000">₹3,00,001 - ₹6,00,000</option>
                    <option value="600001-1000000">₹6,00,001 - ₹10,00,000</option>
                    <option value="1000000+">₹10,00,000+</option>
                </select>
                
                <button 
                    type="submit"
                    disabled={loading}
                    style={{
                        opacity: loading ? 0.6 : 1,
                        cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {loading ? 'Creating Account...' : 'Submit'}
                </button>
            </form>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <p>Already have an account? <Link to="/login">Sign in here</Link></p>
            </div>
        </div>
    )
}