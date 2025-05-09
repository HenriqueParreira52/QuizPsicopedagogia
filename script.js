const questions = [
    {
        question: "Qual a importância da psicopedagogia no desenvolvimento infantil?",
        options: [
            "Ajudar na aprendizagem e no desenvolvimento emocional.",
            "Promover o comportamento agressivo.",
            "Focar apenas no desenvolvimento cognitivo.",
            "Não tem importância."
        ],
        answer: "Ajudar na aprendizagem e no desenvolvimento emocional."
    },
    {
        question: "O que é avaliação psicopedagógica?",
        options: [
            "Uma forma de medir apenas a inteligência.",
            "Uma ferramenta para entender o processo de aprendizagem.",
            "Um exame médico.",
            "Avaliar apenas o comportamento."
        ],
        answer: "Uma ferramenta para entender o processo de aprendizagem."
    },
    {
        question: "Qual abordagem a psicopedagogia utiliza?",
        options: [
            "Abordagem comportamental.",
            "Abordagem apenas psicoterapêutica.",
            "Intervenções voltadas para o processo de aprendizagem.",
            "Nenhuma das alternativas."
        ],
        answer: "Intervenções voltadas para o processo de aprendizagem."
    }
];

let currentQuestionIndex = 0;
let score = 0;
let quizCompleted = false;
let timer = 30;
let timerInterval;
let isAdmin = false;
let leaderboard = [];

// Elementos do DOM
const questionElement = document.getElementById('question');
const optionsContainer = document.querySelector('.options');
const nextButton = document.getElementById('next-button');
const resultContainer = document.getElementById('result');
const scoreElement = document.getElementById('score');
const timerBar = document.getElementById('timer-bar');
const loginContainer = document.getElementById('login-container');
const quizContainer = document.getElementById('quiz-container');
const adminContainer = document.getElementById('admin-container');
const leaderboardElement = document.getElementById('leaderboard');
const errorMessage = document.getElementById('error-message');

// Função para iniciar o login
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === "admin" && password === "admin123") {
        isAdmin = true;
        loginContainer.style.display = 'none';
        adminContainer.style.display = 'block';
        loadLeaderboard();
    } else if (username && password) {
        loginContainer.style.display = 'none';
        quizContainer.style.display = 'block';
        startQuiz();
    } else {
        errorMessage.textContent = "Usuário ou senha inválidos.";
    }
}

// Função para iniciar o quiz
function startQuiz() {
    showQuestion();
    startTimer();
}

// Função para mostrar a pergunta atual
function showQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    questionElement.textContent = currentQuestion.question;
    optionsContainer.innerHTML = '';
    currentQuestion.options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.onclick = () => handleOptionSelect(option);
        optionsContainer.appendChild(button);
    });
    nextButton.disabled = true;
}

// Função para selecionar uma opção
function handleOptionSelect(option) {
    const currentQuestion = questions[currentQuestionIndex];
    const buttons = optionsContainer.querySelectorAll('button');
    buttons.forEach(button => {
        if (button.textContent === option) {
            button.classList.add('selected');
        } else {
            button.classList.remove('selected');
        }
    });

    if (option === currentQuestion.answer) {
        score++;
        playCelebrationEffect();
    } else {
        playErrorEffect();
    }

    nextButton.disabled = false;
    clearInterval(timerInterval); // Para o timer ao escolher uma resposta
}

// Função para mostrar o resultado final
function showResult() {
    quizCompleted = true;
    resultContainer.style.display = 'block';
    scoreElement.textContent = `Você acertou ${score} de ${questions.length} perguntas.`;
    nextButton.style.display = 'none';
    saveScore();
}

// Função para reiniciar o quiz
function restartQuiz() {
    quizCompleted = false;
    score = 0;
    currentQuestionIndex = 0;
    resultContainer.style.display = 'none';
    nextButton.style.display = 'inline-block';
    showQuestion();
    startTimer();
}

// Função para salvar a pontuação
function saveScore() {
    const username = document.getElementById('username').value;
    leaderboard.push({ name: username, score });
    leaderboard.sort((a, b) => b.score - a.score); // Ordena do maior para o menor
    if (leaderboard.length > 5) leaderboard.pop(); // Mantém apenas os 5 primeiros
    if (isAdmin) loadLeaderboard(); // Atualiza o pódio para o admin
}

// Função para carregar o pódio
function loadLeaderboard() {
    leaderboardElement.innerHTML = '';
    leaderboard.forEach(player => {
        const li = document.createElement('li');
        li.textContent = `${player.name}: ${player.score}`;
        leaderboardElement.appendChild(li);
    });
}

// Função para iniciar o timer
function startTimer() {
    timer = 30;
    timerBar.style.width = '100%';
    timerBar.style.backgroundColor = 'green';
    timerInterval = setInterval(() => {
        timer--;
        const width = (timer / 30) * 100;
        timerBar.style.width = `${width}%`;
        if (width <= 25) {
            timerBar.style.backgroundColor = 'red';
        }
        if (timer === 0) {
            clearInterval(timerInterval);
            nextQuestion();
        }
    }, 1000);
}

// Função para ir para a próxima pergunta
function nextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        showQuestion();
        startTimer();
    } else {
        showResult();
    }
}

// Função para tocar o efeito de comemoração (som e visuais)
function playCelebrationEffect() {
    const confetti = document.createElement('div');
    confetti.classList.add('confetti');
    document.body.appendChild(confetti);

    const audio = new Audio('celebration.mp3'); // Certifique-se de ter o arquivo de áudio
    audio.play();
}

// Função para tocar o efeito de erro (som e visual)
function playErrorEffect() {
    const xMark = document.createElement('div');
    xMark.classList.add('x-mark');
    document.body.appendChild(xMark);

    const audio = new Audio('error.mp3'); // Certifique-se de ter o arquivo de áudio
    audio.play();
}

// Função para sair
function logout() {
    loginContainer.style.display = 'block';
    adminContainer.style.display = 'none';
}
