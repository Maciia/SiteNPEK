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

const scheduleData = [
    {
        day: "Понедельник",
        lessons: [
            { id: 0, time: "8.30 – 8.55", subject: "Классный час", teacher: "", room: "", week: "both" },
            { id: 1, time: "9.00 – 10.30", subject: "Физ-ра", teacher: "Матвей Андреевич", room: "т.з.", week: "both" },
            { id: 2, time: "10.40 – 12.10", subject: "Физика", teacher: "Александр Алексеевич", room: "41", week: "both" },
            // Based on image: Ин. язык (Гурджиева 45а / Воронович 55а) is 3rd lesson.
            { id: 3, time: "12.40 – 14.10", subject: "Ин. язык", teacher: "Замира Шамсадинова", room: "45а", week: "both", isGroup: true, secondTeacher: "Воронович", secondRoom: "55а" },
            // Also adding 4th and 5th lesson times from the bell schedule so timer works if they existed
            // { id: 4, time: "15.00 – 16.30", subject: "", teacher: "", room: "", week: "both" },
            // { id: 5, time: "16.40 – 18.10", subject: "", teacher: "", room: "", week: "both" }
        ]
    },
    {
        day: "Вторник",
        lessons: [
            { id: 1, time: "8.30 – 10.00", subject: "Матем.", teacher: "Елена Александровна", room: "42", week: "both" },
            { id: 2, time: "10.15 – 11.45", subject: "Русс.яз", teacher: "Наталья Анатольевна", room: "47", week: "both" },
            { id: 3, time: "12.20 – 13.50", subject: "Лит-ра", teacher: "Наталья Анатольевна", room: "47", week: "both" }
        ]
    },
    {
        day: "Среда",
        lessons: [
            { id: 1, time: "8.30 – 10.00", subject: "История", teacher: "Марина Геннадьевна", room: "49", week: "both" },
            { id: 2, time: "10.15 – 11.45", subject: "Инф-ка", teacher: "Максим Сергеевич", room: "48", week: "both" },
            { id: 3, time: "12.20 – 13.50", subject: "Физика", teacher: "Александр Алексеевич", room: "41", week: "both" }
        ]
    },
    {
        day: "Четверг",
        lessons: [
            { id: 1, time: "8.30 – 10.00", subject: "Биология", teacher: "", room: "", week: "num" },
            { id: 1, time: "8.30 – 10.00", subject: "Литер.", teacher: "Наталья Анатольевна", room: "47", week: "den" },
            { id: 2, time: "10.15 – 11.45", subject: "Матем.", teacher: "Елена Александровна", room: "42", week: "both" },
            { id: 3, time: "12.20 – 13.50", subject: "История", teacher: "Марина Геннадьевна", room: "49", week: "num" },
            { id: 3, time: "12.20 – 13.50", subject: "География", teacher: "Татьяна Викторовна", room: "42а", week: "den" },
            { id: 4, time: "14.00 – 15.30", subject: "Инф-ка", teacher: "Максим Сергеевич", room: "48", week: "both" }
        ]
    },
    {
        day: "Пятница",
        lessons: [
            { id: 1, time: "8.30 – 10.00", subject: "Физ-ра", teacher: "Матвей Андреевич", room: "с.з.", week: "den" },
            { id: 2, time: "10.15 – 11.45", subject: "ОБЗР", teacher: "Олег Геннадьевич", room: "32", week: "both" },
            { id: 3, time: "12.20 – 13.50", subject: "Инф-ка", teacher: "Максим Сергеевич", room: "48", week: "both" }
        ]
    },
    {
        day: "Суббота",
        lessons: [
            { id: 1, time: "8.30 – 10.00", subject: "Матем.", teacher: "Елена Александровна", room: "42", week: "both" },
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

        // Highlight today only if weekOffset is 0
        if (index === mobileDayIndex && weekOffset === 0) card.classList.add('mobile-active');
        if ((index + 1) === renderCurrentDay && weekOffset === 0) card.classList.add('today');

        // Holiday Check
        const isHoliday = checkHolidayThemes(card, cardDate);

        card.innerHTML = `
            <div class="day-header">
                <div class="day-title-col">
                    <span class="day-name">${dayData.day}</span>
                    <span class="day-date">${cardDateStr}</span>
                </div>
                <span class="day-badge">${((index + 1) === renderCurrentDay && weekOffset === 0) ? 'Сегодня' : ''}</span>
            </div>
            <ul class="lesson-list"></ul>
        `;

        const list = card.querySelector('.lesson-list');


        if (isHoliday) {
            const item = document.createElement('li');
            item.className = 'lesson-item holiday-item';
            item.innerHTML = `<div class="lesson-content"><div class="lesson-subject">Выходной день</div></div>`;
            list.appendChild(item);
        } else {
            dayData.lessons.forEach(lesson => {
                if (lesson.week !== 'both' && lesson.week !== getWeekType()) return;

                const item = document.createElement('li');
                item.className = 'lesson-item';

                item.dataset.time = lesson.time;
                item.dataset.dayIndex = index + 1;

                let subject = lesson.subject;
                let teacher = lesson.teacher || '';
                let rawRoom = lesson.room || '';
                let room = rawRoom ? `каб. ${rawRoom}` : '';

                if (lesson.isGroup) {
                    teacher += ` / ${lesson.secondTeacher}`;
                    room += ` / каб. ${lesson.secondRoom}`;
                }

                // Render tasks for this lesson
                const tasksHtml = renderLessonTasks(subject, cardDateStr);

                item.innerHTML = `
                    <div class="lesson-number">${lesson.id}</div>
                    <div class="lesson-content">
                        <div class="lesson-subject">${subject}</div>
                         <div class="lesson-details">
                            <span class="lesson-teacher">${teacher}</span>
                            <span class="lesson-room">${room}</span>
                        </div>
                        ${tasksHtml}
                    </div>
                    <div class="lesson-time-col">
                       <div class="lesson-time">${lesson.time}</div>
                    </div>
                `;
                list.appendChild(item);
            });
        }

        container.appendChild(card);
    });

    const navLabel = document.getElementById('current-day-label');
    if (navLabel && scheduleData[mobileDayIndex]) {
        navLabel.textContent = scheduleData[mobileDayIndex].day;
    }

    // Fix week-switch bug: re-apply mobile-active after full re-render
    document.querySelectorAll('.day-card').forEach((card, i) => {
        card.classList.toggle('mobile-active', i === mobileDayIndex);
    });
}

function checkHolidayThemes(cardEl, dateObj) {
    const d = dateObj.getDate();
    const m = dateObj.getMonth() + 1;
    const dateStr = `${d < 10 ? '0' + d : d}.${m < 10 ? '0' + m : m}`;

    const holidays = [
        { date: '23.02', name: 'День защитника Отечества', theme: 'theme-defender' },
        { date: '08.03', name: 'Международный женский день', theme: 'theme-womens' },
        { date: '01.05', name: 'Праздник Весны и Труда', theme: 'theme-spring' },
        { date: '09.05', name: 'День Победы', theme: 'theme-victory' },
        { date: '31.12', name: 'Новый год', theme: 'theme-newyear' },
        { date: '01.01', name: 'Новый год', theme: 'theme-newyear' }
    ];

    const hol = holidays.find(h => h.date === dateStr);
    if (hol) {
        cardEl.classList.add(hol.theme);
        // Also check if today is ACTUALLY this holiday to apply it to the whole body
        const today = new Date();
        const tD = today.getDate();
        const tM = today.getMonth() + 1;
        if (d === tD && m === tM && weekOffset === 0) {
            document.body.classList.add(hol.theme + '-body');
        }
        return true;
    }
    return false;
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
const DEFAULT_REPO  = 'Maciia/SiteNPEK';

function isAdmin() {
    return localStorage.getItem('npek_admin') === '1';
}

function setAdmin() {
    localStorage.setItem('npek_admin', '1');
}

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
    } catch (e) {}
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

function getGlobalNotesForLesson(subject, dateStr) {
    return window.globalNotes.filter(n => n.subject === subject && n.targetDate === dateStr);
}

// ---- Admin Panel UI ----
window.openGlobalAdminPanel = function() {
    document.getElementById('global-admin-modal').classList.add('active');
    renderGlobalNotesList();
}

window.closeGlobalAdminPanel = function() {
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

window.deleteGlobalNote = function(idx) {
    window.globalNotes.splice(idx, 1);
    saveGlobalNotesCache();
    renderGlobalNotesList();
    renderSchedule();
}

window.addGlobalNote = function() {
    const text  = document.getElementById('gn-text').value.trim();
    const subj  = document.getElementById('gn-subject').value;
    const day   = document.getElementById('gn-day').value;
    if (!text) { alert('Введите текст заметки!'); return; }
    const targetDate = findNextLessonDate(subj, day);
    if (!targetDate) { alert('Предмет не найден в расписании!'); return; }
    window.globalNotes.push({ subject: subj, targetDate, text });
    document.getElementById('gn-text').value = '';
    saveGlobalNotesCache();
    renderGlobalNotesList();
    renderSchedule(); // Show note immediately under the lesson
}

window.saveGlobalNotes = async function() {
    // Auto-add any pending text from textarea before publishing
    const pendingText = document.getElementById('gn-text')?.value.trim();
    const pendingSubj = document.getElementById('gn-subject')?.value;
    const pendingDay  = document.getElementById('gn-day')?.value;
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

        if (realTimeDisplay) {
            realTimeDisplay.textContent = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
        }

        const realDayIdx = now.getDay();

        // Calculate REAL week type purely based on today
        const diffTime = Math.abs(now - semesterStartDate);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const weeksPassed = Math.floor(diffDays / 7);
        const realWeekType = (weeksPassed % 2 === 0) ? 'num' : 'den';

        let timerText = "--:--";
        let statusText = "Ожидание";

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
                } else if (nextLesson) {
                    let remainingMins = nextLesson.start - nowMins - 1;
                    let remainingSecs = 60 - nowSecs;
                    if (remainingSecs === 60) { remainingSecs = 0; remainingMins += 1; }
                    timerText = `${remainingMins}:${remainingSecs.toString().padStart(2, '0')}`;
                } else {
                    if (ranges.length > 0 && nowMins >= ranges[ranges.length - 1].end) {
                        timerText = "Домой";
                    } else {
                        timerText = "--:--";
                    }
                }
            }
        }

        if (timerDisplay) timerDisplay.textContent = timerText;

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

document.addEventListener('DOMContentLoaded', () => {
    // Quick Fix: Rewrite HTML structure for top bar
    const statusPanel = document.querySelector('.status-panel');
    const header = document.querySelector('.header');

    if (statusPanel) {
        statusPanel.className = 'top-bar-container';
        statusPanel.innerHTML = `
            <div class="top-bar">
                <div class="header-left">
                    <h1 class="title">Расписание</h1>
                    <div class="week-info" id="week-info-label"></div>
                </div>
                <div class="status-right">
                    <div class="timer-container">
                        <span id="countdown-timer" class="countdown-timer">--:--</span>
                    </div>
                    <div id="real-time" class="real-time">--:--</div>
                </div>
            </div>
            <div class="week-nav">
                <button class="week-btn add-task-top-btn" onclick="window.openTaskModal()">+ Заметка</button>
                <div class="nav-controls">
                    <button class="week-btn" onclick="window.changeWeek(-1)">← Пред.</button>
                    <button class="week-btn" onclick="window.resetWeek()">Текущая неделя</button>
                    <button class="week-btn" onclick="window.changeWeek(1)">След. →</button>
                </div>
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
                </div>
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
                    text += ` (Сдвиг: ${weekOffset > 0 ? '+' : ''}${weekOffset} нед.)`;
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
                hiddenBtn.onclick = function() { window.toggleHiddenTasks(); };

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

    // ----- Admin button helper -----
    window.showAdminButton = function() {
        let adminBtn = document.getElementById('global-admin-btn');
        if (!adminBtn) {
            adminBtn = document.createElement('button');
            adminBtn.id = 'global-admin-btn';
            adminBtn.className = 'week-btn';
            adminBtn.textContent = '📌 Глоб. заметка';
            adminBtn.onclick = function() {
                // Populate subject and day selects in admin panel
                const gnSubj = document.getElementById('gn-subject');
                const gnDay  = document.getElementById('gn-day');
                if (gnSubj && !gnSubj.options.length) {
                    const subjects = new Set();
                    scheduleData.forEach(d => d.lessons.forEach(l => { if(l.subject) subjects.add(l.subject); }));
                    gnSubj.innerHTML = Array.from(subjects).map(s => `<option value="${s}">${s}</option>`).join('');
                }
                if (gnDay && !gnDay.options.length) {
                    gnDay.innerHTML = `<option value="">— Ближайший —</option>` +
                        daysOfWeek.slice(1).map(d => `<option value="${d}">${d}</option>`).join('');
                }
                // Restore saved token/repo
                const savedToken = localStorage.getItem('npek_gh_token');
                const savedRepo  = localStorage.getItem('npek_gh_repo') || DEFAULT_REPO;
                if (savedToken) document.getElementById('gn-token').value = savedToken;
                document.getElementById('gn-repo').value = savedRepo;
                window.openGlobalAdminPanel();
            };
            const navControls = document.querySelector('.nav-controls');
            if (navControls) navControls.appendChild(adminBtn);
        }
        adminBtn.style.display = 'inline-block';
    };

    renderSchedule();
    loadGlobalNotes(); // Fetch and render global notes from JSON file

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
                else        switchMobileDay(-1); // swipe right → prev day
            }
        }, { passive: true });
    }

    setInterval(updateState, 1000);
    updateState();
});
