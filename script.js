let coins = localStorage.getItem('coins') ? parseInt(localStorage.getItem('coins')) : 0;
document.getElementById('coins').innerText = coins;

const categories = ["সাধারণ জ্ঞান", "বিজ্ঞান", "ইতিহাস", "ভূগোল", "খেলাধুলা", "গণিত", "ধর্ম", "সাহিত্য", "চলচ্চিত্র", "কম্পিউটার", "রাজনীতি", "দেশ-বিদেশ", "আবিষ্কার", "মহাকাশ", "প্রাণীজগৎ", "উদ্ভিদ", "স্বাস্থ্য", "সংস্কৃতি", "অর্থনীতি", "পরিবেশ"];

// ১. ২০টি ক্যাটাগরি বাটন তৈরি
const catList = document.getElementById('category-list');
categories.forEach(cat => {
    let btn = document.createElement('button');
    btn.className = 'cat-btn';
    btn.innerText = cat;
    btn.onclick = () => loadQuestions(cat);
    catList.appendChild(btn);
});

// ২. ডাটাবেস থেকে প্রশ্ন লোড করা
async function loadQuestions(catName) {
    try {
        // এখানে আগে ${category} ছিল, আমি তা ঠিক করে ${catName} করে দিয়েছি
        const response = await fetch(`https://quizapp-k8gb.onrender.com/api/questions/${catName}`);
        const questions = await response.json();

        document.getElementById('cat-title').innerText = catName;
        const qContainer = document.getElementById('question-links');
        qContainer.innerHTML = '';

        if (!questions || questions.length === 0) {
            qContainer.innerHTML = "<p style='color:red;'>কোনো প্রশ্ন পাওয়া যায়নি। ডাটাবেসে প্রশ্ন চেক করুন।</p>";
        } else {
            questions.forEach((q, index) => {
                let div = document.createElement('div');
                div.className = 'q-link';
                div.innerText = `${index + 1}. ${q.question}`;
                div.onclick = () => openQuiz(q);
                qContainer.appendChild(div);
            });
        }

        document.getElementById('category-screen').style.display = 'none';
        document.getElementById('question-list-screen').style.display = 'block';
    } catch (err) {
        console.error(err);
        alert("সার্ভার কানেক্ট হচ্ছে না! আপনার ইন্টারনেট চেক করুন।");
    }
}

// ৩. কুইজ পপআপ (Modal) ওপেন করা
function openQuiz(q) {
    document.getElementById('modal-q-text').innerText = q.question;
    const optBox = document.getElementById('options-box');
    optBox.innerHTML = '';
    document.getElementById('feedback').innerText = '';

    q.options.forEach((opt, index) => {
        let btn = document.createElement('button');
        btn.className = 'opt-btn';
        btn.innerText = opt;
        btn.onclick = () => checkAnswer(index, q.correctAnswer, btn);
        optBox.appendChild(btn);
    });

    document.getElementById('quiz-modal').style.display = 'flex';
}

// ৪. উত্তর যাচাই করা এবং কয়েন আপডেট
function checkAnswer(selected, correct, btn) {
    const btns = document.querySelectorAll('.opt-btn');
    btns.forEach(b => b.disabled = true); // একবার ক্লিক করলে সব বাটন লক

    const feedbackText = document.getElementById('feedback');

    if (selected === correct) {
        btn.classList.add('correct');
        feedbackText.innerText = "✅ সঠিক উত্তর! আপনি ১০ কয়েন পেয়েছেন।";
        feedbackText.style.color = "green";
        updateCoins(10);
    } else {
        btn.classList.add('wrong');
        btns[correct].classList.add('correct'); // সঠিক উত্তরটিও লাল দেখাবে
        feedbackText.innerText = "❌ ভুল উত্তর! ৫ কয়েন কাটা হয়েছে।";
        feedbackText.style.color = "red";
        updateCoins(-5);
    }
}

// ৫. কয়েন ম্যানেজমেন্ট
function updateCoins(amount) {
    coins += amount;
    if (coins < 0) coins = 0; // কয়েন যাতে মাইনাস না হয়
    localStorage.setItem('coins', coins);
    document.getElementById('coins').innerText = coins;
}

// ৬. স্ক্রিন নেভিগেশন ফাংশন
function showCategories() {
    document.getElementById('category-screen').style.display = 'block';
    document.getElementById('question-list-screen').style.display = 'none';
}

function closeQuiz() {
    document.getElementById('quiz-modal').style.display = 'none';
}