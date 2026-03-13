// Config
// Start of the semester (e.g. 1-st week of 2026, or a specific date like Jan 12, 2026)
// Let's assume the semester started on Jan 12, 2026, and week 1 is numerator (num).
const semesterStartDate = new Date('2026-01-12T00:00:00');

let weekOffset = 0;

// Calculate current week type dynamically
function getWeekType() {
    const now = new Date();
    // Add weeks to 'now' based on offset
    now.setDate(now.getDate() + (weekOffset * 7));

    // Calculate difference in weeks
    const diffTime = Math.abs(now - semesterStartDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const weeksPassed = Math.floor(diffDays / 7);

    // If weeksPassed is even (0, 2, 4...) it's numerator (num). If odd (1, 3, 5...) it's denominator (den).
    return (weeksPassed % 2 === 0) ? 'num' : 'den';
}

let scheduleData = [
    {
        day: "Понедельник",
        lessons: [
            { id: 0, time: "8:30 – 8:55", subject: "Классный час", teacher: "", room: "", week: "both" },
            { id: 1, time: "9:00 – 10:30", subject: "Физ-ра", teacher: "Матвей Андреевич", room: "т.з.", week: "both" },
            { id: 2, time: "10:40 – 12:10", subject: "Физика", teacher: "Александр Алексеевич", room: "41", week: "both" },
            // Based on image: Ин. язык (Гурджиева 45а / Воронович 55а) is 3rd lesson.
            { id: 3, time: "12:40 – 14:10", subject: "Ин. язык", teacher: "Замира Шамсадинова", room: "45а", week: "both", isGroup: true, secondTeacher: "Воронович", secondRoom: "55а" },
            // Also adding 4th and 5th lesson times from the bell schedule so timer works if they existed
            // { id: 4, time: "15.00 – 16.30", subject: "", teacher: "", room: "", week: "both" },
            // { id: 5, time: "16.40 – 18.10", subject: "", teacher: "", room: "", week: "both" }
        ]
    },
    {
        day: "Вторник",
        lessons: [
            { id: 1, time: "8:30 – 10:00", subject: "Матем.", teacher: "Елена Александровна", room: "42", week: "both" },
            { id: 2, time: "10:15 – 11:45", subject: "Русс.яз", teacher: "Наталья Анатольевна", room: "47", week: "both" },
            { id: 3, time: "12:20 – 13:50", subject: "Лит-ра", teacher: "Наталья Анатольевна", room: "47", week: "both" }
        ]
    },
    {
        day: "Среда",
        lessons: [
            { id: 1, time: "8:30 – 10:00", subject: "История", teacher: "Марина Геннадьевна", room: "49", week: "both" },
            { id: 2, time: "10:15 – 11:45", subject: "Инф-ка", teacher: "Максим Сергеевич", room: "48", week: "both" },
            { id: 3, time: "12:20 – 13:50", subject: "Физика", teacher: "Александр Алексеевич", room: "41", week: "both" }
        ]
    },
    {
        day: "Четверг",
        lessons: [
            { id: 1, time: "8:30 – 10:00", subject: "Биология", teacher: "Печуркина", room: "45", week: "num" },
            { id: 1, time: "8:30 – 10:00", subject: "Литер.", teacher: "Наталья Анатольевна", room: "47", week: "den" },
            { id: 2, time: "10:15 – 11:45", subject: "Матем.", teacher: "Елена Александровна", room: "42", week: "both" },
            { id: 3, time: "12:20 – 13:50", subject: "История", teacher: "Марина Геннадьевна", room: "49", week: "num" },
            { id: 3, time: "12:20 – 13:50", subject: "География", teacher: "Татьяна Викторовна", room: "42а", week: "den" },
            { id: 4, time: "14:00 – 15:30", subject: "Инф-ка", teacher: "Максим Сергеевич", room: "48", week: "both" }
        ]
    },
    {
        day: "Пятница",
        lessons: [
            { id: 1, time: "8:30 – 10:00", subject: "Физ-ра", teacher: "Матвей Андреевич", room: "с.з.", week: "den" },
            { id: 2, time: "10:15 – 11:45", subject: "ОБЗР", teacher: "Олег Геннадьевич", room: "32", week: "both" },
            { id: 3, time: "12:20 – 13:50", subject: "Инф-ка", teacher: "Максим Сергеевич", room: "48", week: "both" },
            { id: 4, time: "14:00 – 15:30", subject: "Общество", teacher: "Думбадзе", room: "38", week: "both" }
        ]
    },
    {
        day: "Суббота",
        lessons: [
            { id: 1, time: "8:30 – 10:00", subject: "Матем.", teacher: "Елена Александровна", room: "42", week: "both" },
            { id: 2, time: "10:15 – 11:45", subject: "Химия", teacher: "Головлева", room: "51", week: "both" }
        ]
    }
];

// Configs
const daysOfWeek = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];

let currentDayIndex = new Date().getDay();
let mobileDayIndex = (currentDayIndex === 0) ? 0 : (currentDayIndex - 1);
if (mobileDayIndex < 0) mobileDayIndex = 0;
if (mobileDayIndex > 5) mobileDayIndex = 5;

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

    // Calculate dates for the week we are rendering
    const now = new Date();
    // Start by moving by weekOffset
    now.setDate(now.getDate() + (weekOffset * 7));
    const renderCurrentDay = now.getDay();
    // Find the Monday of the rendering week
    let renderMonday = new Date(now);
    const dayMod = renderCurrentDay === 0 ? 7 : renderCurrentDay;
    renderMonday.setDate(renderMonday.getDate() - dayMod + 1);

    scheduleData.forEach((dayData, index) => {
        const card = document.createElement('div');
        card.className = 'day-card';
        card.dataset.idx = index;

        // Calculate actual date for this card
        const cardDate = new Date(renderMonday);
        cardDate.setDate(renderMonday.getDate() + index);
        const cardDateStr = cardDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'numeric' });

        // Overrides Check
        let lessonsToRender = dayData.lessons;
        if (window.scheduleOverrides && window.scheduleOverrides[cardDateStr]) {
            lessonsToRender = window.scheduleOverrides[cardDateStr];
            card.classList.add('has-override'); // Visual hint if needed
        }

        // Highlight today only if weekOffset is 0
        if (index === mobileDayIndex && weekOffset === 0) card.classList.add('mobile-active');
        if ((index + 1) === renderCurrentDay && weekOffset === 0) card.classList.add('today');

        // Holiday Check
        const hol = checkHolidayThemes(card, cardDate);
        let holidayHtml = '';
        if (hol) {
            const label1 = hol.name;
            if (hol.isDayOff) {
                const label2 = '(предп. выходной)';
                const activeLabel = (window.currentHolidayMember === 2) ? label2 : label1;
                holidayHtml = `<div class="holiday-oscillator" data-l1="${label1}" data-l2="${label2}" style="font-size: 0.8rem; color: #ffd700; font-weight: 700; margin-top: 4px; text-transform: uppercase;">
                    <span class="oscillator-text">${activeLabel}</span>
                </div>`;
            } else {
                holidayHtml = `<div style="font-size: 0.8rem; color: #ffd700; font-weight: 700; margin-top: 4px; text-transform: uppercase;">${label1}</div>`;
            }
        }

        const isToday = (index + 1) === renderCurrentDay && weekOffset === 0;
        const badgeHtml = isToday ? '<span class="day-badge">Сегодня</span>' : '';

        card.innerHTML = `
            <div class="day-header" style="flex-direction: column; align-items: flex-start;">
                <div style="display: flex; justify-content: space-between; width: 100%; align-items: baseline;">
                    <div class="day-title-col">
                        <span class="day-name">${dayData.day}</span>
                        <span class="day-date">${cardDateStr}</span>
                    </div>
                    ${badgeHtml}
                </div>
                ${holidayHtml}
            </div>
            <ul class="lesson-list"></ul>
        `;

        const list = card.querySelector('.lesson-list');

        lessonsToRender.forEach(lesson => {
            if (lesson.week !== 'both' && lesson.week !== getWeekType()) return;

                const item = document.createElement('li');
                item.className = 'lesson-item';

                item.dataset.time = lesson.time;
                item.dataset.dayIndex = index + 1;

                let subject = lesson.subject;
                let teacher = lesson.teacher || '';
                let rawRoom = lesson.room || '';
                let room = rawRoom ? `каб. ${rawRoom}` : '';

                let detailsInner = `
                    <div class="lesson-details-compact">
                        <span class="lesson-teacher">${teacher}</span>
                        <span class="lesson-room">${room}</span>
                    </div>
                `;

                // Handle Splitting (either via explicit isGroup or via "//" delimiter)
                const splitTeacher = teacher.split(' // ');
                const splitRoom = rawRoom.split(' // ');

                if (lesson.isGroup || splitTeacher.length > 1 || splitRoom.length > 1) {
                    const t1 = splitTeacher[0];
                    const t2 = splitTeacher[1] || lesson.secondTeacher || t1;
                    const r1 = splitRoom[0] ? `каб. ${splitRoom[0]}` : '';
                    const r2 = (splitRoom[1] || lesson.secondRoom) ? `каб. ${splitRoom[1] || lesson.secondRoom}` : r1;

                    const activeT = (window.currentGroupMember === 2) ? t2 : t1;
                    const activeR = (window.currentGroupMember === 2) ? r2 : r1;

                    detailsInner = `
                        <div class="lesson-details-compact group-oscillator" data-t1="${t1}" data-t2="${t2}" data-r1="${r1}" data-r2="${r2}">
                            <span class="lesson-teacher oscillator-text">${activeT}</span>
                            <span class="lesson-room oscillator-text">${activeR}</span>
                        </div>
                    `;
                }

                // Render tasks for this lesson
                const tasksHtml = renderLessonTasks(subject, cardDateStr);

                item.innerHTML = `
                    <div class="lesson-number">${lesson.id}</div>
                    <div class="lesson-content">
                        <div class="lesson-subject">${subject}</div>
                         <div class="lesson-details">
                            ${detailsInner}
                        </div>
                        ${tasksHtml}
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

    // Fix week-switch bug
    document.querySelectorAll('.day-card').forEach((card, i) => {
        card.classList.toggle('mobile-active', i === mobileDayIndex);
    });

    // Auto-font-size check for subjects and teachers
    document.querySelectorAll('.lesson-item').forEach(item => {
        const subject = item.querySelector('.lesson-subject');
        const teacher = item.querySelector('.lesson-teacher');
        
        const shrink = (el, max) => {
            if (!el) return;
            let size = parseFloat(window.getComputedStyle(el).fontSize);
            while (el.scrollWidth > el.clientWidth && size > 8) {
                size -= 0.5;
                el.style.fontSize = size + 'px';
            }
        };
        
        // Slightly delay to ensure layout is ready
        setTimeout(() => {
            shrink(subject);
            shrink(teacher);
        }, 10);
    });
}

function checkHolidayThemes(cardEl, dateObj) {
    const d = dateObj.getDate();
    const m = dateObj.getMonth() + 1;
    const dateStr = `${d < 10 ? '0' + d : d}.${m < 10 ? '0' + m : m}`;

    const holidays = [
        { date: '23.02', name: 'День защитника Отечества', theme: 'theme-defender', isDayOff: true },
        { date: '08.03', name: 'Международный женский день', theme: 'theme-womens', isDayOff: false },
        { date: '01.05', name: 'Праздник Весны и Труда', theme: 'theme-spring', isDayOff: false },
        { date: '09.05', name: 'День Победы', theme: 'theme-victory', isDayOff: true },
        { date: '31.12', name: 'Новый год', theme: 'theme-newyear', isDayOff: true },
        { date: '01.01', name: 'Новый год', theme: 'theme-newyear', isDayOff: true },
        // Expanded Holiday Collection
        { date: '29.01', name: 'Китайский Новый год', theme: 'theme-china', isDayOff: false },
        { date: '24.01', name: 'Международный день образования', theme: 'theme-education', isDayOff: false },
        { date: '25.01', name: 'День студента', theme: 'theme-student', isDayOff: false },
        { date: '14.02', name: 'День святого Валентина', theme: 'theme-love', isDayOff: false },
        { date: '17.03', name: 'День святого Патрика', theme: 'theme-green', isDayOff: false },
        { date: '01.04', name: 'День смеха', theme: 'theme-fun', isDayOff: false },
        { date: '22.04', name: 'День Земли', theme: 'theme-earth', isDayOff: false },
        { date: '04.05', name: 'День Звёздных войн', theme: 'theme-stars', isDayOff: false },
        { date: '21.06', name: 'Международный день йоги', theme: 'theme-yoga', isDayOff: false },
        { date: '07.07', name: 'Танабата', theme: 'theme-japan', isDayOff: false },
        { date: '12.08', name: 'Международный день молодёжи', theme: 'theme-youth', isDayOff: false },
        { date: '01.09', name: 'День знаний', theme: 'theme-knowledge', isDayOff: false },
        { date: '05.10', name: 'День учителя', theme: 'theme-teacher', isDayOff: false },
        { date: '31.10', name: 'Хэллоуин', theme: 'theme-halloween', isDayOff: false },
        { date: '05.11', name: 'Ночь Гая Фокса', theme: 'theme-fire', isDayOff: false },
        { date: '25.12', name: 'Рождество', theme: 'theme-christmas', isDayOff: false }
    ];

    const hol = holidays.find(h => h.date === dateStr);
    if (hol) {
        return hol; // Return the holiday object for the label rendering
    }
    return null;
}

// Smart Tasks Logic
function getTasks() {
    try {
        const data = localStorage.getItem('npek_smart_tasks');
        return data ? JSON.parse(data) : [];
    } catch (e) { return []; }
}

function saveTasks(tasks) {
    localStorage.setItem('npek_smart_tasks', JSON.stringify(tasks));
}

window.showHidden = false;

window.toggleHiddenTasks = function () {
    window.showHidden = !window.showHidden;
    renderSchedule();
}

// ===================== ADMIN / GLOBAL NOTES =====================
const ADMIN_SECRET = 'robloxadmin777';
const DEFAULT_REPO = 'Maciia/SiteNPEK';

function isAdmin() {
    return localStorage.getItem('npek_admin') === '1';
}

function setAdmin() {
    localStorage.setItem('npek_admin', '1');
}

window.logoutAdmin = function() {
    localStorage.removeItem('npek_admin');
    const adminBtn = document.getElementById('global-admin-btn');
    if (adminBtn) adminBtn.style.display = 'none';
    window.closeGlobalAdminPanel();
    window.closeScheduleAdminPanel();
    alert('🔒 Режим администратора отключен.');
};

// In-memory cache for global notes (fetched from globalNote.json)
window.globalNotes = [];

function saveGlobalNotesCache() {
    localStorage.setItem('npek_global_notes', JSON.stringify(window.globalNotes));
}

async function loadGlobalNotes() {
    // 1. Load from localStorage cache first for instant display
    try {
        const cached = localStorage.getItem('npek_global_notes');
        if (cached) {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed)) window.globalNotes = parsed;
        }
    } catch (e) { }
    renderSchedule();

    // 2. Then try to fetch fresh from file (GitHub Pages)
    try {
        const resp = await fetch('globalNote.json?t=' + Date.now());
        if (resp.ok) {
            const data = await resp.json();
            const fresh = Array.isArray(data.notes) ? data.notes : [];
            // Only update cache if the file has notes (avoids wiping local data when running offline)
            if (fresh.length > 0) {
                window.globalNotes = fresh;
                saveGlobalNotesCache();
                renderSchedule();
            }
        }
    } catch (e) { /* offline or local file — use cached */ }
}

window.scheduleOverrides = {}; // Dict of dateStr -> lessons[]

async function loadGlobalSchedule() {
    // 1. Try localStorage
    try {
        const cached = localStorage.getItem('npek_global_schedule');
        const cachedOverrides = localStorage.getItem('npek_global_overrides');
        if (cached) {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed) && parsed.length === 6) scheduleData = parsed;
        }
        if (cachedOverrides) {
            window.scheduleOverrides = JSON.parse(cachedOverrides);
        }
    } catch (e) { }

    // 2. Fetch fresh
    try {
        const resp = await fetch('globalSchedule.json?t=' + Date.now());
        if (resp.ok) {
            const data = await resp.json();
            if (Array.isArray(data.schedule) && data.schedule.length === 6) {
                scheduleData = data.schedule;
                localStorage.setItem('npek_global_schedule', JSON.stringify(scheduleData));
            }
            if (data.overrides) {
                window.scheduleOverrides = data.overrides;
                localStorage.setItem('npek_global_overrides', JSON.stringify(window.scheduleOverrides));
            }
            renderSchedule();
        }
    } catch (e) { }
}

function getGlobalNotesForLesson(subject, dateStr) {
    return window.globalNotes.filter(n => n.subject === subject && n.targetDate === dateStr);
}

// ---- Admin Panel UI ----
window.openGlobalAdminPanel = function () {
    document.getElementById('global-admin-modal').classList.add('active');
    renderGlobalNotesList();
}

window.closeGlobalAdminPanel = function () {
    document.getElementById('global-admin-modal').classList.remove('active');
}

function renderGlobalNotesList() {
    const list = document.getElementById('global-notes-list');
    if (!list) return;
    const notes = window.globalNotes;
    if (!notes.length) {
        list.innerHTML = '<div style="color:#666;text-align:center;padding:12px">Нет глобальных заметок</div>';
        return;
    }
    list.innerHTML = notes.map((n, i) => `
        <div class="lesson-task-item" style="margin-bottom:6px;justify-content:space-between">
            <span>📌 <b>${n.subject}</b> (${n.targetDate}): ${n.text}</span>
            <button class="btn btn-cancel" style="padding:2px 8px;font-size:0.75rem" onclick="window.deleteGlobalNote(${i})">✕</button>
        </div>
    `).join('');
}

window.deleteGlobalNote = function (idx) {
    window.globalNotes.splice(idx, 1);
    saveGlobalNotesCache();
    renderGlobalNotesList();
    renderSchedule();
}

window.addGlobalNote = function () {
    const text = document.getElementById('gn-text').value.trim();
    const subj = document.getElementById('gn-subject').value;
    const day = document.getElementById('gn-day').value;
    if (!text) { alert('Введите текст заметки!'); return; }
    const targetDate = findNextLessonDate(subj, day);
    if (!targetDate) { alert('Предмет не найден в расписании!'); return; }
    window.globalNotes.push({ subject: subj, targetDate, text });
    document.getElementById('gn-text').value = '';
    saveGlobalNotesCache();
    renderGlobalNotesList();
    renderSchedule(); // Show note immediately under the lesson
}

window.saveGlobalNotes = async function () {
    // Auto-add any pending text from textarea before publishing
    const pendingText = document.getElementById('gn-text')?.value.trim();
    const pendingSubj = document.getElementById('gn-subject')?.value;
    const pendingDay = document.getElementById('gn-day')?.value;
    if (pendingText) {
        const targetDate = findNextLessonDate(pendingSubj, pendingDay);
        if (targetDate) {
            window.globalNotes.push({ subject: pendingSubj, targetDate, text: pendingText });
            document.getElementById('gn-text').value = '';
        } else {
            alert('Не найдена дата для «' + pendingSubj + '». Выберите другой предмет или день.');
            return;
        }
    }

    const token = document.getElementById('gn-token').value.trim();
    const repoInput = document.getElementById('gn-repo').value.trim();
    if (!token || !repoInput) { alert('Введите GitHub токен и репозиторий!'); return; }

    // Save token and repo for next time
    localStorage.setItem('npek_gh_token', token);
    localStorage.setItem('npek_gh_repo', repoInput);

    const content = JSON.stringify({ notes: window.globalNotes }, null, 2);
    const encoded = btoa(unescape(encodeURIComponent(content)));


    try {
        // First get the current SHA of the file (needed for update)
        const getResp = await fetch(`https://api.github.com/repos/${repoInput}/contents/globalNote.json`, {
            headers: { 'Authorization': `token ${token}`, 'Accept': 'application/vnd.github.v3+json' }
        });
        let sha = '';
        if (getResp.ok) {
            const fileData = await getResp.json();
            sha = fileData.sha;
        }

        // Commit the new content
        const putResp = await fetch(`https://api.github.com/repos/${repoInput}/contents/globalNote.json`, {
            method: 'PUT',
            headers: { 'Authorization': `token ${token}`, 'Content-Type': 'application/json', 'Accept': 'application/vnd.github.v3+json' },
            body: JSON.stringify({ message: 'Обновление глобальных заметок', content: encoded, sha })
        });
        if (putResp.ok) {
            saveGlobalNotesCache(); // Cache locally too after successful push
            alert('✅ Заметки обновлены! Изменения появятся у всех пользователей через ~1 мин (после деплоя GitHub Pages).');
            closeGlobalAdminPanel();
            renderSchedule();
        } else {
            const err = await putResp.json();
            alert('Ошибка GitHub API: ' + (err.message || putResp.status));
        }
    } catch (e) {
        alert('Ошибка сети: ' + e.message);
    }
}
// ================================================================

// Fetch Weather for Novosibirsk (Titova 14)
async function fetchWeather() {
    const weatherWidget = document.getElementById('weather-widget');
    if (!weatherWidget) return;

    try {
        // Novosibirsk, Titova 14 (using wttr.in with specific location or coords)
        const url = `https://wttr.in/Novosibirsk?format=j1`;

        const resp = await fetch(url);
        if (!resp.ok) throw new Error('Network error');
        const data = await resp.json();

        // Current weather
        const current = data.current_condition[0];
        const temp = current.temp_C;
        const feelsLike = current.FeelsLikeC;
        const desc = current.lang_ru ? current.lang_ru[0].value : current.weatherDesc[0].value;
        const wCode = current.weatherCode;

        // Tomorrow's forecast
        const tomorrow = data.weather[1];
        const tMax = tomorrow.maxtempC;
        const tMin = tomorrow.mintempC;

        // Map wttr.in weather codes to emojis (simplified)
        // https://www.worldweatheronline.com/feed/wwo-codes.txt
        let emoji = '🌤️';
        const code = parseInt(wCode);
        if (code === 113) emoji = '☀️'; // Sunny
        else if (code === 116) emoji = '🌤️'; // Partly cloudy
        else if (code === 119) emoji = '☁️'; // Cloudy
        else if (code === 122) emoji = '☁️'; // Overcast
        else if (code >= 176 && code <= 200) emoji = '🌦️'; // Patchy rain
        else if (code >= 227 && code <= 230) emoji = '❄️'; // Snow
        else if (code >= 293 && code <= 311) emoji = '🌧️'; // Rain
        else if (code >= 323 && code <= 338) emoji = '❄️'; // Heavy snow
        else if (code >= 386) emoji = '⛈️'; // Thunder

        weatherWidget.innerHTML = `
            <div style="display: flex; align-items: baseline; gap: 8px; justify-content: flex-end;">
                <span style="font-size: 1.5rem; font-weight: 800; color: #fff;">${temp}°</span>
                <span style="font-size: 0.9rem; color: #fff; font-weight: 700;">${emoji} ${desc}</span>
            </div>
            <div style="font-size: 0.72rem; color: #aaa; display: flex; gap: 6px; justify-content: flex-end; margin-top: 2px;">
                <span>Ощущается ${feelsLike}°</span>
                <span style="color: #444;">|</span>
                <span>Завтра ${tMin}°..${tMax}°</span>
            </div>
        `;
    } catch (e) {
        weatherWidget.innerHTML = `<span style="color:#aaa">Погода временно недоступна</span>`;
    }
}

function renderLessonTasks(subject, dateStr) {
    let tasks = getTasks().filter(t => t.subject === subject && t.targetDate === dateStr);

    if (!window.showHidden) {
        tasks = tasks.filter(t => t.state !== 'hidden');
    }

    const globalTasks = getGlobalNotesForLesson(subject, dateStr);
    if (tasks.length === 0 && globalTasks.length === 0) return '';

    let html = `<div class="lesson-task-list">`;
    tasks.forEach(task => {
        let stateClass = '';
        let icon = '📝';
        if (task.state === 'completed') { stateClass = 'completed'; icon = '✅'; }
        if (task.state === 'hidden') { stateClass = 'hidden-task'; icon = '👁️‍🗨️'; }

        html += `
            <div class="lesson-task-item ${stateClass}" onclick="openActionModal(${task.id}, event)">
                <span class="task-check-icon">${icon}</span>
                <span class="task-text-content">${task.text}</span>
            </div>
        `;
    });
    globalTasks.forEach(gnote => {
        html += `
            <div class="lesson-task-item global-note-item">
                <span class="task-check-icon">📌</span>
                <span class="task-text-content">${gnote.text}</span>
            </div>
        `;
    });
    html += `</div>`;
    return html;
}

// Global scope vars for modals
window.currentEditTaskId = null;
window.currentActionTaskId = null;

window.openTaskModal = function (taskId = null) {
    window.currentEditTaskId = taskId;
    const modal = document.getElementById('task-modal');
    if (!modal) return;

    // Populate subjects
    const subjectSelect = document.getElementById('task-subject');
    const subjects = new Set();
    scheduleData.forEach(d => d.lessons.forEach(l => { if (l.subject) subjects.add(l.subject) }));
    subjectSelect.innerHTML = Array.from(subjects).map(s => `<option value="${s}">${s}</option>`).join('');

    // Populate days
    const daySelect = document.getElementById('task-day');
    daySelect.innerHTML = `<option value="">-- В любой день (Ближайший) --</option>` +
        daysOfWeek.slice(1).map(d => `<option value="${d}">${d}</option>`).join('');

    if (taskId) {
        const t = getTasks().find(x => x.id === taskId);
        if (t) {
            document.getElementById('task-text').value = t.text;
            subjectSelect.value = t.subject;
        }
    } else {
        document.getElementById('task-text').value = '';
    }

    modal.classList.add('active');
}

window.closeTaskModal = function () {
    const modal = document.getElementById('task-modal');
    if (modal) modal.classList.remove('active');
}

window.saveTask = function () {
    const text = document.getElementById('task-text').value.trim();
    const subject = document.getElementById('task-subject').value;
    const day = document.getElementById('task-day').value;

    // Secret admin code check — never save as task
    if (text === ADMIN_SECRET) {
        setAdmin();
        closeTaskModal();
        document.getElementById('task-text').value = '';
        showAdminButton();
        alert('✅ Режим администратора активирован!');
        return;
    }

    if (!text) { alert("Введите текст задачи!"); return; }

    // Find target date
    const targetDate = findNextLessonDate(subject, day);
    if (!targetDate) {
        alert("Не удалось найти этот предмет в расписании!");
        return;
    }

    let tasks = getTasks();
    if (window.currentEditTaskId) {
        const t = tasks.find(x => x.id === window.currentEditTaskId);
        if (t) {
            t.text = text;
            t.subject = subject;
            t.targetDate = targetDate;
        }
    } else {
        tasks.push({ id: Date.now(), text, subject, targetDate, state: 'active' });
    }

    saveTasks(tasks);
    closeTaskModal();
    renderSchedule();
}

// Find next date a subject occurs (optionally on a specific day)
function findNextLessonDate(subject, specificDayLabel) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Search up to 4 weeks ahead
    for (let offset = 0; offset < 28; offset++) {
        const checkDate = new Date(today);
        checkDate.setDate(checkDate.getDate() + offset);

        const checkDayIdx = checkDate.getDay();
        const scheduleDayIdx = (checkDayIdx === 0) ? -1 : (checkDayIdx - 1);
        if (scheduleDayIdx < 0 || scheduleDayIdx > 5) continue; // Sunday

        const dayData = scheduleData[scheduleDayIdx];
        if (specificDayLabel && dayData.day !== specificDayLabel) continue;

        // Determine week type for this specific future date
        const diffTime = Math.abs(checkDate - semesterStartDate);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const weeksPassed = Math.floor(diffDays / 7);
        const simWeekType = (weeksPassed % 2 === 0) ? 'num' : 'den';

        const hasLesson = dayData.lessons.some(l =>
            l.subject === subject && (l.week === 'both' || l.week === simWeekType)
        );

        if (hasLesson) {
            return checkDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'numeric' });
        }
    }
    return null;
}

window.openActionModal = function (taskId, event) {
    event.stopPropagation();
    window.currentActionTaskId = taskId;

    const task = getTasks().find(t => t.id === taskId);
    const grid = document.getElementById('action-grid-container');
    if (!grid) return;

    if (task && task.state === 'hidden') {
        grid.innerHTML = `
            <div class="action-btn hide" onclick="window.taskAction('hide')">
                <span class="action-icon">🔄</span>
                <span class="action-label">Вернуть в расписание</span>
            </div>
            <div class="action-btn delete" onclick="window.taskAction('delete')">
                <span class="action-icon">🗑️</span>
                <span class="action-label">Удалить навсегда</span>
            </div>
        `;
    } else {
        grid.innerHTML = `
            <div class="action-btn complete" onclick="window.taskAction('complete')">
                <span class="action-icon">✅</span>
                <span class="action-label">Завершить</span>
            </div>
            <div class="action-btn edit" onclick="window.taskAction('edit')">
                <span class="action-icon">✏️</span>
                <span class="action-label">Изменить</span>
            </div>
            <div class="action-btn move" onclick="window.taskAction('move')">
                <span class="action-icon">➡️</span>
                <span class="action-label">След. пара</span>
            </div>
            <div class="action-btn hide" onclick="window.taskAction('hide')">
                <span class="action-icon">👁️‍🗨️</span>
                <span class="action-label">Скрыть (в архив)</span>
            </div>
            <div class="action-btn delete" style="grid-column: 1 / -1;" onclick="window.taskAction('delete')">
                <span class="action-icon">🗑️</span>
                <span class="action-label">Удалить безвозвратно</span>
            </div>
        `;
    }

    const modal = document.getElementById('action-modal');
    if (modal) modal.classList.add('active');
}

window.closeActionModal = function () {
    const modal = document.getElementById('action-modal');
    if (modal) modal.classList.remove('active');
}

window.taskAction = function (action) {
    if (!window.currentActionTaskId) return;
    let tasks = getTasks();
    const taskIndex = tasks.findIndex(t => t.id === window.currentActionTaskId);
    if (taskIndex === -1) return;
    const task = tasks[taskIndex];

    if (action === 'delete') {
        if (confirm('Точно удалить эту задачу навсегда? Вы не сможете ее вернуть.')) {
            tasks.splice(taskIndex, 1);
        } else {
            return;
        }
    } else if (action === 'complete') {
        task.state = 'completed';
    } else if (action === 'hide') {
        task.state = task.state === 'hidden' ? 'active' : 'hidden';
    } else if (action === 'edit') {
        closeActionModal();
        openTaskModal(task.id);
        return;
    } else if (action === 'move') {
        // Move to NEXT occurrence (skip today)
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1); // We must start searching from tomorrow to avoid picking today again
        // Modifying findNextLessonDate start point temporarily...
        // The easiest way is to push the date forward manually. 
        // Let's do a custom loop here to find the next one strictly AFTER the current targetDate.
        let newDate = null;
        const parts = task.targetDate.split('.');
        const curD = new Date(new Date().getFullYear(), parseInt(parts[1]) - 1, parseInt(parts[0]));

        for (let offset = 1; offset < 28; offset++) {
            const checkDate = new Date(curD);
            checkDate.setDate(checkDate.getDate() + offset);

            const checkDayIdx = checkDate.getDay();
            const scheduleDayIdx = (checkDayIdx === 0) ? -1 : (checkDayIdx - 1);
            if (scheduleDayIdx < 0 || scheduleDayIdx > 5) continue;

            const dayData = scheduleData[scheduleDayIdx];
            const diffTime = Math.abs(checkDate - semesterStartDate);
            const weeksPassed = Math.floor(Math.floor(diffTime / (1000 * 60 * 60 * 24)) / 7);
            const simWeekType = (weeksPassed % 2 === 0) ? 'num' : 'den';

            const hasLesson = dayData.lessons.some(l =>
                l.subject === task.subject && (l.week === 'both' || l.week === simWeekType)
            );

            if (hasLesson) {
                newDate = checkDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'numeric' });
                break;
            }
        }

        if (newDate) {
            task.targetDate = newDate;
            task.state = 'active'; // Reset state if completed
            alert(`Задача перенесена на ${newDate}`);
        } else {
            alert("Следующая пара не найдена.");
        }
    }

    saveTasks(tasks);
    closeActionModal();
    renderSchedule();
}

function updateState() {
    try {
        const now = new Date();
        const nowMins = now.getHours() * 60 + now.getMinutes();
        const nowSecs = now.getSeconds();

        const realTimeDisplay = document.getElementById('real-time');
        const timerDisplay = document.getElementById('countdown-timer');
        const timerStatus = document.getElementById('timer-status');
        let timerText = "--:--";
        let statusText = "Ожидание";

        if (realTimeDisplay) {
            realTimeDisplay.textContent = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
        }

        const realDayIdx = now.getDay();

        // Calculate REAL week type purely based on today
        const diffTime = Math.abs(now - semesterStartDate);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const weeksPassed = Math.floor(diffDays / 7);
        const realWeekType = (weeksPassed % 2 === 0) ? 'num' : 'den';

        if (realDayIdx === 0) {
            timerText = "Chill";
            statusText = "Выходной";
        } else {
            const todayData = scheduleData[realDayIdx - 1]; // 1-6 mapping to 0-5
            if (todayData) {
                const validLessons = todayData.lessons.filter(l => l.week === 'both' || l.week === realWeekType);
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

                // Clear highlights visually everywhere for cleanliness
                document.querySelectorAll('.lesson-item').forEach(el => el.classList.remove('active-lesson'));

                // Only actually add highlight if the currently viewed card corresponds to today
                if (weekOffset === 0 && activeLesson) {
                    const activeEl = document.querySelector(`.lesson-item[data-day-index="${realDayIdx}"][data-time="${activeLesson.time}"]`);
                    if (activeEl) activeEl.classList.add('active-lesson');
                }

                if (activeLesson) {
                    let remainingMins = activeLesson.end - nowMins - 1;
                    let remainingSecs = 60 - nowSecs;
                    if (remainingSecs === 60) { remainingSecs = 0; remainingMins += 1; }
                    timerText = `${remainingMins}:${remainingSecs.toString().padStart(2, '0')}`;
                    statusText = "Пара";
                } else if (nextLesson) {
                    let remainingMins = nextLesson.start - nowMins - 1;
                    let remainingSecs = 60 - nowSecs;
                    if (remainingSecs === 60) { remainingSecs = 0; remainingMins += 1; }
                    timerText = `${remainingMins}:${remainingSecs.toString().padStart(2, '0')}`;
                    if (ranges.indexOf(nextLesson) === 0) {
                        statusText = "До пары";
                    } else {
                        statusText = "Конец перемены";
                    }
                } else {
                    if (ranges.length > 0 && nowMins >= ranges[ranges.length - 1].end) {
                        timerText = "00:00";
                        statusText = "На сегодня всё";
                    } else {
                        timerText = "--:--";
                        statusText = "Ожидание";
                    }
                }
            }
        }

        if (timerDisplay) timerDisplay.textContent = timerText;
        if (timerStatus) timerStatus.textContent = statusText;

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

// Expose to window for inline onclick HTML (since we're injecting HTML)
window.changeWeek = function (offset) {
    weekOffset += offset;
    // Remove holiday body classes before rendering
    document.body.className = '';
    renderSchedule();
    updateState();
}

window.resetWeek = function () {
    weekOffset = 0;
    document.body.className = '';
    renderSchedule();
    updateState();
}

// ======================== ANIMATED BACKGROUND ========================
window.userPhrases = [
    "Исаев лох", "Кабачки растут на пальмах", "Прянички вкусно",
    "У стен есть не только уши", "Грызть писюльки", "Олег дрова +79138557813",
    "Киррил", "СЕРЕГА ИСКИТИМ", "У тебя есть подмышки?",
    "Если у меня одна бровь меня депортируют?", "Уфф какие цыпочки в нашем санатории",
    "Жирафы - бессердечные создания", "продам гараж"
];

function initAnimatedBackground() {
    const bgContainer = document.getElementById('animated-bg');
    if (!bgContainer) return;

    // The repeated background string requested by the user
    // We apply strong padding to separate words
    const repeatedString = "НПЭК&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;".repeat(150);

    const numRows = 99; // Amount of text lines for high density
    let html = '';

    for (let i = 0; i < numRows; i++) {
        // Alternate scroll direction for every row
        const dirClass = (i % 2 === 0) ? 'scroll-left' : 'scroll-right';
        html += `<div class="bg-text-line ${dirClass}">${repeatedString}</div>`;
    }

    bgContainer.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', () => {
    // Quick Fix: Rewrite HTML structure for top bar
    const statusPanel = document.querySelector('.status-panel');
    const header = document.querySelector('.header');

    if (statusPanel) {
        statusPanel.className = 'top-bar-container';
        statusPanel.innerHTML = `
            <div class="top-bar" id="header-curtain-area">
                <div class="header-left">
                    <div class="title-row" style="display: flex; align-items: baseline; gap: 10px;">
                        <h1 class="title">Расписание</h1>
                        <div class="week-info" id="week-info-label"></div>
                    </div>
                    <span id="hero-quote" style="font-size: 0.78rem; color: #555; font-style: italic; transition: opacity 0.5s ease; opacity: 1; flex-shrink: 1; min-width: 0; white-space: normal; line-height: 1.2; text-align: left;"></span>
                </div>
                <div class="status-right">
                    <div id="weather-widget" class="weather-widget" title="Погода на завтра (Новосибирск, ул. Титова, 14)">
                        🌦 Загрузка погоды...
                    </div>
                    <div class="timer-container weather-widget">
                        <div style="display: flex; align-items: baseline; gap: 8px; justify-content: flex-end;">
                            <span id="countdown-timer" class="countdown-timer" style="font-size: 1.5rem; font-weight: 800; color: #fff;">--:--</span>
                        </div>
                        <div style="font-size: 0.72rem; color: #aaa; display: flex; gap: 6px; justify-content: flex-end; margin-top: 2px;">
                            <span id="timer-status">--</span>
                            <span id="real-time" class="real-time" style="color: #666; font-size: 0.8rem; margin-left: 4px;">--:--</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="week-nav" id="nav-curtain-area">
                <button class="week-btn add-task-top-btn" onclick="window.openTaskModal()">+ Заметка</button>
                <div class="nav-controls">
                    <button class="week-btn" onclick="window.changeWeek(-1)">← Пред.</button>
                    <button class="week-btn" onclick="window.resetWeek()">Текущая неделя</button>
                    <button class="week-btn" onclick="window.changeWeek(1)">След. →</button>
                </div>
            </div>

            <div class="collapse-wrapper-top">
                <button class="collapse-toggle-top" id="collapse-header-btn" onclick="window.toggleHeaderCollapse()">
                    <span id="collapse-icon">▲</span>
                </button>
            </div>
        `;
        // Remove old header if exists
        if (header) header.style.display = 'none';

        const modalsHtml = `
            <!-- Create/Edit Task Modal -->
            <div id="task-modal" class="modal-overlay">
                <div class="modal-box">
                    <div class="modal-title">Создать задачу</div>
                    <div class="form-group">
                        <label>Текст задачи:</label>
                        <input type="text" id="task-text" class="form-input" placeholder="Например: Сделать доклад...">
                    </div>
                    <div class="form-group">
                        <label>Предмет (Обязательно):</label>
                        <select id="task-subject" class="form-input"></select>
                    </div>
                    <div class="form-group">
                        <label>День недели:</label>
                        <select id="task-day" class="form-input"></select>
                    </div>
                    <div class="modal-actions">
                        <button class="btn btn-cancel" onclick="window.closeTaskModal()">Отмена</button>
                        <button class="btn btn-primary" onclick="window.saveTask()">Сохранить</button>
                    </div>
                </div>
            </div>

            <!-- Action Modal -->
            <div id="action-modal" class="modal-overlay">
                <div class="modal-box">
                    <div class="modal-title">Действия с задачей</div>
                    <div class="action-grid" id="action-grid-container">
                        <!-- Populated dynamically -->
                    </div>
                    <div class="modal-actions">
                        <button class="btn btn-cancel" onclick="window.closeActionModal()">Отмена</button>
                    </div>
                </div>
            </div>

            <!-- Global Admin Panel Modal -->
            <div id="global-admin-modal" class="modal-overlay">
                <div class="modal-box" style="max-width:520px">
                    <div class="modal-title">📌 Глобальные заметки</div>
                    <div class="form-group">
                        <label>Новая заметка:</label>
                        <input type="text" id="gn-text" class="form-input" placeholder="Текст заметки...">
                    </div>
                    <div class="form-group">
                        <label>Предмет:</label>
                        <select id="gn-subject" class="form-input"></select>
                    </div>
                    <div class="form-group">
                        <label>День (или Ближайший):</label>
                        <select id="gn-day" class="form-input"></select>
                    </div>
                    <div style="margin-bottom:10px">
                        <button class="btn btn-primary" onclick="window.addGlobalNote()">+ Добавить в список</button>
                    </div>
                    <div id="global-notes-list" style="margin-bottom:12px;max-height:160px;overflow-y:auto"></div>
                    <hr style="border-color:#333;margin:10px 0">
                    <div class="form-group">
                        <label>GitHub репозиторий (owner/repo):</label>
                        <input type="text" id="gn-repo" class="form-input" placeholder="username/repo">
                    </div>
                    <div class="form-group">
                        <label>GitHub Token (PAT с repo scope):</label>
                        <input type="password" id="gn-token" class="form-input" placeholder="ghp_...">
                    </div>
                    <div class="modal-actions">
                        <button class="btn btn-cancel" onclick="window.closeGlobalAdminPanel()">Отмена</button>
                        <button class="btn btn-primary" onclick="window.saveGlobalNotes()">💾 Опубликовать</button>
                    </div>
                    <div style="margin-top: 10px;">
                        <button class="btn btn-primary" style="width: 100%; background: #4a90e2;" onclick="window.openScheduleAdminPanel()">📅 Редактор Расписания</button>
                    </div>
                    <div style="margin-top: 10px;">
                        <button class="btn btn-cancel" style="width: 100%; background: rgba(255,0,0,0.1); color: #ff5555; border-color: rgba(255,0,0,0.2);" onclick="window.logoutAdmin()">🙈 Скрыть панель (разлогиниться)</button>
                    </div>
                </div>
            </div>

            <!-- Global Schedule Admin Modal -->
            <div id="schedule-admin-modal" class="modal-overlay">
                <div class="modal-box" style="max-width:800px; width:95%">
                    <div class="modal-title">✏️ Редактор Расписания</div>
                    
                    <div class="form-group" style="display: flex; gap: 15px; margin-bottom: 12px; align-items: flex-end;">
                        <div style="flex: 1;">
                            <label>Тип изменения:</label>
                            <select id="sa-type" class="form-input" onchange="window.toggleAdminScheduleMode()">
                                <option value="permanent">Постоянное (шаблон по дню недели)</option>
                                <option value="override">На один день (разовая замена)</option>
                            </select>
                        </div>
                        <div id="sa-day-container" style="flex: 1;">
                            <label>День недели:</label>
                            <select id="sa-day-select" class="form-input" onchange="window.renderScheduleAdminList()"></select>
                        </div>
                        <div id="sa-date-container" style="flex: 1; display: none;">
                            <label>Дата (дд.мм):</label>
                            <input type="text" id="sa-date-input" class="form-input" placeholder="н-р: 15.03" oninput="window.renderScheduleAdminList()">
                        </div>
                    </div>

                    <div id="schedule-admin-list" style="margin-bottom:12px; max-height:400px; overflow-y:auto; border: 1px solid #444; padding: 10px; border-radius: 6px; background: rgba(0,0,0,0.2);">
                        <!-- Populate with lessons for selected day -->
                    </div>
                    
                    <div style="display: flex; gap: 10px; margin-bottom:10px">
                        <button class="btn btn-primary" style="flex: 1" onclick="window.addScheduleAdminRow()">+ Добавить пару</button>
                    </div>

                    <div class="form-group" style="display: flex; gap: 10px; margin-bottom: 12px; background: rgba(255,255,255,0.03); padding: 10px; border-radius: 6px; border: 1px solid #333;">
                        <div style="flex: 1.5;">
                            <label style="font-size: 0.75rem;">GitHub Token:</label>
                            <input type="password" id="sa-token" class="form-input" placeholder="ghp_xxx" style="font-size: 0.8rem; padding: 6px;">
                        </div>
                        <div style="flex: 1;">
                            <label style="font-size: 0.75rem;">Repo (user/repo):</label>
                            <input type="text" id="sa-repo" class="form-input" placeholder="Maciia/SiteNPEK" style="font-size: 0.8rem; padding: 6px;">
                        </div>
                    </div>

                    <hr style="border-color:#333;margin:10px 0">
                    <p style="font-size:0.8rem; color:#888; margin-bottom: 8px;"><b>Важно:</b> Постоянные изменения учитывают числитель/знаменатель. Одноразовые перекрывают всё расписание на этот день.</p>
                    <div class="modal-actions">
                        <button class="btn btn-cancel" onclick="window.closeScheduleAdminPanel()">Отмена</button>
                        <button class="btn btn-primary" onclick="window.saveGlobalSchedule()">💾 Опубликовать всё</button>
                    </div>
                    <div style="margin-top: 10px;">
                        <button class="btn btn-cancel" style="width: 100%; background: rgba(255,0,0,0.1); color: #ff5555; border-color: rgba(255,0,0,0.2);" onclick="window.logoutAdmin()">🙈 Скрыть панель (разлогиниться)</button>
                    </div>
                </div>
            </div>

            <!-- Project Info Footer -->
            <div style="margin: 20px auto; max-width: 600px; padding: 0 15px; color: #666; font-size: 0.8rem; text-align: center; line-height: 1.4;">
                <p>🚀 <b>Что нового:</b> поддержка числителя/знаменателя, замен на один день и разделения групп (разделитель //). Под капотом — скрытая админ-панель для контроля контента.</p>
                <p style="margin-top: 6px; opacity: 0.7;">Используется в личных и групповых целях. Копирование не запрещается, но не наглейте.</p>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalsHtml);

        // We need to patch renderSchedule to update the week-info-label and hidden tasks button
        const originalRender = renderSchedule;
        renderSchedule = function () {
            originalRender();

            // 1. Update Week Label
            const label = document.getElementById('week-info-label');
            if (label) {
                let text = getWeekType() === 'den' ? 'Знаменатель' : 'Числитель';
                if (weekOffset !== 0) {
                    text += ` (${weekOffset > 0 ? '+' : ''}${weekOffset} нед.)`;
                }
                label.textContent = text;
            }

            // 2. Update Hidden Tasks Toggle Button
            const hiddenTasks = getTasks().filter(t => t.state === 'hidden');
            let hiddenBtn = document.getElementById('toggle-hidden-btn');

            if (!hiddenBtn) {
                hiddenBtn = document.createElement('button');
                hiddenBtn.id = 'toggle-hidden-btn';
                hiddenBtn.className = 'week-btn';
                hiddenBtn.style.marginLeft = '10px';
                hiddenBtn.style.background = 'transparent';
                hiddenBtn.style.borderColor = '#444';
                hiddenBtn.onclick = function () { window.toggleHiddenTasks(); };

                const navControls = document.querySelector('.nav-controls');
                if (navControls) navControls.appendChild(hiddenBtn);
            }

            if (hiddenTasks.length > 0) {
                hiddenBtn.style.display = 'inline-block';
                hiddenBtn.textContent = window.showHidden ? 'Скрыть архив' : `Скрытые (${hiddenTasks.length})`;
            } else {
                hiddenBtn.style.display = 'none';
                window.showHidden = false;
            }
        };
    }

    // Toggle Header Area Collapse Logic
    window.toggleHeaderCollapse = function () {
        const curtain = document.getElementById('header-curtain-area');
        const nav = document.getElementById('nav-curtain-area');
        const icon = document.getElementById('collapse-icon');
        const container = document.querySelector('.top-bar-container');
        
        const isCollapsed = curtain.classList.toggle('header-collapsed');
        if (nav) nav.classList.toggle('nav-shutter-mode', isCollapsed);
        if (container) container.classList.toggle('container-shutter-mode', isCollapsed);
        
        if (icon) {
            icon.textContent = isCollapsed ? '▼' : '▲';
        }
        
        // Save state
        localStorage.setItem('npek_header_collapsed', isCollapsed);
    };

    // Restore collapse state
    if (localStorage.getItem('npek_header_collapsed') === 'true') {
        setTimeout(() => window.toggleHeaderCollapse(), 100);
    }

    // ----- Admin button helper -----
    window.showAdminButton = function () {
        let adminBtn = document.getElementById('global-admin-btn');
        if (!adminBtn) {
            adminBtn = document.createElement('button');
            adminBtn.id = 'global-admin-btn';
            adminBtn.className = 'week-btn';
            adminBtn.textContent = '📌 Глоб. заметка';
            adminBtn.onclick = function () {
                // Populate subject and day selects in admin panel
                const gnSubj = document.getElementById('gn-subject');
                const gnDay = document.getElementById('gn-day');
                if (gnSubj && !gnSubj.options.length) {
                    const subjects = new Set();
                    scheduleData.forEach(d => d.lessons.forEach(l => { if (l.subject) subjects.add(l.subject); }));
                    gnSubj.innerHTML = Array.from(subjects).map(s => `<option value="${s}">${s}</option>`).join('');
                }
                if (gnDay && !gnDay.options.length) {
                    gnDay.innerHTML = `<option value="">— Ближайший —</option>` +
                        daysOfWeek.slice(1).map(d => `<option value="${d}">${d}</option>`).join('');
                }
                // Restore saved token/repo
                const savedToken = localStorage.getItem('npek_gh_token');
                const savedRepo = localStorage.getItem('npek_gh_repo') || DEFAULT_REPO;
                if (savedToken) document.getElementById('gn-token').value = savedToken;
                document.getElementById('gn-repo').value = savedRepo;
                window.openGlobalAdminPanel();
            };
            const navControls = document.querySelector('.nav-controls');
            if (navControls) {
                navControls.appendChild(adminBtn);
            }
        }
        adminBtn.style.display = 'inline-block';
    };

    renderSchedule();
    loadGlobalNotes(); // Fetch and render global notes from JSON file
    loadGlobalSchedule(); // Fetch global schedule from JSON file
    fetchWeather(); // Load weather for tomorrow
    initAnimatedBackground(); // Generate diagonal scrolling background

    // --- UI Oscillators (Decoupled from quotes) ---
    window.currentGroupMember = 1;
    setInterval(() => {
        window.currentGroupMember = (window.currentGroupMember === 1) ? 2 : 1;
        document.querySelectorAll('.group-oscillator').forEach(el => {
            const t = el.querySelector('.lesson-teacher');
            const r = el.querySelector('.lesson-room');
            if (t && r) {
                t.style.opacity = 0; r.style.opacity = 0;
                setTimeout(() => {
                    t.textContent = (window.currentGroupMember === 1) ? el.dataset.t1 : el.dataset.t2;
                    r.textContent = (window.currentGroupMember === 1) ? el.dataset.r1 : el.dataset.r2;
                    t.style.opacity = 1; r.style.opacity = 1;
                }, 500);
            }
        });
    }, 4200);

    window.currentHolidayMember = 1;
    setInterval(() => {
        window.currentHolidayMember = (window.currentHolidayMember === 1) ? 2 : 1;
        document.querySelectorAll('.holiday-oscillator').forEach(el => {
            const span = el.querySelector('.oscillator-text');
            if (span) {
                span.style.opacity = 0;
                setTimeout(() => {
                    span.textContent = (window.currentHolidayMember === 1) ? el.dataset.l1 : el.dataset.l2;
                    span.style.opacity = 1;
                }, 500);
            }
        });
    }, 3800);

    // Setup hero quote rotation
    const heroQuoteEl = document.getElementById('hero-quote');
    if (heroQuoteEl && window.userPhrases && window.userPhrases.length > 0) {
        let quoteIdx = 0;
        const shuffle = (arr) => {
            let s = [...arr];
            for (let i = s.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [s[i], s[j]] = [s[j], s[i]];
            }
            return s;
        };
        const quotesList = shuffle(window.userPhrases);

        const updateQuote = () => {
            heroQuoteEl.style.opacity = 0;
            setTimeout(() => {
                heroQuoteEl.textContent = '"' + quotesList[quoteIdx] + '"';
                heroQuoteEl.style.opacity = 1;
                quoteIdx = (quoteIdx + 1) % quotesList.length;
            }, 500);
        };
        setInterval(updateQuote, 5500);
    }

    // Show admin button if already unlocked
    if (isAdmin()) window.showAdminButton();

    const prev = document.getElementById('prev-day');
    const next = document.getElementById('next-day');
    if (prev) prev.addEventListener('click', () => switchMobileDay(-1));
    if (next) next.addEventListener('click', () => switchMobileDay(1));

    // Swipe support on the schedule grid
    const grid = document.getElementById('schedule-grid');
    if (grid) {
        let touchStartX = 0;
        let touchStartY = 0;
        grid.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].clientX;
            touchStartY = e.changedTouches[0].clientY;
        }, { passive: true });
        grid.addEventListener('touchend', e => {
            const dx = e.changedTouches[0].clientX - touchStartX;
            const dy = e.changedTouches[0].clientY - touchStartY;
            // Only trigger swipe if horizontal movement > 50px and NOT mostly vertical
            if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
                if (dx < 0) switchMobileDay(1);  // swipe left → next day
                else switchMobileDay(-1); // swipe right → prev day
            }
        }, { passive: true });
    }

    setInterval(updateState, 1000);
    updateState();
});

// ======================== SCHEDULE ADMIN LOGIC ========================
window.currentAdminLessons = [];

window.openScheduleAdminPanel = function () {
    const daySelect = document.getElementById('sa-day-select');
    if (daySelect && !daySelect.options.length) {
        daySelect.innerHTML = daysOfWeek.slice(1).map((d, i) => `<option value="${i}">${d}</option>`).join('');
    }
    const today = new Date();
    const dateStr = today.toLocaleDateString('ru-RU', { day: 'numeric', month: 'numeric' });
    document.getElementById('sa-date-input').value = dateStr;

    // Load credentials from localStorage
    const savedToken = localStorage.getItem('npek_gh_token');
    const savedRepo = localStorage.getItem('npek_gh_repo');
    if (savedToken) document.getElementById('sa-token').value = savedToken;
    document.getElementById('sa-repo').value = savedRepo || DEFAULT_REPO;
    
    window.renderScheduleAdminList();
    document.getElementById('schedule-admin-modal').classList.add('active');
};

window.closeScheduleAdminPanel = function () {
    document.getElementById('schedule-admin-modal').classList.remove('active');
};

window.toggleAdminScheduleMode = function() {
    const type = document.getElementById('sa-type').value;
    document.getElementById('sa-day-container').style.display = (type === 'permanent') ? 'block' : 'none';
    document.getElementById('sa-date-container').style.display = (type === 'override') ? 'block' : 'none';
    window.renderScheduleAdminList();
};

window.renderScheduleAdminList = function () {
    const type = document.getElementById('sa-type').value;
    if (type === 'permanent') {
        const dayIdx = parseInt(document.getElementById('sa-day-select').value);
        window.currentAdminLessons = JSON.parse(JSON.stringify(scheduleData[dayIdx].lessons));
    } else {
        const dateKey = document.getElementById('sa-date-input').value.trim();
        const existing = window.scheduleOverrides[dateKey];
        if (existing) {
            window.currentAdminLessons = JSON.parse(JSON.stringify(existing));
        } else {
            // Smart Template: find what day of week this date is
            try {
                const parts = dateKey.split('.');
                const dateObj = new Date(new Date().getFullYear(), parseInt(parts[1]) - 1, parseInt(parts[0]));
                const dIdx = dateObj.getDay(); // 0 is Sunday
                if (dIdx > 0 && dIdx <= 6) {
                    window.currentAdminLessons = JSON.parse(JSON.stringify(scheduleData[dIdx - 1].lessons));
                } else {
                    window.currentAdminLessons = [];
                }
            } catch (e) {
                window.currentAdminLessons = [];
            }
        }
    }
    window.refreshAdminLessonRows();
};

window.refreshAdminLessonRows = function() {
    const list = document.getElementById('schedule-admin-list');
    if (!list) return;

    if (window.currentAdminLessons.length === 0) {
        list.innerHTML = '<div style="color:#888; text-align:center; padding: 20px;">Нет пар. Нажмите «Добавить пару», чтобы начать.</div>';
        return;
    }

    list.innerHTML = window.currentAdminLessons.map((l, i) => `
        <div class="lesson-admin-row" style="display: flex; gap: 8px; margin-bottom: 10px; flex-wrap: wrap; background: rgba(255,255,255,0.05); padding: 8px; border-radius: 4px;">
            <input type="text" placeholder="№" style="width: 30px;" value="${l.id || ''}" oninput="window.updateAdminRow(${i}, 'id', this.value)">
            <input type="text" placeholder="Время" style="width: 90px;" value="${l.time || ''}" oninput="window.updateAdminRow(${i}, 'time', this.value)">
            <input type="text" placeholder="Предмет" style="flex: 2; min-width: 120px;" value="${l.subject || ''}" oninput="window.updateAdminRow(${i}, 'subject', this.value)">
            <input type="text" placeholder="Препод" style="flex: 1; min-width: 100px;" value="${l.teacher || ''}" oninput="window.updateAdminRow(${i}, 'teacher', this.value)">
            <input type="text" placeholder="Каб" style="width: 50px;" value="${l.room || ''}" oninput="window.updateAdminRow(${i}, 'room', this.value)">
            <select style="width: 100px;" onchange="window.updateAdminRow(${i}, 'week', this.value)">
                <option value="both" ${l.week==='both'?'selected':''}>Обе</option>
                <option value="num" ${l.week==='num'?'selected':''}>Числитель</option>
                <option value="den" ${l.week==='den'?'selected':''}>Знаменатель</option>
            </select>
            <button class="btn btn-cancel" style="padding: 2px 8px;" onclick="window.removeScheduleAdminRow(${i})">✕</button>
        </div>
    `).join('');
};

window.updateAdminRow = function(idx, field, val) {
    if (field === 'id') window.currentAdminLessons[idx][field] = parseInt(val) || 1;
    else window.currentAdminLessons[idx][field] = val;
};

window.addScheduleAdminRow = function() {
    const lastId = window.currentAdminLessons.length > 0 ? window.currentAdminLessons[window.currentAdminLessons.length-1].id : 0;
    window.currentAdminLessons.push({ id: lastId + 1, time: '', subject: '', teacher: '', room: '', week: 'both' });
    window.refreshAdminLessonRows();
};

window.removeScheduleAdminRow = function(idx) {
    window.currentAdminLessons.splice(idx, 1);
    window.refreshAdminLessonRows();
};

window.saveGlobalSchedule = async function () {
    const token = document.getElementById('sa-token').value.trim();
    const repoInput = document.getElementById('sa-repo').value.trim();
    if (!token || !repoInput) { alert('Введите GitHub токен и репозиторий!'); return; }

    const type = document.getElementById('sa-type').value;
    
    // Prepare data
    let finalSchedule = JSON.parse(JSON.stringify(scheduleData));
    let finalOverrides = JSON.parse(JSON.stringify(window.scheduleOverrides));

    if (type === 'permanent') {
        const dayIdx = parseInt(document.getElementById('sa-day-select').value);
        finalSchedule[dayIdx].lessons = window.currentAdminLessons;
    } else {
        const dateKey = document.getElementById('sa-date-input').value.trim();
        if (!dateKey) { alert('Введите дату!'); return; }
        if (window.currentAdminLessons.length === 0) {
            delete finalOverrides[dateKey];
        } else {
            finalOverrides[dateKey] = window.currentAdminLessons;
        }
    }

    const content = JSON.stringify({ schedule: finalSchedule, overrides: finalOverrides }, null, 2);
    const encoded = btoa(unescape(encodeURIComponent(content)));

    try {
        const getResp = await fetch(`https://api.github.com/repos/${repoInput}/contents/globalSchedule.json`, {
            headers: { 'Authorization': `token ${token}`, 'Accept': 'application/vnd.github.v3+json' }
        });
        let sha = '';
        if (getResp.ok) {
            const fileData = await getResp.json();
            sha = fileData.sha;
        }

        const putResp = await fetch(`https://api.github.com/repos/${repoInput}/contents/globalSchedule.json`, {
            method: 'PUT',
            headers: { 'Authorization': `token ${token}`, 'Content-Type': 'application/json', 'Accept': 'application/vnd.github.v3+json' },
            body: JSON.stringify({ message: 'Обновление расписания и замен', content: encoded, sha })
        });

        if (putResp.ok) {
            scheduleData = finalSchedule;
            window.scheduleOverrides = finalOverrides;
            localStorage.setItem('npek_global_schedule', JSON.stringify(scheduleData));
            localStorage.setItem('npek_global_overrides', JSON.stringify(window.scheduleOverrides));
            localStorage.setItem('npek_gh_token', token);
            localStorage.setItem('npek_gh_repo', repoInput);
            alert('✅ Расписание успешно обновлено в GitHub!');
            window.closeScheduleAdminPanel();
            renderSchedule();
        } else {
            const err = await putResp.json();
            alert('Ошибка GitHub API: ' + (err.message || putResp.status));
        }
    } catch (e) {
        alert('Ошибка сети: ' + e.message);
    }
};
