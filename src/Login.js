import React from "react";
import './Login.css'
import { Link } from 'react-router-dom'

export default function Login(){
    return(
        <div className="logInCont">
            <h1>Log In</h1>
            <form action="">
                <label htmlFor="email_id">Email ID</label>
                <br />
                <input type="email" required placeholder="Enter registered email address..." />
                <br /><br />
                <label htmlFor="password">Password</label>
                <br />
                <input type="password" required placeholder="Enter password..." />
                <br /><br />
                <Link to={'/'}><button>Login</button></Link>
            </form>
        </div>
    )
}
