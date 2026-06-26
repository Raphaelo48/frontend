// ============================================================
//  ХРАНИЛИЩЕ ДАННЫХ (localStorage → потом PostgreSQL)
// ============================================================

const DB_KEY = "nutrition_results";

const Storage = {
    // --- БАЗОВЫЕ ОПЕРАЦИИ ---
    
    getResults: function() {
        try {
            return JSON.parse(localStorage.getItem(DB_KEY) || "[]");
        } catch (e) {
            console.error('❌ Ошибка чтения:', e);
            return [];
        }
    },
    
    saveResult: function(result) {
        const results = this.getResults();
        results.push(result);
        localStorage.setItem(DB_KEY, JSON.stringify(results));
        console.log('✅ Сохранено:', result);
        return results;
    },
    
    clearResults: function() {
        localStorage.removeItem(DB_KEY);
        console.log('🗑 Данные очищены');
    },
    
    // --- СПЕЦИАЛЬНЫЕ ЗАПРОСЫ ---
    
    getMyResults: function() {
        return this.getResults().filter(r => r.isMine === true);
    },
    
    getStats: function() {
        const results = this.getResults();
        const total = results.length;
        if (total === 0) {
            return { total: 0, avg: 0, best: 0, today: 0 };
        }
        const avg = results.reduce((s, r) => s + r.totalScore, 0) / total;
        const best = Math.max(...results.map(r => r.totalScore));
        const today = results.filter(r => {
            const d = new Date(r.date);
            const now = new Date();
            return d.toDateString() === now.toDateString();
        }).length;
        return { total, avg, best, today };
    },
    
    getCategoryAverages: function() {
        const results = this.getResults();
        const total = results.length;
        if (total === 0) {
            return { regime: 0, fastfood: 0, concentration: 0 };
        }
        return {
            regime: results.reduce((s, r) => s + r.regime, 0) / total,
            fastfood: results.reduce((s, r) => s + r.fastfood, 0) / total,
            concentration: results.reduce((s, r) => s + r.concentration, 0) / total
        };
    },
    
    getVerdictCounts: function() {
        const results = this.getResults();
        return {
            excellent: results.filter(r => r.verdict === 'excellent').length,
            good: results.filter(r => r.verdict === 'good').length,
            average: results.filter(r => r.verdict === 'average').length,
            poor: results.filter(r => r.verdict === 'poor').length
        };
    },
    
    getDailyCounts: function(days = 14) {
        const results = this.getResults();
        const now = new Date();
        const daily = [];
        for (let i = days - 1; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            d.setHours(0, 0, 0, 0);
            const next = new Date(d);
            next.setDate(next.getDate() + 1);
            const count = results.filter(r => {
                const rd = new Date(r.date);
                return rd >= d && rd < next;
            }).length;
            daily.push({
                date: d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }),
                count: count
            });
        }
        return daily;
    }
};

// ============================================================
//  ДЕМО-ДАННЫЕ
// ============================================================

function seedDemoData() {
    const results = Storage.getResults();
    if (results.length > 0) return;

    const demoData = [];
    const now = new Date();

    for (let i = 0; i < 12; i++) {
        const daysAgo = Math.floor(Math.random() * 14);
        const date = new Date(now);
        date.setDate(date.getDate() - daysAgo);
        date.setHours(Math.floor(Math.random() * 14) + 8, Math.floor(Math.random() * 60));

        const regime = Math.floor(Math.random() * 13) + 4;
        const fastfood = Math.floor(Math.random() * 10) + 3;
        const concentration = Math.floor(Math.random() * 10) + 3;
        const total = regime + fastfood + concentration;
        
        let verdict;
        const ratio = total / 40;
        if (ratio >= 0.8) verdict = "excellent";
        else if (ratio >= 0.6) verdict = "good";
        else if (ratio >= 0.4) verdict = "average";
        else verdict = "poor";

        demoData.push({
            date: date.toISOString(),
            totalScore: total,
            regime: regime,
            fastfood: fastfood,
            concentration: concentration,
            verdict: verdict,
            isMine: Math.random() > 0.7
        });
    }

    localStorage.setItem(DB_KEY, JSON.stringify(demoData));
    console.log('📊 Добавлены демо-данные (12 записей)');
}

// Глобальные функции для совместимости
window.Storage = Storage;
window.seedDemoData = seedDemoData;