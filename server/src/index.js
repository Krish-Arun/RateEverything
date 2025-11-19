import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from parent directory (server folder)
dotenv.config({ path: join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Debug logging
console.log('Environment variables loaded:');
console.log('PORT:', process.env.PORT);
console.log('MONGODB_URI:', process.env.MONGODB_URI ? '✅ Found' : '❌ Not found');
console.log('NODE_ENV:', process.env.NODE_ENV);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// MongoDB Connection
const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ratemyanything';
    console.log(`🔌 Connecting to: ${uri}`);
    
    await mongoose.connect(uri);
    
    console.log('✅ MongoDB Connected Successfully');
    console.log(`📊 Database: ${mongoose.connection.name}`);
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  }
};

// ============================================================================
// JUDGEMENT ENGINE
// ============================================================================
const POSITIVE_WORDS = [
  'amazing', 'awesome', 'excellent', 'fantastic', 'great', 'love', 'perfect',
  'wonderful', 'brilliant', 'outstanding', 'superb', 'phenomenal', 'incredible',
  'good', 'nice', 'best', 'beautiful', 'delightful', 'enjoyable', 'pleased'
];

const NEGATIVE_WORDS = [
  'terrible', 'awful', 'horrible', 'bad', 'worst', 'hate', 'disgusting',
  'disappointing', 'poor', 'pathetic', 'useless', 'garbage', 'trash', 'crap',
  'sucks', 'boring', 'mediocre', 'waste', 'annoying', 'frustrating'
];

const EXAGGERATION_WORDS = [
  'literally', 'absolutely', 'completely', 'totally', 'extremely', 'incredibly',
  'ridiculously', 'insanely', 'super', 'mega', 'ultra', 'mad', 'crazy', 'epic'
];

const JUDGEMENTS = {
  hater: [
    "Certified Hater Badge Unlocked 🏆",
    "Someone woke up and chose violence today",
    "Professional critic or just miserable?",
    "This review radiates pure negativity"
  ],
  enjoyer: [
    "Peak Enjoyer Energy Detected ✨",
    "This person has never experienced disappointment",
    "Enthusiasm level: Maximum Overdrive",
    "Did the company pay you to write this?"
  ],
  contradictory: [
    "Your stars and words tell different stories 🤔",
    "Mixed signals detected. Make up your mind!",
    "This review is having an identity crisis"
  ],
  dramatic: [
    "Paragraph Warrior Achievement Unlocked 📜",
    "You wrote a whole essay. Respect.",
    "TL;DR please"
  ],
  emoji_lord: [
    "Emoji Bard Status: Achieved 🎭",
    "Words were clearly too difficult",
    "Your keyboard's emoji button is worn out"
  ],
  exaggerator: [
    "Exaggeration Level: Off The Charts",
    "Is everything really that extreme?",
    "Literally the most dramatic review literally ever"
  ],
  basic: [
    "Baseline Reviewer Energy",
    "This review is... a review",
    "Completely average. Well done?"
  ]
};

function analyzeReview(reviewText, starRating) {
  console.log(`🧠 Analyzing review...`);
  
  const text = reviewText.toLowerCase();
  const words = text.split(/\s+/);
  
  const positiveCount = POSITIVE_WORDS.filter(w => text.includes(w)).length;
  const negativeCount = NEGATIVE_WORDS.filter(w => text.includes(w)).length;
  const sentimentScore = positiveCount - negativeCount;
  
  const emojiCount = (reviewText.match(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]/gu) || []).length;
  const exaggerationCount = EXAGGERATION_WORDS.filter(w => text.includes(w)).length;
  
  const wordCount = words.length;
  const charCount = reviewText.length;
  
  const contradictionDetected = 
    (starRating >= 4 && sentimentScore < -1) || 
    (starRating <= 2 && sentimentScore > 1);
  
  let category = 'basic';
  if (contradictionDetected) category = 'contradictory';
  else if (emojiCount >= 5) category = 'emoji_lord';
  else if (wordCount > 100) category = 'dramatic';
  else if (exaggerationCount >= 3) category = 'exaggerator';
  else if (sentimentScore <= -3 || starRating <= 2) category = 'hater';
  else if (sentimentScore >= 3 || starRating >= 4) category = 'enjoyer';
  
  const judgementText = JUDGEMENTS[category][Math.floor(Math.random() * JUDGEMENTS[category].length)];
  
  const tags = [category.replace('_', ' ').toUpperCase()];
  if (emojiCount >= 3) tags.push('EMOJI OVERLOAD');
  if (exaggerationCount >= 2) tags.push('DRAMATIC');
  if (wordCount > 80) tags.push('ESSAY MODE');
  
  console.log(`✅ Judgement: ${judgementText}`);
  
  return {
    judgementText,
    judgementTags: tags.slice(0, 4),
    sentimentScore,
    contradictionDetected,
    stats: { wordCount, charCount, emojiCount, exaggerationCount }
  };
}

// ============================================================================
// MONGOOSE SCHEMA
// ============================================================================
const reviewSchema = new mongoose.Schema({
  username: { type: String, required: true },
  itemName: { type: String, required: true },
  starRating: { type: Number, required: true, min: 1, max: 5 },
  reviewText: { type: String, required: true },
  judgement: {
    judgementText: String,
    judgementTags: [String],
    sentimentScore: Number,
    contradictionDetected: Boolean,
    stats: {
      wordCount: Number,
      charCount: Number,
      emojiCount: Number,
      exaggerationCount: Number
    }
  },
  createdAt: { type: Date, default: Date.now }
});

const Review = mongoose.model('Review', reviewSchema);

// ============================================================================
// ROUTES
// ============================================================================

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// Create review
app.post('/api/items', async (req, res) => {
  try {
    console.log('📥 CREATE REVIEW REQUEST');
    console.log('Body:', req.body);
    
    const { username, itemName, starRating, reviewText } = req.body;
    
    if (!username || !itemName || !starRating || !reviewText) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const judgement = analyzeReview(reviewText, starRating);
    
    const review = new Review({
      username,
      itemName,
      starRating,
      reviewText,
      judgement
    });
    
    await review.save();
    console.log('✅ Review saved:', review._id);
    
    res.status(201).json({
      success: true,
      review,
      judgement
    });
    
  } catch (err) {
    console.error('❌ Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get all reviews
app.get('/api/items', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const reviews = await Review.find().sort({ createdAt: -1 }).limit(limit);
    
    res.json({
      success: true,
      count: reviews.length,
      reviews
    });
  } catch (err) {
    console.error('❌ Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get review by ID
app.get('/api/items/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.json({ success: true, review });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'RateMyAnything API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      createReview: 'POST /api/items',
      getReviews: 'GET /api/items',
      getReview: 'GET /api/items/:id'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
const startServer = async () => {
  await connectDB();
  
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌐 API: http://localhost:${PORT}`);
    console.log(`💚 Health: http://localhost:${PORT}/health`);
  });
};

startServer();