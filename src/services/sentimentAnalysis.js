// Sentiment Analysis Service using JavaScript NLP
// This service analyzes text sentiment and returns positive/neutral/negative classification

class SentimentAnalyzer {
  constructor() {
    // Positive words dictionary
    this.positiveWords = [
      'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'awesome', 'love', 'like', 
      'best', 'perfect', 'brilliant', 'outstanding', 'superb', 'magnificent', 'marvelous', 'terrific',
      'fabulous', 'incredible', 'spectacular', 'phenomenal', 'remarkable', 'exceptional', 'impressive',
      'delightful', 'pleasant', 'enjoyable', 'satisfying', 'happy', 'glad', 'pleased', 'excited',
      'thrilled', 'grateful', 'appreciate', 'support', 'agree', 'yes', 'positive', 'optimistic',
      'hopeful', 'confident', 'successful', 'effective', 'efficient', 'helpful', 'useful', 'valuable',
      'beneficial', 'advantageous', 'favorable', 'promising', 'encouraging', 'inspiring', 'motivating'
    ];

    // Negative words dictionary
    this.negativeWords = [
      'bad', 'terrible', 'awful', 'horrible', 'disgusting', 'hate', 'dislike', 'worst', 'pathetic',
      'disappointing', 'frustrating', 'annoying', 'irritating', 'stupid', 'dumb', 'ridiculous',
      'nonsense', 'garbage', 'trash', 'useless', 'worthless', 'pointless', 'meaningless', 'boring',
      'dull', 'bland', 'mediocre', 'poor', 'inferior', 'subpar', 'inadequate', 'insufficient',
      'unacceptable', 'unsatisfactory', 'disappointing', 'regrettable', 'unfortunate', 'sad', 'angry',
      'mad', 'furious', 'upset', 'disturbed', 'worried', 'concerned', 'anxious', 'stressed', 'depressed',
      'disagree', 'no', 'never', 'nothing', 'nobody', 'nowhere', 'negative', 'pessimistic', 'hopeless',
      'failed', 'failure', 'unsuccessful', 'ineffective', 'inefficient', 'harmful', 'damaging', 'destructive'
    ];

    // Intensifiers that amplify sentiment
    this.intensifiers = [
      'very', 'extremely', 'incredibly', 'absolutely', 'completely', 'totally', 'really', 'quite',
      'rather', 'pretty', 'fairly', 'somewhat', 'highly', 'deeply', 'strongly', 'seriously'
    ];

    // Negation words that flip sentiment
    this.negationWords = [
      'not', 'no', 'never', 'nothing', 'nobody', 'nowhere', 'neither', 'nor', 'none', 'cannot',
      'cant', 'couldn\'t', 'shouldn\'t', 'wouldn\'t', 'don\'t', 'doesn\'t', 'didn\'t', 'isn\'t',
      'aren\'t', 'wasn\'t', 'weren\'t', 'haven\'t', 'hasn\'t', 'hadn\'t', 'won\'t', 'wont'
    ];
  }

  // Clean and tokenize text
  preprocessText(text) {
    if (!text || typeof text !== 'string') return [];
    
    return text
      .toLowerCase()
      .replace(/[^\w\s']/g, ' ') // Remove punctuation except apostrophes
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim()
      .split(' ')
      .filter(word => word.length > 0);
  }

  // Calculate sentiment score for a piece of text
  calculateSentiment(text) {
    const words = this.preprocessText(text);
    if (words.length === 0) return { score: 0, magnitude: 0 };

    let score = 0;
    let magnitude = 0;
    let negationFlag = false;
    let intensifierMultiplier = 1;

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      
      // Check for negation words
      if (this.negationWords.includes(word)) {
        negationFlag = true;
        continue;
      }

      // Check for intensifiers
      if (this.intensifiers.includes(word)) {
        intensifierMultiplier = 1.5;
        continue;
      }

      // Calculate word sentiment
      let wordScore = 0;
      if (this.positiveWords.includes(word)) {
        wordScore = 1;
      } else if (this.negativeWords.includes(word)) {
        wordScore = -1;
      }

      // Apply modifiers
      if (wordScore !== 0) {
        wordScore *= intensifierMultiplier;
        if (negationFlag) {
          wordScore *= -1;
        }
        score += wordScore;
        magnitude += Math.abs(wordScore);
      }

      // Reset modifiers after applying to a sentiment word
      if (wordScore !== 0) {
        negationFlag = false;
        intensifierMultiplier = 1;
      }
    }

    // Normalize score by text length
    const normalizedScore = words.length > 0 ? score / words.length : 0;
    const normalizedMagnitude = words.length > 0 ? magnitude / words.length : 0;

    return {
      score: normalizedScore,
      magnitude: normalizedMagnitude
    };
  }

  // Classify sentiment based on score
  classifySentiment(text) {
    const { score, magnitude } = this.calculateSentiment(text);
    
    // If magnitude is very low, it's likely neutral regardless of score
    if (magnitude < 0.1) {
      return {
        sentiment: 'neutral',
        score: score,
        magnitude: magnitude,
        confidence: 'low'
      };
    }

    let sentiment;
    let confidence;

    // Determine sentiment based on score thresholds
    if (score > 0.1) {
      sentiment = 'positive';
      confidence = magnitude > 0.3 ? 'high' : 'medium';
    } else if (score < -0.1) {
      sentiment = 'negative';
      confidence = magnitude > 0.3 ? 'high' : 'medium';
    } else {
      sentiment = 'neutral';
      confidence = 'medium';
    }

    return {
      sentiment,
      score: Math.round(score * 1000) / 1000, // Round to 3 decimal places
      magnitude: Math.round(magnitude * 1000) / 1000,
      confidence
    };
  }

  // Analyze multiple comments and return aggregated results
  analyzeComments(comments) {
    if (!Array.isArray(comments) || comments.length === 0) {
      return {
        totalComments: 0,
        sentimentDistribution: { positive: 0, neutral: 0, negative: 0 },
        averageScore: 0,
        averageMagnitude: 0
      };
    }

    const results = comments.map(comment => {
      const text = typeof comment === 'string' ? comment : comment.text || '';
      return this.classifySentiment(text);
    });

    const distribution = results.reduce((acc, result) => {
      acc[result.sentiment]++;
      return acc;
    }, { positive: 0, neutral: 0, negative: 0 });

    const totalScore = results.reduce((sum, result) => sum + result.score, 0);
    const totalMagnitude = results.reduce((sum, result) => sum + result.magnitude, 0);

    return {
      totalComments: comments.length,
      sentimentDistribution: distribution,
      averageScore: Math.round((totalScore / comments.length) * 1000) / 1000,
      averageMagnitude: Math.round((totalMagnitude / comments.length) * 1000) / 1000,
      individualResults: results
    };
  }

  // Get sentiment color for UI display
  getSentimentColor(sentiment) {
    const colors = {
      positive: '#4CAF50', // Green
      neutral: '#FFC107',  // Amber
      negative: '#F44336'  // Red
    };
    return colors[sentiment] || colors.neutral;
  }

  // Get sentiment emoji for UI display
  getSentimentEmoji(sentiment) {
    const emojis = {
      positive: '😊',
      neutral: '😐',
      negative: '😞'
    };
    return emojis[sentiment] || emojis.neutral;
  }
}

// Export singleton instance
export const sentimentAnalyzer = new SentimentAnalyzer();
export default sentimentAnalyzer;
