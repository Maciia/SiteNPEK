// Config
const isDenominator = true;

const scheduleData = [
    {
        day: "Понедельник",
        lessons: [
            { id: 0, time: "8.30 – 8.55", subject: "Классный час", teacher: "", room: "", week: "both" },
            { id: 1, time: "9.00 – 10.30", subject: "Физ-ра", teacher: "Морозов", room: "т.з.", week: "both" },
            { id: 2, time: "10.40 – 12.10", subject: "Физика", teacher: "Кирилов", room: "41", week: "both" },
            { id: 3, time: "12.40 – 14.10", subject: "Ин. язык", teacher: "Гурджиева", room: "45а", week: "both", isGroup: true, secondTeacher: "Воронович", secondRoom: "55а" }
        ]
    },
    {
        day: "Вторник",
        lessons: [
            { id: 1, time: "8.30 – 10.00", subject: "Матем.", teacher: "Ильина", room: "42", week: "both" },
            { id: 2, time: "10.15 – 11.45", subject: "Русс.яз", teacher: "Рукосуева", room: "47", week: "both" },
            { id: 3, time: "12.20 – 13.50", subject: "Лит-ра", teacher: "Рукосуева", room: "47", week: "both" }
        ]
    },
    {
        day: "Среда",
        lessons: [
            { id: 1, time: "8.30 – 10.00", subject: "История", teacher: "Кунц", room: "49", week: "both" },
            { id: 2, time: "10.15 – 11.45", subject: "Инф-ка", teacher: "Алексеев", room: "48", week: "both" },
            { id: 3, time: "12.20 – 13.50", subject: "Физика", teacher: "Кирилов", room: "41", week: "both" }
        ]
    },
    {
        day: "Четверг",
        lessons: [
            { id: 1, time: "8.30 – 10.00", subject: "Биолог.", teacher: "Печуркина", room: "45", week: "num" },
            { id: 1, time: "8.30 – 10.00", subject: "Литер.", teacher: "Рукосуева", room: "47", week: "den" },
            { id: 2, time: "10.15 – 11.45", subject: "Матем.", teacher: "Ильина", room: "42", week: "both" },
            { id: 3, time: "12.20 – 13.50", subject: "История", teacher: "Кунц", room: "49", week: "num" },
            { id: 3, time: "12.20 – 13.50", subject: "Географ.", teacher: "Орехова", room: "42а", week: "den" },
            { id: 4, time: "14.00 – 15.30", subject: "Инф-ка", teacher: "Алексеев", room: "48", week: "both" }
        ]
    },
    {
        day: "Пятница",
        lessons: [
            { id: 1, time: "8.30 – 10.00", subject: "Физ-ра", teacher: "Морозов", room: "с.з.", week: "both" },
            { id: 2, time: "10.15 – 11.45", subject: "ОБЗР", teacher: "Михалкин", room: "32", week: "both" },
            { id: 3, time: "12.20 – 13.50", subject: "Инф-ка", teacher: "Алексеев", room: "48", week: "both" }
        ]
    },
    {
        day: "Суббота",
        lessons: [
            { id: 1, time: "8.30 – 10.00", subject: "Матем.", teacher: "Ильина", room: "42", week: "both" },
            { id: 2, time: "10.15 – 11.45", subject: "Химия", teacher: "Головлева", room: "51", week: "both" }
        ]
    }
];

// Configs
const daysOfWeek = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];

let currentDayIndex = new Date().getDay();
let mobileDayIndex = (currentDayIndex === 0) ? 0 : (currentDayIndex - 1);
if (mobileDayIndex < 0) mobileDayIndex = 0;
if (mobileDayIndex > 5) mobileDayIndex = 5;

function getWeekType() {
    return isDenominator ? 'den' : 'num';
}

function parseTime(timeStr) {
    if (!timeStr) return 0;
    const safeStr = timeStr.replace(/\u2013|\u2014/g, "-").trim();
    const parts = safeStr.split('.').join(':').split(/[\s\-–]+/);

    let hours = 0, mins = 0;
    if (timeStr.includes('.')) {
        const [h, m] = timeStr.trim().split('.');
        hours = parseInt(h);
        mins = parseInt(m);
    } else if (timeStr.includes(':')) {
        const [h, m] = timeStr.trim().split(':');
        hours = parseInt(h);
        mins = parseInt(m);
    }
    return (hours * 60) + mins;
}

function splitTimeRange(rangeStr) {
    const norm = rangeStr.replace(/\u2013|\u2014|-/g, "|");
    const parts = norm.split('|');
    if (parts.length >= 2) return [parts[0].trim(), parts[1].trim()];
    return [null, null];
}

function renderSchedule() {
    const container = document.getElementById('schedule-grid');
    if (!container) return;

    container.innerHTML = '';

    // Inject custom top bar into the status-panel logic if utilizing same divs
    // We are essentially hijacking the HTML structure with CSS
    // So we just render cards here.

    scheduleData.forEach((dayData, index) => {
        const card = document.createElement('div');
        card.className = 'day-card';
        card.dataset.idx = index;

        if (index === mobileDayIndex) card.classList.add('mobile-active');
        if ((index + 1) === currentDayIndex) card.classList.add('today');

        card.innerHTML = `
            <div class="day-header">
                <span class="day-name">${dayData.day}</span>
                <span class="day-badge">${(index + 1) === currentDayIndex ? 'Сегодня' : ''}</span>
            </div>
            <ul class="lesson-list"></ul>
        `;

        const list = card.querySelector('.lesson-list');

        dayData.lessons.forEach(lesson => {
            if (lesson.week !== 'both' && lesson.week !== getWeekType()) return;

            const item = document.createElement('li');
            item.className = 'lesson-item';

            item.dataset.time = lesson.time;
            item.dataset.dayIndex = index + 1;

            let subject = lesson.subject;
            let teacher = lesson.teacher || "";
            let room = lesson.room || "";

            if (lesson.isGroup) {
                teacher += ` / ${lesson.secondTeacher}`;
                room += ` / ${lesson.secondRoom}`;
            }

            item.innerHTML = `
                <div class="lesson-number">${lesson.id}</div>
                <div class="lesson-content">
                    <div class="lesson-subject">${subject}</div>
                     <div class="lesson-details">
                        <span class="lesson-teacher">${teacher}</span>
                        <span class="lesson-room">${room}</span>
                    </div>
                </div>
                <div class="lesson-time-col">
                   <div class="lesson-time">${lesson.time}</div>
                </div>
            `;
            list.appendChild(item);
        });

        container.appendChild(card);
    });

    const navLabel = document.getElementById('current-day-label');
    if (navLabel && scheduleData[mobileDayIndex]) {
        navLabel.textContent = scheduleData[mobileDayIndex].day;
    }
}

function updateState() {
    try {
        const now = new Date();
        const nowMins = now.getHours() * 60 + now.getMinutes();
        const nowSecs = now.getSeconds();

        // Update DOM elements used by our new CSS
        const realTimeDisplay = document.getElementById('real-time');
        const timerDisplay = document.getElementById('countdown-timer');
        // We reuse status-title or create a new header bar if preferred, 
        // but current CSS hides status-title. Timer is key.

        if (realTimeDisplay) {
            realTimeDisplay.textContent = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
        }

        // Logic
        let statusText = "Ожидание";
        let timerText = "--:--";

        if (currentDayIndex === 0) {
            timerText = "Chill";
            statusText = "Выходной";
        } else {
            const todayData = scheduleData[currentDayIndex - 1];
            if (todayData) {
                const validLessons = todayData.lessons.filter(l => l.week === 'both' || l.week === getWeekType());
                const ranges = [];
                for (let l of validLessons) {
                    const [sStr, eStr] = splitTimeRange(l.time);
                    if (sStr && eStr) ranges.push({ start: parseTime(sStr), end: parseTime(eStr), ...l });
                }

                let activeLesson = null;
                let nextLesson = null;

                for (let r of ranges) {
                    if (nowMins >= r.start && nowMins < r.end) {
                        activeLesson = r;
                        break;
                    }
                    if (nowMins < r.start) {
                        nextLesson = r;
                        break;
                    }
                }

                document.querySelectorAll('.lesson-item').forEach(el => el.classList.remove('active-lesson'));

                if (activeLesson) {
                    const activeEl = document.querySelector(`.lesson-item[data-day-index="${currentDayIndex}"][data-time="${activeLesson.time}"]`);
                    if (activeEl) activeEl.classList.add('active-lesson');

                    const remainingMins = activeLesson.end - nowMins - 1;
                    const remainingSecs = 60 - nowSecs;
                    const secStr = remainingSecs === 60 ? "00" : remainingSecs.toString().padStart(2, '0');
                    timerText = `${remainingMins}:${secStr}`;
                    statusText = "Идёт пара";
                } else if (nextLesson) {
                    const remainingMins = nextLesson.start - nowMins - 1;
                    const remainingSecs = 60 - nowSecs;
                    const secStr = remainingSecs === 60 ? "00" : remainingSecs.toString().padStart(2, '0');
                    timerText = `${remainingMins}:${secStr}`;
                    statusText = "Перемена";
                } else {
                    if (ranges.length > 0 && nowMins >= ranges[ranges.length - 1].end) {
                        timerText = "Домой";
                        statusText = "Пары закончились";
                    } else {
                        timerText = "--:--";
                        statusText = "До начала";
                    }
                }
            }
        }

        if (timerDisplay) timerDisplay.textContent = timerText;
        // If we want to show status text, we'd need a visible element. 
        // CSS mostly hides it to be compact, but timer is visible.

    } catch (e) { console.error(e); }
}

function switchMobileDay(dir) {
    const newIdx = mobileDayIndex + dir;
    if (newIdx >= 0 && newIdx < scheduleData.length) {
        mobileDayIndex = newIdx;
        document.querySelectorAll('.day-card').forEach(card => {
            card.classList.remove('mobile-active');
            if (parseInt(card.dataset.idx) === mobileDayIndex) card.classList.add('mobile-active');
        });
        const navLabel = document.getElementById('current-day-label');
        if (navLabel && scheduleData[mobileDayIndex]) {
            navLabel.textContent = scheduleData[mobileDayIndex].day;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Inject Top Bar HTML Structure helper
    // We are converting the existing .status-panel into a top-bar style via JS if needed,
    // or just relying on CSS. The CSS targets .top-bar classes which don't exist in HTML.
    // We should fix HTML or just rely on the existing HTML classes styled to look like top bar.
    // The CSS I wrote targets .top-bar, .header-left etc which are NOT in HTML.
    // I NEED TO INJECT THEM or REWRITE HTML.

    // Quick Fix: Rewrite HTML structure for top bar
    const statusPanel = document.querySelector('.status-panel');
    const header = document.querySelector('.header');

    if (statusPanel) {
        statusPanel.className = 'top-bar';
        statusPanel.innerHTML = `
            <div class="header-left">
                <h1 class="title">Расписание</h1>
                <div class="week-info">${isDenominator ? 'Знаменатель' : 'Числитель'}</div>
            </div>
            <div class="status-right">
                <div class="timer-container">
                    <span id="countdown-timer" class="countdown-timer">--:--</span>
                </div>
                <div id="real-time" class="real-time">--:--</div>
            </div>
        `;
        // Remove old header if exists
        if (header) header.style.display = 'none';
    }

    renderSchedule();

    const prev = document.getElementById('prev-day');
    const next = document.getElementById('next-day');
    if (prev) prev.addEventListener('click', () => switchMobileDay(-1));
    if (next) next.addEventListener('click', () => switchMobileDay(1));

    setInterval(updateState, 1000);
    updateState();
});
