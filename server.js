const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

// ১. মিডলওয়্যার
app.use(cors());
app.use(express.json());

// ২. হোম রুট (সার্ভার চেক করার জন্য)
app.get('/', (req, res) => {
    res.send("<h1>কুইজ অ্যাপের ব্যাকএন্ড সার্ভার সফলভাবে চলছে!</h1>");
});

// ৩. MongoDB কানেকশন
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/quiz_db";
mongoose.connect(mongoURI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.error("❌ MongoDB Error:", err));

// ৪. প্রশ্ন মডেল (Schema)
const Question = mongoose.model('Question', new mongoose.Schema({
    category: String,
    question: String,
    options: [String],
    correctAnswer: Number
}));

// ৫. ক্যাটাগরি অনুযায়ী প্রশ্ন পাওয়ার আসল রুট
app.get('/api/questions/:category', async (req, res) => {
    try {
        const categoryName = req.params.category;
        console.log("Searching for category:", categoryName);

        // ডাটাবেস থেকে প্রশ্ন খোঁজা
        const questions = await Question.find({ category: categoryName });

        if (questions.length === 0) {
            return res.status(404).json({ message: "এই ক্যাটাগরিতে কোনো প্রশ্ন পাওয়া যায়নি।" });
        }

        res.json(questions);
    } catch (err) {
        res.status(500).json({ error: "সার্ভারে সমস্যা হয়েছে।" });
    }
});

// ৬. পোর্ট সেটিংস
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});