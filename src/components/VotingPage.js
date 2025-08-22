import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from './Navbar';
import './VotingPage.css';
import { doc, getDoc, updateDoc, collection, addDoc, getDocs, query, orderBy, arrayUnion, arrayRemove } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase';
import sentimentAnalyzer from '../services/sentimentAnalysis';
import SentimentAnalytics from './SentimentAnalytics';

const VotingPage = () => {
    const navigate = useNavigate();
    const { pollId } = useParams();
    const [selectedOption, setSelectedOption] = useState('');
    const [showNotification, setShowNotification] = useState(false);
    const [poll, setPoll] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [commentsLoading, setCommentsLoading] = useState(true);

    useEffect(() => {
        const fetchPoll = async () => {
            try {
                const pollDoc = await getDoc(doc(db, 'polls', pollId));
                if (pollDoc.exists()) {
                    setPoll(pollDoc.data());
                } else {
                    setPoll({
                        title: "Poll Not Found",
                        description: "The requested poll could not be found.",
                        options: []
                    });
                }
            } catch (e) {
                setPoll({
                    title: "Poll Not Found",
                    description: "The requested poll could not be found.",
                    options: []
                });
            }
        };
        fetchPoll();
    }, [pollId]);

    useEffect(() => {
        const fetchUserAndComments = async () => {
            try {
                const auth = getAuth();
                const user = auth.currentUser;
                setCurrentUser(user);

                if (user) {
                    // Fetch user profile
                    const userProfileSnap = await getDoc(doc(db, 'users', user.uid));
                    if (userProfileSnap.exists()) {
                        setUserProfile(userProfileSnap.data());
                    }
                }

                // Fetch comments for this poll
                await fetchComments();
            } catch (error) {
                console.error('Error fetching user and comments:', error);
                setCommentsLoading(false);
            }
        };

        fetchUserAndComments();
    }, [pollId]);

    const fetchComments = async () => {
        try {
            setCommentsLoading(true);
            const commentsRef = collection(db, 'polls', pollId, 'comments');
            const commentsQuery = query(commentsRef, orderBy('createdAt', 'desc'));
            const commentsSnapshot = await getDocs(commentsQuery);
            
            const commentsData = [];
            commentsSnapshot.forEach(doc => {
                commentsData.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            
            setComments(commentsData);
        } catch (error) {
            console.error('Error fetching comments:', error);
        } finally {
            setCommentsLoading(false);
        }
    };

    const handleOptionChange = (e) => {
        setSelectedOption(e.target.value);
    };


    const handleSubmit = async () => {
        if (!selectedOption || !poll) return;
        try {
            // Find the index of the selected option
            const optionIndex = poll.options.findIndex(opt => opt === selectedOption);
            if (optionIndex === -1) return;

            // Get current user
            const auth = getAuth();
            const user = auth.currentUser;
            if (!user) {
                alert('You must be logged in to vote.');
                return;
            }

            // Fetch user profile for detailed tracking
            const userProfileSnap = await getDoc(doc(db, 'users', user.uid));
            const profile = userProfileSnap.exists() ? userProfileSnap.data() : {};

            // Prepare user vote data with demographics
            const userVoteData = {
                userId: user.uid,
                optionIndex: optionIndex,
                option: selectedOption,
                timestamp: new Date(),
                userDetails: {
                    gender: profile.gender || 'Not Specified',
                    age: profile.age || 'Not Specified',
                    location: profile.location || 'Not Specified',
                    profession: profile.profession || 'Not Specified',
                    annualIncome: profile.annualIncome || 'Not Specified'
                }
            };

            // Get current poll data
            const pollRef = doc(db, 'polls', pollId);
            const currentPollSnap = await getDoc(pollRef);
            const currentPoll = currentPollSnap.data();

            // Initialize or get existing votesWithDetails array
            let votesWithDetails = currentPoll.votesWithDetails || [];
            
            // Check if user has already voted
            const existingVoteIndex = votesWithDetails.findIndex(vote => vote.userId === user.uid);
            if (existingVoteIndex !== -1) {
                // Update existing vote
                votesWithDetails[existingVoteIndex] = userVoteData;
            } else {
                // Add new vote
                votesWithDetails.push(userVoteData);
            }

            // Calculate total votes for each option
            const newVotes = Array(poll.options.length).fill(0);
            votesWithDetails.forEach(vote => {
                if (vote.optionIndex >= 0 && vote.optionIndex < newVotes.length) {
                    newVotes[vote.optionIndex]++;
                }
            });

            // Update the poll document with both votes array and detailed votes
            await updateDoc(pollRef, { 
                votes: newVotes,
                votesWithDetails: votesWithDetails
            });

            setShowNotification(true);
            // After 2 seconds, redirect back to trending topics
            setTimeout(() => {
                navigate('/trending');
            }, 2000);
        } catch (e) {
            console.error('Error submitting vote:', e);
            alert('Failed to submit vote. Please try again.');
        }
    };

    const handleCommentSubmit = async () => {
        if (!newComment.trim() || !currentUser) {
            alert('Please login and enter a comment.');
            return;
        }

        try {
            // Analyze sentiment of the comment
            const sentimentResult = sentimentAnalyzer.classifySentiment(newComment.trim());
            
            const commentData = {
                text: newComment.trim(),
                userId: currentUser.uid,
                userName: userProfile?.name || userProfile?.firstName || 'Anonymous User',
                userEmail: currentUser.email,
                createdAt: new Date(),
                likes: [],
                likeCount: 0,
                pollId: pollId,
                // Add sentiment analysis data
                sentiment: sentimentResult.sentiment,
                sentimentScore: sentimentResult.score,
                sentimentMagnitude: sentimentResult.magnitude,
                sentimentConfidence: sentimentResult.confidence
            };

            const commentsRef = collection(db, 'polls', pollId, 'comments');
            await addDoc(commentsRef, commentData);
            setNewComment('');
            await fetchComments();
        } catch (error) {
            console.error('Error adding comment:', error);
            alert('Failed to add comment. Please try again.');
        }
    };

    const handleLikeComment = async (commentId, currentLikes) => {
        if (!currentUser) {
            alert('Please login to like comments.');
            return;
        }

        try {
            const commentRef = doc(db, 'polls', pollId, 'comments', commentId);
            const hasLiked = currentLikes.includes(currentUser.uid);

            if (hasLiked) {
                // Remove like
                await updateDoc(commentRef, {
                    likes: arrayRemove(currentUser.uid),
                    likeCount: Math.max(0, currentLikes.length - 1)
                });
            } else {
                // Add like
                await updateDoc(commentRef, {
                    likes: arrayUnion(currentUser.uid),
                    likeCount: currentLikes.length + 1
                });
            }

            // Refresh comments
            await fetchComments();
        } catch (error) {
            console.error('Error updating like:', error);
        }
    };

    if (!poll) return (
        <div>
            <Navbar />
            <div className="voting-page">
                <div className="back-arrow" onClick={() => navigate(`/poll/${pollId}`)}>
                    ←
                </div>
                <div className="voting-container">
                    <h1>Loading...</h1>
                </div>
            </div>
        </div>
    );

    return (
        <div>
            <Navbar />
            <div className="voting-page">
                <div className="back-arrow" onClick={() => navigate(`/poll/${pollId}`)}>
                    ←
                </div>
                <div className="voting-container">
                    <h1 className="poll-title">{poll.title}</h1>
                    <p className="poll-description">{poll.description}</p>
                    
                    <div className="options-container">
                        {poll.options.map((option, index) => (
                            <div key={index} className="option-wrapper">
                                <input
                                    type="radio"
                                    id={`option-${index}`}
                                    name="poll-option"
                                    value={option}
                                    onChange={handleOptionChange}
                                    className="radio-button"
                                />
                                <label htmlFor={`option-${index}`} className="option-label">
                                    <span className="custom-radio"></span>
                                    <span className="option-text">{option}</span>
                                </label>
                            </div>
                        ))}
                    </div>

                    <button 
                        className={`submit-button ${selectedOption ? 'visible' : ''}`}
                        onClick={handleSubmit}
                        disabled={!selectedOption}
                    >
                        Submit Vote
                    </button>

                    {/* Comments Section */}
                    <div className="comments-section">
                        <h3>Share Your Thoughts</h3>
                        
                        {/* Comment Input */}
                        {currentUser ? (
                            <div className="comment-input-section">
                                <div className="user-avatar">
                                    <div className="avatar-circle">
                                        {(userProfile?.name || userProfile?.firstName || 'U').charAt(0).toUpperCase()}
                                    </div>
                                    <span className="user-name">
                                        {userProfile?.name || userProfile?.firstName || 'Current User'}
                                    </span>
                                </div>
                                <div className="comment-input-wrapper">
                                    <textarea
                                        className="comment-input"
                                        placeholder="What are your thoughts?"
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        rows={3}
                                    />
                                    <button 
                                        className="submit-comment-btn"
                                        onClick={handleCommentSubmit}
                                        disabled={!newComment.trim()}
                                    >
                                        SUBMIT COMMENT
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="login-prompt">
                                <p>Please login to share your thoughts on this poll.</p>
                            </div>
                        )}

                        {/* Comments Display */}
                        <div className="comments-display">
                            {commentsLoading ? (
                                <div className="loading-comments">Loading comments...</div>
                            ) : comments.length === 0 ? (
                                <div className="no-comments">
                                    <p>No comments yet. Be the first to share your thoughts!</p>
                                </div>
                            ) : (
                                comments.map((comment) => (
                                    <div key={comment.id} className="comment-card">
                                        <div className="comment-header">
                                            <div className="comment-user-info">
                                                <div className="comment-avatar">
                                                    {comment.userName.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="comment-user-details">
                                                    <span className="comment-user-name">{comment.userName}</span>
                                                    <span className="comment-timestamp">
                                                        {comment.createdAt?.toDate?.() ? 
                                                            comment.createdAt.toDate().toLocaleDateString() : 
                                                            new Date(comment.createdAt).toLocaleDateString()
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="comment-actions">
                                                <button 
                                                    className={`like-btn ${comment.likes?.includes(currentUser?.uid) ? 'liked' : ''}`}
                                                    onClick={() => handleLikeComment(comment.id, comment.likes || [])}
                                                    disabled={!currentUser}
                                                >
                                                    <span className="like-icon">♥</span>
                                                    <span className="like-count">{comment.likeCount || 0}</span>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="comment-text">
                                            {comment.text}
                                        </div>
                                        <div className="comment-tag" style={{
                                            backgroundColor: `${sentimentAnalyzer.getSentimentColor(comment.sentiment || 'neutral')}20`,
                                            borderColor: `${sentimentAnalyzer.getSentimentColor(comment.sentiment || 'neutral')}50`,
                                            color: sentimentAnalyzer.getSentimentColor(comment.sentiment || 'neutral')
                                        }}>
                                            {sentimentAnalyzer.getSentimentEmoji(comment.sentiment || 'neutral')} {(comment.sentiment || 'neutral').toUpperCase()}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        
                        {/* Simple Sentiment Summary */}
                        {comments.length > 0 && (
                            <div className="sentiment-summary">
                                <span className="sentiment-label">💭 Sentiment:</span>
                                <span className="sentiment-breakdown">
                                    😊 {Math.round((comments.filter(c => (c.sentiment || 'neutral') === 'positive').length / comments.length) * 100)}% • 
                                    😐 {Math.round((comments.filter(c => (c.sentiment || 'neutral') === 'neutral').length / comments.length) * 100)}% • 
                                    😞 {Math.round((comments.filter(c => (c.sentiment || 'neutral') === 'negative').length / comments.length) * 100)}%
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {showNotification && (
                    <div className="toast-notification">
                        Vote has been registered
                    </div>
                )}
            </div>
        </div>
    );
};

export default VotingPage;
