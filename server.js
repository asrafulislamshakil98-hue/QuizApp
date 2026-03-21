const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// MongoDB কানেকশন
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/quiz_db")
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.log(err));

// প্রশ্ন মডেল
const Question = mongoose.model('Question', new mongoose.Schema({
    category: String,
    question: String,
    options: [String],
    correctAnswer: Number
}));

// ক্যাটাগরি অনুযায়ী প্রশ্ন পাওয়ার এপিআই
app.get('/api/questions/:category', async (req, res) => {
    try {
        const questions = await Question.find({ category: req.params.category }).limit(200);
        res.json(questions);
    } catch (err) {
        res.status(500).json(err);
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));