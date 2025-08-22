import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import sentimentAnalyzer from '../services/sentimentAnalysis';
import './SentimentAnalytics.css';

const SentimentAnalytics = ({ pollId, showInline = false }) => {
    const [sentimentData, setSentimentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState([]);

    useEffect(() => {
        if (pollId) {
            fetchAndAnalyzeComments();
        }
    }, [pollId]);

    const fetchAndAnalyzeComments = async () => {
        try {
            setLoading(true);
            const commentsRef = collection(db, 'polls', pollId, 'comments');
            const commentsQuery = query(commentsRef, orderBy('createdAt', 'desc'));
            const commentsSnapshot = await getDocs(commentsQuery);
            
            const commentsData = [];
            commentsSnapshot.forEach(doc => {
                const data = doc.data();
                commentsData.push({
                    id: doc.id,
                    text: data.text,
                    sentiment: data.sentiment,
                    sentimentScore: data.sentimentScore,
                    sentimentMagnitude: data.sentimentMagnitude,
                    sentimentConfidence: data.sentimentConfidence,
                    createdAt: data.createdAt,
                    userName: data.userName
                });
            });

            setComments(commentsData);

            // Analyze sentiment distribution
            const analysis = sentimentAnalyzer.analyzeComments(commentsData.map(c => c.text));
            setSentimentData(analysis);
        } catch (error) {
            console.error('Error fetching and analyzing comments:', error);
        } finally {
            setLoading(false);
        }
    };

    const getSentimentPercentage = (sentiment) => {
        if (!sentimentData || sentimentData.totalComments === 0) return 0;
        return Math.round((sentimentData.sentimentDistribution[sentiment] / sentimentData.totalComments) * 100);
    };

    const getOverallSentiment = () => {
        if (!sentimentData) return 'neutral';
        const { positive, negative, neutral } = sentimentData.sentimentDistribution;
        
        if (positive > negative && positive > neutral) return 'positive';
        if (negative > positive && negative > neutral) return 'negative';
        return 'neutral';
    };

    const getOverallSentimentColor = () => {
        return sentimentAnalyzer.getSentimentColor(getOverallSentiment());
    };

    if (loading) {
        return (
            <div className={`sentiment-analytics ${showInline ? 'inline' : ''}`}>
                <div className="analytics-loading">Analyzing sentiment...</div>
            </div>
        );
    }

    if (!sentimentData || sentimentData.totalComments === 0) {
        return (
            <div className={`sentiment-analytics ${showInline ? 'inline' : ''}`}>
                <div className="no-sentiment-data">
                    <p>No comments available for sentiment analysis</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`sentiment-analytics ${showInline ? 'inline' : ''}`}>
            <div className="analytics-header">
                <h3>💭 Sentiment Analysis</h3>
                <div className="total-comments">
                    {sentimentData.totalComments} comment{sentimentData.totalComments !== 1 ? 's' : ''} analyzed
                </div>
            </div>

            {/* Overall Sentiment Indicator */}
            <div className="overall-sentiment" style={{ borderColor: getOverallSentimentColor() }}>
                <div className="overall-indicator">
                    <span className="overall-emoji">
                        {sentimentAnalyzer.getSentimentEmoji(getOverallSentiment())}
                    </span>
                    <div className="overall-text">
                        <span className="overall-label">Overall Sentiment</span>
                        <span className="overall-value" style={{ color: getOverallSentimentColor() }}>
                            {getOverallSentiment().toUpperCase()}
                        </span>
                    </div>
                </div>
                <div className="sentiment-score">
                    Score: {sentimentData.averageScore > 0 ? '+' : ''}{sentimentData.averageScore}
                </div>
            </div>

            {/* Sentiment Distribution */}
            <div className="sentiment-distribution">
                <h4>Sentiment Breakdown</h4>
                
                {/* Positive */}
                <div className="sentiment-bar">
                    <div className="sentiment-info">
                        <span className="sentiment-label">
                            😊 Positive
                        </span>
                        <span className="sentiment-percentage">
                            {getSentimentPercentage('positive')}%
                        </span>
                    </div>
                    <div className="progress-bar">
                        <div 
                            className="progress-fill positive"
                            style={{ 
                                width: `${getSentimentPercentage('positive')}%`,
                                backgroundColor: sentimentAnalyzer.getSentimentColor('positive')
                            }}
                        ></div>
                    </div>
                    <span className="sentiment-count">
                        {sentimentData.sentimentDistribution.positive} comments
                    </span>
                </div>

                {/* Neutral */}
                <div className="sentiment-bar">
                    <div className="sentiment-info">
                        <span className="sentiment-label">
                            😐 Neutral
                        </span>
                        <span className="sentiment-percentage">
                            {getSentimentPercentage('neutral')}%
                        </span>
                    </div>
                    <div className="progress-bar">
                        <div 
                            className="progress-fill neutral"
                            style={{ 
                                width: `${getSentimentPercentage('neutral')}%`,
                                backgroundColor: sentimentAnalyzer.getSentimentColor('neutral')
                            }}
                        ></div>
                    </div>
                    <span className="sentiment-count">
                        {sentimentData.sentimentDistribution.neutral} comments
                    </span>
                </div>

                {/* Negative */}
                <div className="sentiment-bar">
                    <div className="sentiment-info">
                        <span className="sentiment-label">
                            😞 Negative
                        </span>
                        <span className="sentiment-percentage">
                            {getSentimentPercentage('negative')}%
                        </span>
                    </div>
                    <div className="progress-bar">
                        <div 
                            className="progress-fill negative"
                            style={{ 
                                width: `${getSentimentPercentage('negative')}%`,
                                backgroundColor: sentimentAnalyzer.getSentimentColor('negative')
                            }}
                        ></div>
                    </div>
                    <span className="sentiment-count">
                        {sentimentData.sentimentDistribution.negative} comments
                    </span>
                </div>
            </div>

            {/* Sentiment Insights */}
            <div className="sentiment-insights">
                <h4>📊 Key Insights</h4>
                <div className="insights-grid">
                    <div className="insight-card">
                        <div className="insight-label">Engagement Level</div>
                        <div className="insight-value">
                            {sentimentData.averageMagnitude > 0.3 ? 'High' : 
                             sentimentData.averageMagnitude > 0.15 ? 'Medium' : 'Low'}
                        </div>
                    </div>
                    <div className="insight-card">
                        <div className="insight-label">Dominant Emotion</div>
                        <div className="insight-value">
                            {Object.entries(sentimentData.sentimentDistribution)
                                .sort(([,a], [,b]) => b - a)[0][0].charAt(0).toUpperCase() + 
                             Object.entries(sentimentData.sentimentDistribution)
                                .sort(([,a], [,b]) => b - a)[0][0].slice(1)}
                        </div>
                    </div>
                    <div className="insight-card">
                        <div className="insight-label">Polarization</div>
                        <div className="insight-value">
                            {(sentimentData.sentimentDistribution.positive + sentimentData.sentimentDistribution.negative) > 
                             sentimentData.sentimentDistribution.neutral ? 'High' : 'Low'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Comments by Sentiment */}
            {!showInline && (
                <div className="recent-comments-by-sentiment">
                    <h4>Recent Comments by Sentiment</h4>
                    {['positive', 'negative', 'neutral'].map(sentiment => {
                        const sentimentComments = comments.filter(c => (c.sentiment || 'neutral') === sentiment).slice(0, 2);
                        if (sentimentComments.length === 0) return null;
                        
                        return (
                            <div key={sentiment} className="sentiment-comments-group">
                                <h5 style={{ color: sentimentAnalyzer.getSentimentColor(sentiment) }}>
                                    {sentimentAnalyzer.getSentimentEmoji(sentiment)} {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)} Comments
                                </h5>
                                {sentimentComments.map(comment => (
                                    <div key={comment.id} className="mini-comment">
                                        <div className="mini-comment-author">{comment.userName}</div>
                                        <div className="mini-comment-text">"{comment.text}"</div>
                                        <div className="mini-comment-score">
                                            Score: {comment.sentimentScore || 'N/A'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default SentimentAnalytics;
