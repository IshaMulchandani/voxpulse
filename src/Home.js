import { React, useState } from "react";
import './Home.css'
import { Link } from 'react-router-dom'
import Header from "./Header";

export default function Home(){
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return(
        <div className="homeCont">
            <Header/>
            <br /><br />
            <div className="sec1">
                <div className="sec1Cont">
                    <h3>Newest Polls🔥</h3>
                    <ul className="pollList">
                        <li onClick={openModal}>Should Self-Defense Laws Be Expanded or Restricted?🕵️‍♀️</li>
                        <li onClick={openModal}>Do You Believe Personality Is More Nature or Nurture?🧠</li>
                        <li onClick={openModal}>Is VAR (Video Assistant Referee) Ruining the Spirit of Football?⚽</li>
                        <li onClick={openModal}>Should Voting Be Made Mandatory for All Eligible Citizens?🗳️</li>
                        <li onClick={openModal}>Which Movie Genre Is Overrated Today?🎥</li>
                    </ul>
                </div>
            </div>
            <br /><br />
            <div className="sec2">
                <div className="sec2Cont">
                    <h3>Latest Results📈</h3>
                    <ul className="resultsList">
                        <li onClick={openModal}>Do You Think Social Media Is Contributing to a Decline in Mental Health?🧠</li>
                        <li onClick={openModal}>Should Political Ads Be Banned on Social Media Platforms?🗳️</li>
                        <li onClick={openModal}>Should Athletes Be Allowed to Protest During National Anthems?⚽</li>
                        <li onClick={openModal}>Is the Rise of AI in Scriptwriting a Threat to Creative Storytelling?🎥</li>
                        <li onClick={openModal}>Should Juvenile Offenders Be Tried as Adults for Serious Crimes?🕵️‍♀️</li>
                    </ul>
                </div>
            </div>

            {isModalOpen && (
                <div className="modalOverlay" onClick={closeModal}>
                    <div className="modalContent" onClick={(e) => e.stopPropagation()}>
                        <button className="closeModal" onClick={closeModal}>×</button>
                        <h2>Login to Continue</h2>
                        <p>In order to view the next page, you must be logged in.</p>
                        <Link to={'/login'}><button className="modal-btn">Login</button></Link>
                    </div>
                </div>
            )}
        </div>
    )
}