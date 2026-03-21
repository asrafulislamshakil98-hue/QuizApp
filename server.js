const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

// ১. CORS কনফিগারেশন (যাতে ফ্রন্টএন্ড থেকে রিকোয়েস্ট ব্লক না হয়)
app.use(cors());
app.use(express.json());

// ২. হোম রুট (সার্ভার চেক করার জন্য)
app.get('/', (req, res) => {
    res.send("<h1>কুইজ অ্যাপের ব্যাকএন্ড সার্ভার সফলভাবে চলছে!</h1>");
});

// ৩. MongoDB কানেকশন
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/quiz_db";

mongoose.connect(mongoURI)
    .then(() => console.log("✅ MongoDB Connected Successfully"))
    .catch(err => {
        console.error("❌ MongoDB Connection Error:", err.message);
    });

// ৪. প্রশ্ন মডেল (Schema)
const QuestionSchema = new mongoose.Schema({
    category: { type: String, required: true },
    question: { type: String, required: true },
    options: { type: [String], required: true },
    correctAnswer: { type: Number, required: true }
});

const Question = mongoose.model('Question', QuestionSchema);

// ৫. ক্যাটাগরি অনুযায়ী প্রশ্ন পাওয়ার এপিআই
app.get('/api/questions/:category', async (req, res) => {
    try {
        const categoryName = req.params.category;
        console.log(`Request received for category: ${categoryName}`); // ডিবাগিংয়ের জন্য

        // ডাটাবেস থেকে প্রশ্ন খোঁজা
        const questions = await Question.find({ category: categoryName }).limit(200);
        
        if (questions.length === 0) {
            return res.status(404).json({ message: "এই ক্যাটাগরিতে কোনো প্রশ্ন পাওয়া যায়নি।" });
        }
        
        res.json(questions);
    } catch (err) {
        console.error("API Error:", err);
        res.status(500).json({ error: "সার্ভারে সমস্যা হয়েছে।" });
    }
});

// ৬. পোর্ট সেটআপ (Render-এর জন্য process.env.PORT খুব জরুরি)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});