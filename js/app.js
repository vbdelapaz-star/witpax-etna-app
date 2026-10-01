/**
 * WITPax ETNA Application Engine
 */

// Core State
let sampleRecords = [
    {
        code: 'WELD-2026-001',
        name: 'Marcus Vance',
        email: 'marcus.vance@techalpha.edu',
        inst: 'Institute of Tech Alpha',
        years: '4-7 Years',
        focus: 'GMAW/FCAW',
        classSize: 24,
        meanGap: 2.0,
        baselineScore: 80,
        obj: 'Master real-time Soldamatic telemetry diagnostics for MIG root passes.'
    },
    {
        code: 'WELD-2026-002',
        name: 'Elena Rostova',
        email: 'elena.r@skillsacademy.org',
        inst: 'National Skills Academy',
        years: '8-12 Years',
        focus: 'GTAW',
        classSize: 18,
        meanGap: 1.0,
        baselineScore: 90,
        obj: 'Align virtual grading parameters with ISO 9606 standards.'
    },
    {
        code: 'WELD-2026-003',
        name: 'David Kim',
        email: 'dkim@vocational-east.edu',
        inst: 'Vocational Center East',
        years: '1-3 Years',
        focus: 'SMAW',
        classSize: 30,
        meanGap: 2.2,
        baselineScore: 60,
        obj: 'Reduce raw material waste through virtual pre-practice.'
    }
];

let matrixTopics = [
    { id: 1, name: 'SMAW Joint Preparation & Technique', ability: 3, importance: 4 },
    { id: 2, name: 'GMAW Volts/WPS Parameter Tuning', ability: 2, importance: 5 },
    { id: 3, name: 'SEABERY Soldamatic Telemetry Analysis', ability: 2, importance: 5 },
    { id: 4, name: 'Pedagogical Competency Assessment', ability: 4, importance: 4 },
    { id: 5, name: 'GTAW Torch Angle & Distance Control', ability: 2, importance: 4 },
    { id: 6, name: 'Visual Defect Identification (AWS D1.1)', ability: 3, importance: 5 }
];

const quizQuestions = [
    { id: 1, text: 'What is the primary cause of undercut in Shielded Metal Arc Welding (SMAW)?', options: ['Arc length too short', 'Excessive current / travel speed too fast', 'Incorrect electrode polarity', 'Insufficient shielding gas'], correct: 1 },
    { id: 2, text: 'In Gas Metal Arc Welding (GMAW), what effect does increasing arc voltage have?', options: ['Narrows the weld bead', 'Widens and flattens the weld bead', 'Increases penetration depth significantly', 'Decreases wire feed speed'], correct: 1 },
    { id: 3, text: 'What shielding gas is most commonly used for GTAW (TIG) on carbon steel?', options: ['100% Carbon Dioxide (CO2)', '75% Argon / 25% CO2', '100% Argon', '90% Helium / 10% Argon'], correct: 2 },
    { id: 4, text: 'What parameter does the SEABERY Soldamatic vision tracking sensor continuously measure during travel?', options: ['Acoustic resonance', 'Travel angle, work angle, arc length, and speed', 'Ambient humidity', 'Electrode electrical resistance'], correct: 1 },
    { id: 5, text: 'Which welding position designation corresponds to a vertical groove weld according to AWS?', options: ['1G', '2G', '3G', '4G'], correct: 2 },
    { id: 6, text: 'What defect is most likely caused by inadequate shielding gas flow in GMAW?', options: ['Porosity', 'Slag inclusion', 'Excessive reinforcement', 'Underbead cracking'], correct: 0 },
    { id: 7, text: 'In SMAW welding with E7018 electrodes, what polarity is generally recommended?', options: ['DCEN (Direct Current Electrode Negative)', 'DCEP (Direct Current Electrode Positive)', 'AC only', 'Reverse Polarity AC'], correct: 1 },
    { id: 8, text: 'In simulator practice, what does a high variance in "work angle" telemetry indicate?', options: ['Consistent travel speed', 'Inconsistent hand positioning relative to joint faces', 'Optimal voltage setting', 'Proper arc gap control'], correct: 1 },
    { id: 9, text: 'What is the primary benefit of virtual simulator training prior to physical shop practice?', options: ['Eliminates need for live shop practice entirely', 'Accelerates muscle memory and reduces material scrap', 'Replaces instructor evaluations', 'Allows welding without PPE indefinitely'], correct: 1 },
    { id: 10, text: 'Which ISO standard governs the qualification testing of welders for fusion welding?', options: ['ISO 9001', 'ISO 9606', 'ISO 14001', 'ISO 45001'], correct: 1 }
];

let currentStep = 1;
let gapsChart = null;
let expChart = null;
let recordModalInstance = null;

// Routing Logic
function showView(targetId) {
    document.querySelectorAll('.app-view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.sidebar-nav .nav-link').forEach(l => l.classList.remove('active'));

    const targetView = document.getElementById(targetId);
    if (targetView) targetView.classList.add('active');

    const activeLink = document.querySelector(`[data-target="${targetId}"]`);
    if (activeLink) activeLink.classList.add('active');

    if (targetId === 'view-analytics') {
        renderAnalytics();
    } else if (targetId === 'view-report') {
        renderReport();
    }
}

function navigateTo(targetId) {
    showView(targetId);
}

// Stepper Logic
function goToStep(stepNum) {
    currentStep = stepNum;
    document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.step-btn').forEach(b => b.classList.remove('active'));

    const stepEl = document.querySelector(`.form-step[data-step="${stepNum}"]`);
    if (stepEl) stepEl.classList.add('active');

    const btns = document.querySelectorAll('.step-btn');
    if (btns[stepNum - 1]) btns[stepNum - 1].classList.add('active');

    const stepTitles = [
        'Part I: Personal & Professional Profile',
        'Part II: Current Teaching Assignment',
        'Part III: Technical Equipment Confidence',
        'Part IV: Simulator & Digital Experience',
        'Part V: Curriculum & Instructional Needs',
        'Part VI: Open Forum Expectations',
        'Part VII: Priority Gap Auto-Calculator',
        'Part VIII: Baseline Knowledge Check'
    ];

    document.getElementById('stepTitle').innerText = stepTitles[stepNum - 1];
    document.getElementById('stepBadge').innerText = `Step ${stepNum} of 8`;
    document.getElementById('formProgress').style.width = `${(stepNum / 8) * 100}%`;

    document.getElementById('btnPrev').disabled = (stepNum === 1);
    document.getElementById('btnNext').innerText = (stepNum === 8) ? 'Submit Assessment' : 'Next';
}

function changeStep(dir) {
    if (dir === 1 && !validateCurrentStep()) return;

    let next = currentStep + dir;
    if (next >= 1 && next <= 8) {
        goToStep(next);
    } else if (next > 8) {
        document.getElementById('assessmentForm').requestSubmit();
    }
}

function validateCurrentStep() {
    if (currentStep === 1) {
        const name = document.getElementById('partName').value.trim();
        const inst = document.getElementById('partInst').value.trim();
        if (!name || !inst) {
            alert('Please complete required fields: Full Name and Institution.');
            return false;
        }
    }
    return true;
}

// Matrix Calculator Logic
function renderMatrixTable() {
    const tbody = document.getElementById('matrixTableBody');
    tbody.innerHTML = matrixTopics.map((item, idx) => {
        let gap = item.importance - item.ability;
        let badgeClass = gap >= 2 ? 'gap-high' : (gap > 0 ? 'gap-med' : 'gap-low');
        let badgeText = gap >= 2 ? 'High Priority' : (gap > 0 ? 'Moderate' : 'Met');

        return `
            <tr>
                <td class="text-start fw-semibold">${item.name}</td>
                <td>
                    <select class="form-select form-select-sm" onchange="updateMatrix(${idx}, 'ability', this.value)">
                        ${[1,2,3,4,5].map(v => `<option value="${v}" ${v===item.ability?'selected':''}>${v}</option>`).join('')}
                    </select>
                </td>
                <td>
                    <select class="form-select form-select-sm" onchange="updateMatrix(${idx}, 'importance', this.value)">
                        ${[1,2,3,4,5].map(v => `<option value="${v}" ${v===item.importance?'selected':''}>${v}</option>`).join('')}
                    </select>
                </td>
                <td class="fw-bold fs-6">${gap > 0 ? '+'+gap : gap}</td>
                <td><span class="badge ${badgeClass}">${badgeText}</span></td>
            </tr>
        `;
    }).join('');
}

function updateMatrix(idx, field, val) {
    matrixTopics[idx][field] = parseInt(val);
    renderMatrixTable();
}

// Quiz Logic
function renderQuiz() {
    const container = document.getElementById('quizContainer');
    container.innerHTML = quizQuestions.map((q, idx) => `
        <div class="mb-4 pb-3 border-bottom">
            <h6 class="fw-bold text-navy mb-2">${idx + 1}. ${q.text}</h6>
            <div class="row g-2">
                ${q.options.map((opt, oIdx) => `
                    <div class="col-md-6">
                        <div class="form-check">
                            <input class="form-check-input quiz-opt" type="radio" name="quiz_q${q.id}" id="q${q.id}_opt${oIdx}" value="${oIdx}">
                            <label class="form-check-label small" for="q${q.id}_opt${oIdx}">${opt}</label>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

function scoreQuiz() {
    let score = 0;
    quizQuestions.forEach(q => {
        const selected = document.querySelector(`input[name="quiz_q${q.id}"]:checked`);
        if (selected && parseInt(selected.value) === q.correct) {
            score += 10;
        }
    });
    return score;
}

// Local Storage & Records Logic
function getStoredRecords() {
    const stored = localStorage.getItem('witpax_records');
    if (stored) {
        try { return JSON.parse(stored); } catch (e) { return sampleRecords; }
    }
    localStorage.setItem('witpax_records', JSON.stringify(sampleRecords));
    return sampleRecords;
}

function saveRecords(records) {
    localStorage.setItem('witpax_records', JSON.stringify(records));
    updateStorageStatus();
}

function renderRecords() {
    const records = getStoredRecords();
    const tbody = document.getElementById('recordsTbody');
    
    if (records.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted py-4">No assessment records found.</td></tr>`;
        return;
    }

    tbody.innerHTML = records.map((r, idx) => `
        <tr>
            <td><code>${r.code}</code></td>
            <td class="fw-semibold">${r.name}</td>
            <td>${r.inst}</td>
            <td>${r.years}</td>
            <td><span class="badge ${r.meanGap >= 2 ? 'bg-danger' : 'bg-warning text-dark'}">${r.meanGap.toFixed(1)}</span></td>
            <td><span class="badge bg-success">${r.baselineScore}%</span></td>
            <td class="text-end">
                <button class="btn btn-sm btn-outline-primary me-1" onclick="viewRecordDetail(${idx})"><i class="bi bi-eye"></i></button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteRecord(${idx})"><i class="bi bi-trash"></i></button>
            </td>
        </tr>
    `).join('');

    updateStorageStatus();
}

function filterRecords() {
    let query = document.getElementById('tableSearch').value.toLowerCase();
    document.querySelectorAll('#recordsTbody tr').forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(query) ? '' : 'none';
    });
}

function viewRecordDetail(idx) {
    const records = getStoredRecords();
    const r = records[idx];
    if (!r) return;

    document.getElementById('modalRecordTitle').innerText = `Participant Record: ${r.code}`;
    document.getElementById('modalRecordBody').innerHTML = `
        <div class="row g-3">
            <div class="col-md-6"><strong>Full Name:</strong> ${r.name}</div>
            <div class="col-md-6"><strong>Institution:</strong> ${r.inst}</div>
            <div class="col-md-6"><strong>Teaching Experience:</strong> ${r.years}</div>
            <div class="col-md-6"><strong>Primary Focus:</strong> ${r.focus}</div>
            <div class="col-md-6"><strong>Mean Priority Gap:</strong> ${r.meanGap}</div>
            <div class="col-md-6"><strong>Baseline Quiz Score:</strong> ${r.baselineScore}%</div>
            <div class="col-12 border-top pt-2"><strong>Open Forum Goal:</strong><br><p class="text-muted small">${r.obj || 'N/A'}</p></div>
        </div>
    `;

    if (!recordModalInstance) {
        recordModalInstance = new bootstrap.Modal(document.getElementById('recordModal'));
    }
    recordModalInstance.show();
}

function deleteRecord(idx) {
    if (confirm('Are you sure you want to delete this record?')) {
        let records = getStoredRecords();
        records.splice(idx, 1);
        saveRecords(records);
        renderRecords();
    }
}

// Form Submission
function handleFormSubmit(e) {
    e.preventDefault();

    const records = getStoredRecords();
    const totalGaps = matrixTopics.reduce((acc, curr) => acc + (curr.importance - curr.ability), 0);
    const meanGap = totalGaps / matrixTopics.length;
    const quizScore = scoreQuiz();

    const newRecord = {
        code: document.getElementById('partCode').value,
        name: document.getElementById('partName').value.trim(),
        email: document.getElementById('partEmail').value.trim(),
        inst: document.getElementById('partInst').value.trim(),
        years: document.getElementById('partYears').value,
        focus: document.getElementById('partFocus').value,
        classSize: parseInt(document.getElementById('classSize').value) || 20,
        meanGap: parseFloat(meanGap.toFixed(1)),
        baselineScore: quizScore,
        obj: document.getElementById('forumObj').value.trim() || 'N/A'
    };

    records.unshift(newRecord);
    saveRecords(records);
    renderRecords();

    alert('Assessment submitted successfully!');
    generateNewCode();
    goToStep(1);
    showView('view-records');
}

// Analytics Dashboard
function renderAnalytics() {
    const records = getStoredRecords();
    
    document.getElementById('kpiTotal').innerText = records.length;
    
    const avgScore = records.length ? Math.round(records.reduce((a, b) => a + b.baselineScore, 0) / records.length) : 0;
    document.getElementById('kpiBaseline').innerText = `${avgScore}%`;

    const highGaps = matrixTopics.filter(t => (t.importance - t.ability) >= 2).length;
    document.getElementById('kpiCriticalGaps').innerText = `${highGaps} Areas`;

    const noviceCount = records.filter(r => r.years === '1-3 Years').length;
    const novicePct = records.length ? Math.round((noviceCount / records.length) * 100) : 0;
    document.getElementById('kpiNovice').innerText = `${novicePct}%`;

    renderCharts(records);
}

function renderCharts(records) {
    if (gapsChart) gapsChart.destroy();
    if (expChart) expChart.destroy();

    const ctx1 = document.getElementById('chartPriorityGaps').getContext('2d');
    gapsChart = new Chart(ctx1, {
        type: 'bar',
        data: {
            labels: matrixTopics.map(t => t.name.split(' ')[0] + '...'),
            datasets: [{
                label: 'Priority Gap',
                data: matrixTopics.map(t => t.importance - t.ability),
                backgroundColor: '#2563eb'
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });

    const expCounts = { '1-3 Yrs': 0, '4-7 Yrs': 0, '8-12 Yrs': 0, '12+ Yrs': 0 };
    records.forEach(r => {
        if (expCounts[r.years] !== undefined) expCounts[r.years]++;
        else expCounts['4-7 Yrs']++;
    });

    const ctx2 = document.getElementById('chartExperience').getContext('2d');
    expChart = new Chart(ctx2, {
        type: 'doughnut',
        data: {
            labels: Object.keys(expCounts),
            datasets: [{
                data: Object.values(expCounts),
                backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6']
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

// Report Generation
function renderReport() {
    const records = getStoredRecords();
    const highGaps = matrixTopics.filter(t => (t.importance - t.ability) >= 2);

    document.getElementById('reportGapsList').innerHTML = highGaps.map(g => `
        <li><strong>${g.name}:</strong> Gap +${g.importance - g.ability} (High Priority)</li>
    `).join('') || `<li>No critical high-priority gaps found.</li>`;
}

// Data Export & Import
function exportDataJSON() {
    const records = getStoredRecords();
    const blob = new Blob([JSON.stringify(records, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `witpax_assessment_records_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
}

function exportDataCSV() {
    const records = getStoredRecords();
    if (!records.length) return alert('No records to export.');

    const headers = ['Code', 'Name', 'Email', 'Institution', 'Years Teaching', 'Primary Focus', 'Mean Gap', 'Baseline Score'];
    const rows = records.map(r => [r.code, `"${r.name}"`, r.email, `"${r.inst}"`, r.years, r.focus, r.meanGap, r.baselineScore]);
    
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `witpax_records_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function importDataJSON(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const imported = JSON.parse(e.target.result);
            if (Array.isArray(imported)) {
                saveRecords(imported);
                renderRecords();
                alert('Records imported successfully!');
            }
        } catch (err) {
            alert('Invalid JSON file format.');
        }
    };
    reader.readAsText(file);
}

function clearData() {
    if (confirm('Reset portal records to default sample data?')) {
        localStorage.removeItem('witpax_records');
        saveRecords(sampleRecords);
        renderRecords();
        alert('Portal data reset.');
    }
}

function updateStorageStatus() {
    const records = getStoredRecords();
    const count = records.length;
    document.getElementById('recordCountText').innerText = `${count} Records Stored`;
    const bar = document.getElementById('storageBar');
    if (bar) bar.style.width = `${Math.min(count * 10, 100)}%`;
}

function generateNewCode() {
    const randomId = Math.floor(100 + Math.random() * 900);
    document.getElementById('partCode').value = `WELD-2026-${randomId}`;
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-target]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            showView(link.getAttribute('data-target'));
        });
    });

    document.getElementById('sidebarToggle').addEventListener('click', () => {
        document.getElementById('appSidebar').classList.toggle('show');
    });

    generateNewCode();
    renderMatrixTable();
    renderQuiz();
    renderRecords();
});
