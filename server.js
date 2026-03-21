const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// ১. Static folder (public) কানেক্ট করা
app.use(express.static(path.join(__dirname, 'public')));

// ২. MongoDB কানেকশন
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/quiz_db";
mongoose.connect(mongoURI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.error("❌ MongoDB Error:", err));

// ৩. প্রশ্ন মডেল
const Question = mongoose.model('Question', new mongoose.Schema({
    category: String,
    question: String,
    options: [String],
    correctAnswer: Number
}));

// ৪. এপিআই রুট (এটি ঠিক আছে)
app.get('/api/questions/:category', async (req, res) => {
    try {
        const questions = await Question.find({ category: req.params.category });
        res.json(questions);
    } catch (err) {
        res.status(500).json({ error: "সার্ভার এরর" });
    }
});

// ৫. এরর ফিক্স: Express 5 এর জন্য নতুন নিয়ম (৪২ নম্বর লাইন)
// এখানে শুধু '*' এর বদলে '/:path*' ব্যবহার করা হয়েছে
app.get('/:path*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ৬. সার্ভার পোর্ট
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});