const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Question = require('./models/Question');
const fs = require('fs');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
.then(async () => {
    console.log("MongoDB Connected for Seeding...");

    // JSON ফাইল থেকে ডাটা পড়া
    const data = JSON.parse(fs.readFileSync('./questions.json', 'utf-8'));

    // আগে যদি কোনো প্রশ্ন থাকে তা মুছে ফেলা (ঐচ্ছিক)
    await Question.deleteMany();

    // সব ডাটা একবারে ইনসার্ট করা
    await Question.insertMany(data);

    console.log("✅ ৪০০০ প্রশ্ন সফলভাবে যোগ হয়েছে!");
    process.exit();
})
.catch(err => {
    console.error(err);
    process.exit(1);
});