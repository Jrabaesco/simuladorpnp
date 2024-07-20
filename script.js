let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let userAnswers = [];
let selectedQuestions = [];
let timer;

async function loadQuestions() {
    const response = await fetch('questions.json');
    const data = await response.json();
    return data;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function showExamOptions() {
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('exam-options').style.display = 'block';
}

function startExam(numQuestions) {
    document.getElementById('exam-options').style.display = 'none';
    document.getElementById('exam-container').style.display = 'block';

    loadQuestions().then(data => {
        questions = data;
        selectedQuestions = selectQuestions(numQuestions);
        resetTimer();
        startTimer();
        displayQuestion();
    });
}

function selectQuestions(numQuestions) {
    const selected = [];
    const themes = [...questions];

    const questionDistribution = {
        20: [1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1],
        50: [4, 2, 4, 5, 2, 2, 4, 2, 6, 6, 1, 2, 2, 2, 3, 1, 1, 1],
        100: [8, 4, 7, 9, 5, 4, 9, 5, 12, 12, 2, 4, 3, 4, 6, 2, 2, 2]
    };

    const distribution = questionDistribution[numQuestions];

    for (let i = 0; i < themes.length; i++) {
        const themeQuestions = themes[i].questions.filter(q => !q.usada);
        const numThemeQuestions = distribution[i];

        for (let j = 0; j < numThemeQuestions && themeQuestions.length > 0; j++) {
            const question = themeQuestions.splice(Math.floor(Math.random() * themeQuestions.length), 1)[0];
            question.usada = true;
            selected.push({ ...question, theme: themes[i].title });
        }
    }

    return selected.slice(0, numQuestions);
}

function displayQuestion() {
    const questionContainer = document.getElementById('question-container');
    questionContainer.innerHTML = '';

    const questionData = selectedQuestions[currentQuestionIndex];
    const themeTitle = document.createElement('div');
    themeTitle.classList.add('theme-title');
    themeTitle.textContent = questionData.theme;

    const questionTitle = document.createElement('div');
    questionTitle.classList.add('question-title');
    questionTitle.textContent = `Pregunta ${currentQuestionIndex + 1}: ${questionData.question}`;

    questionContainer.appendChild(themeTitle);
    questionContainer.appendChild(questionTitle);

    questionData.options.forEach((option, index) => {
        const optionButton = document.createElement('button');
        optionButton.textContent = option.text;
        optionButton.classList.add('option-button');
        optionButton.classList.toggle('selected', userAnswers[currentQuestionIndex] === index);
        optionButton.onclick = () => selectAnswer(index);
        questionContainer.appendChild(optionButton);
    });
}

function selectAnswer(optionIndex) {
    userAnswers[currentQuestionIndex] = optionIndex;
    displayQuestion();
}

function prevQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
    }
}

function nextQuestion() {
    if (currentQuestionIndex < selectedQuestions.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
    }
}

function finishExam() {
    clearInterval(timer);
    const elapsedTime = document.getElementById('timer').textContent;
    document.getElementById('exam-container').style.display = 'none';
    document.getElementById('result-container').style.display = 'block';
    
    const resultContainer = document.getElementById('review-questions');
    resultContainer.innerHTML = '';

    score = 0;

    selectedQuestions.forEach((question, index) => {
        const questionResult = document.createElement('div');
        questionResult.classList.add('question-result');
        questionResult.innerHTML = `<h4 class="theme-title">${question.theme}</h4><h4 class="question-title">${question.question}</h4>`;
        
        question.options.forEach((option, optionIndex) => {
            const optionText = document.createElement('p');
            optionText.textContent = option.text;
            optionText.classList.add('option-button');
            if (option.correct) optionText.classList.add('correct');
            if (userAnswers[index] === optionIndex && !option.correct) optionText.classList.add('incorrect');
            if (userAnswers[index] === optionIndex && option.correct) score++;
            if (userAnswers[index] === optionIndex) optionText.classList.add('selected-answer');
            questionResult.appendChild(optionText);
        });

        const separator = document.createElement('hr');
        questionResult.appendChild(separator);
        resultContainer.appendChild(questionResult);
    });

    document.getElementById('score').innerHTML = `Preguntas Correctas: ${score} / ${selectedQuestions.length}<br>Tiempo Total: ${elapsedTime}`;
}

function backToMainMenu() {
    clearInterval(timer);
    document.getElementById('exam-container').style.display = 'none';
    document.getElementById('result-container').style.display = 'none';
    document.getElementById('exam-options').style.display = 'none';
    document.getElementById('main-menu').style.display = 'block';
    currentQuestionIndex = 0;
    userAnswers = [];
    questions.forEach(theme => theme.questions.forEach(q => q.usada = false));
}

function resetTimer() {
    clearInterval(timer);
    document.getElementById('timer').textContent = 'Tiempo: 0:00:00';
}

function startTimer() {
    const startTime = Date.now();
    const timerElement = document.getElementById('timer');

    timer = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        const hours = Math.floor(elapsedTime / (1000 * 60 * 60));
        const minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);
        
        timerElement.textContent = `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }, 1000);
}

// Event listeners for navigation buttons
document.querySelector('.prev-button').addEventListener('click', prevQuestion);
document.querySelector('.next-button').addEventListener('click', nextQuestion);
document.querySelector('.finish-button').addEventListener('click', finishExam);
document.querySelector('.back-button').addEventListener('click', backToMainMenu);
