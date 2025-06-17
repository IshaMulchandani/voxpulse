import React from "react";
import './SignUp.css'
import { Link } from 'react-router-dom'

export default function SignUp(){
    return(
        <div className="signUpCont">
            <h1>Sign Up</h1>
            <form action="">
                <label htmlFor="name">Name</label><br />
                <input type="text" required placeholder="Enter name..."/>
                <br /><br />
                <label htmlFor="email_id">Email ID</label>
                <br />
                <input type="email" required placeholder="Enter email address..." />
                <br /><br />
                <label htmlFor="phoneNo">Phone Number</label>
                <br />
                <input type="number" required placeholder="Enter phone number..." />
                <br /><br />
                <label htmlFor="password">Create Password</label>
                <br />
                <input type="password" required placeholder="Create a new password..." />
                <br /><br />
                <label htmlFor="gender">Choose your gender:</label><br />
                <label htmlFor="male">Male
                    <input type="radio" name="gender" value='male' />
                </label><br />
                <label htmlFor="female">Female
                    <input type="radio" name="gender" value='female' />
                </label><br />
                <label htmlFor="other">Other
                    <input type="radio" name="gender" value='other' />
                </label><br /><br />
                <label htmlFor="dob">Date of Birth</label>
                <br />
                <input type="date" required/><br /><br />
                <label htmlFor="profession">Profession</label>
                <br />
                <input type="text" required placeholder="Enter your profession..." />
                <br /><br />
                <label htmlFor="annualIncome">Annual Income</label>
                <br />
                <select name="" id="">
                    <option value="" selected disabled>Select</option>
                    <option value="">0- &#8377;1,00,000</option>
                    <option value="">&#8377;1,00,001-&#8377;3,00,000</option>
                    <option value="">&#8377;3,00,001-&#8377;6,00,000</option>
                    <option value="">&#8377;6,00,001-&#8377;10,00,000</option>
                    <option value="">&gt;&#8377;10,00,000</option>
                </select><br /><br />
                <Link to='/' ><button>Submit</button></Link>
            </form>
        </div>
    )
}