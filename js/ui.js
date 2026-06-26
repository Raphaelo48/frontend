// ============================================================
//  УПРАВЛЕНИЕ ЭКРАНАМИ
// ============================================================

const UI = {
    // Переключить экран по ID
    showScreen: function(id) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        const target = document.getElementById(id);
        if (target) {
            target.classList.add('active');
            console.log('✅ Показан экран:', id);
        } else {
            console.error('❌ Экран не найден:', id);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    
    // Обновить счётчик на главной
    updateBadge: function() {
        const badge = document.getElementById('total-passed-badge');
        if (badge) {
            badge.textContent = Storage.getResults().length;
        }
    },
    
    // Перейти на главную
    goHome: function() {
        this.showScreen('start-screen');
        this.updateBadge();
    },
    
    // Начать опрос
    startQuiz: function() {
        if (window.QuizApp) {
            window.QuizApp.reset();
        }
        this.showScreen('quiz-screen');
        if (window.QuizApp) {
            window.QuizApp.renderQuestion();
        }
    },
    
    // Показать мои результаты
    showMyResults: function() {
        this.showScreen('myresults-screen');
        if (window.Statistics) {
            window.Statistics.renderMyResults();
        }
    },
    
    // Показать статистику
    showStats: function() {
        this.showScreen('stats-screen');
        if (window.Statistics) {
            window.Statistics.renderStats();
        }
    }
};

// ============================================================
//  ГЛОБАЛЬНЫЕ ФУНКЦИИ ДЛЯ ВЫЗОВА ИЗ HTML
// ============================================================

// Основные навигационные функции
window.showScreen = function(id) { UI.showScreen(id); };
window.updateBadge = function() { UI.updateBadge(); };
window.backToStart = function() { UI.goHome(); };
window.startQuiz = function() { UI.startQuiz(); };

// Функции для статистики (используют UI + Statistics)
window.showMyResults = function() {
    UI.showScreen('myresults-screen');
    if (window.Statistics) {
        window.Statistics.renderMyResults();
    } else {
        console.error('❌ Statistics не загружен!');
    }
};

window.showStats = function() {
    UI.showScreen('stats-screen');
    if (window.Statistics) {
        window.Statistics.renderStats();
    } else {
        console.error('❌ Statistics не загружен!');
    }
};

// Делаем UI глобальным
window.UI = UI;

console.log('🖥️ UI module loaded!');