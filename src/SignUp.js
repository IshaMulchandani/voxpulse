import React from "react";
import './SignUp.css'
import { Link } from 'react-router-dom'

export default function SignUp(){
    return(
        <div className="signUpCont">
            <h1>Sign Up</h1>
            <form action="">
                <label htmlFor="name">Name</label>
                <input type="text" required placeholder="Enter your full name..."/>
                
                <label htmlFor="email_id">Email ID</label>
                <input type="email" required placeholder="Enter your email address..." />
                
                <label htmlFor="phoneNo">Phone Number</label>
                <input type="number" required placeholder="Enter your phone number..." />
                
                <label htmlFor="password">Create Password</label>
                <input type="password" required placeholder="Create a secure password..." />
                
                <div className="gender-section">
                    <label htmlFor="gender">Choose your gender:</label>
                    <label htmlFor="male">
                        <input type="radio" name="gender" id="male" value='male' />
                        Male
                    </label>
                    <label htmlFor="female">
                        <input type="radio" name="gender" id="female" value='female' />
                        Female
                    </label>
                    <label htmlFor="other">
                        <input type="radio" name="gender" id="other" value='other' />
                        Other
                    </label>
                </div>
                
                <label htmlFor="dob">Date of Birth</label>
                <input type="date" id="dob" required/>
                
                <label htmlFor="profession">Profession</label>
                <input type="text" id="profession" required placeholder="Enter your profession..." />
                
                <label htmlFor="annualIncome">Annual Income</label>
                <select name="annualIncome" id="annualIncome">
                    <option value="" selected disabled>Select your income range</option>
                    <option value="0-100000">₹0 - ₹1,00,000</option>
                    <option value="100001-300000">₹1,00,001 - ₹3,00,000</option>
                    <option value="300001-600000">₹3,00,001 - ₹6,00,000</option>
                    <option value="600001-1000000">₹6,00,001 - ₹10,00,000</option>
                    <option value="1000000+">₹10,00,000+</option>
                </select>
                
                <Link to='/' >
                    <button type="button">Submit</button>
                </Link>
            </form>
        </div>
    )
}