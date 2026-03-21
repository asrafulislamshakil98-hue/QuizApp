let coins = localStorage.getItem('coins') ? parseInt(localStorage.getItem('coins')) : 0;
document.getElementById('coins').innerText = coins;

const categories = ["সাধারণ জ্ঞান", "বিজ্ঞান", "ইতিহাস", "ভূগোল", "খেলাধুলা", "গণিত", "ধর্ম", "সাহিত্য", "চলচ্চিত্র", "কম্পিউটার", "রাজনীতি", "দেশ-বিদেশ", "আবিষ্কার", "মহাকাশ", "প্রাণীজগৎ", "উদ্ভিদ", "স্বাস্থ্য", "সংস্কৃতি", "অর্থনীতি", "পরিবেশ"];

// ২০টি ক্যাটাগরি তৈরি
const catList = document.getElementById('category-list');
categories.forEach(cat => {
    let btn = document.createElement('button');
    btn.className = 'cat-btn';
    btn.innerText = cat;
    btn.onclick = () => loadQuestions(cat);
    catList.appendChild(btn);
});

// ২০০টি প্রশ্নের লিস্ট লোড করা
async function loadQuestions(catName) {
    try {
        const response = await fetch(`https://quizapp-k8gb.onrender.com/api/questions/${category}`);
        const questions = await response.json();

        document.getElementById('cat-title').innerText = catName;
        const qContainer = document.getElementById('question-links');
        qContainer.innerHTML = '';

        if(questions.length === 0) {
            qContainer.innerHTML = "<p>কোনো প্রশ্ন পাওয়া যায়নি। আগে ডাটাবেসে প্রশ্ন যোগ করুন।</p>";
        }

        questions.forEach((q, index) => {
            let div = document.createElement('div');
            div.className = 'q-link';
            div.innerText = `${index + 1}. ${q.question}`;
            div.onclick = () => openQuiz(q);
            qContainer.appendChild(div);
        });

        document.getElementById('category-screen').style.display = 'none';
        document.getElementById('question-list-screen').style.display = 'block';
    } catch (err) {
        alert("সার্ভার কানেক্ট হচ্ছে না!");
    }
}

// কুইজ পপআপ ওপেন করা
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

// উত্তর চেক করা
function checkAnswer(selected, correct, btn) {
    const btns = document.querySelectorAll('.opt-btn');
    btns.forEach(b => b.disabled = true); // বাটন লক করা

    if (selected === correct) {
        btn.classList.add('correct');
        document.getElementById('feedback').innerText = "সঠিক! +১০ কয়েন";
        updateCoins(10);
    } else {
        btn.classList.add('wrong');
        btns[correct].classList.add('correct');
        document.getElementById('feedback').innerText = "ভুল! -৫ কয়েন";
        updateCoins(-5);
    }
}

function updateCoins(amount) {
    coins += amount;
    if (coins < 0) coins = 0;
    localStorage.setItem('coins', coins);
    document.getElementById('coins').innerText = coins;
}

function showCategories() {
    document.getElementById('category-screen').style.display = 'block';
    document.getElementById('question-list-screen').style.display = 'none';
}

function closeQuiz() {
    document.getElementById('quiz-modal').style.display = 'none';
}