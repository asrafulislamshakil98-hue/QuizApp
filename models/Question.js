const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    category: String,
    question: String,
    options: [String], // ক, খ, গ, ঘ
    correctAnswer: Number, // ০ থেকে ৩ এর মধ্যে ইনডেক্স
});

module.exports = mongoose.model('Question', QuestionSchema);