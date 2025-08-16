function getAgeString(birthDateStr) {
    const birth = new Date(birthDateStr);
    const now = new Date();
    if (birth > now) {
        return '0 дн. (всего 0 дней)';
    }
    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();
    if (days < 0) {
        months--;
        days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    }
    if (months < 0) {
        years--;
        months += 12;
    }
    const totalDays = Math.floor((now - birth) / (1000 * 60 * 60 * 24));
    let res = '';
    if (years > 0) res += years + ' г. ';
    if (months > 0) res += months + ' мес. ';
    res += days + ' дн.';
    res += ` (всего ${totalDays} дней)`;
    return res;
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    const childNameInput = document.getElementById('childNameInput');
    const birthDateInput = document.getElementById('birthDateInput');
    const saveChildDataButton = document.getElementById('saveChildData');
    const childNameSpan = document.getElementById('childName');
    const childBirthDateSpan = document.getElementById('childBirthDate');
    const childAgeSpan = document.getElementById('childAge');
    const childWeightSpan = document.getElementById('childWeight');
    const childHeightSpan = document.getElementById('childHeight');
    const childLastCheckSpan = document.getElementById('childLastCheck');
    const childNotesSpan = document.getElementById('childNotes');

    const weightInput = document.getElementById('weightInput');
    const heightInput = document.getElementById('heightInput');
    const lastCheckInput = document.getElementById('lastCheckInput');
    const notesInput = document.getElementById('notesInput');
    const addMeasurementButton = document.getElementById('addMeasurement');

    function saveChildData() {
        const data = JSON.parse(localStorage.getItem('childData') || '{}');
        data.name = childNameInput.value.trim();
        data.birthDate = birthDateInput.value;
        localStorage.setItem('childData', JSON.stringify(data));
        renderChildData();
    }

    function addMeasurement() {
        const data = JSON.parse(localStorage.getItem('childData') || '{}');
        const measurement = {
            date: lastCheckInput.value,
            weight: weightInput.value,
            height: heightInput.value,
            notes: notesInput.value.trim()
        };
        data.measurements = data.measurements || [];
        data.measurements.push(measurement);
        localStorage.setItem('childData', JSON.stringify(data));
        renderChildData();
        weightInput.value = '';
        heightInput.value = '';
        lastCheckInput.value = '';
        notesInput.value = '';
    }

    function renderChildData() {
        const data = JSON.parse(localStorage.getItem('childData') || '{}');
        childNameSpan.textContent = data.name || '-';
        childBirthDateSpan.textContent = data.birthDate || '-';

        const measurements = data.measurements || [];
        const last = measurements[measurements.length - 1] || {};
        childWeightSpan.textContent = last.weight || '-';
        childHeightSpan.textContent = last.height || '-';
        childLastCheckSpan.textContent = last.date || '-';
        childNotesSpan.textContent = last.notes || '-';

        if (data.birthDate) {
            childAgeSpan.textContent = getAgeString(data.birthDate);
        } else {
            childAgeSpan.textContent = '-';
        }

        childNameInput.value = data.name || '';
        birthDateInput.value = data.birthDate || '';
        weightInput.value = '';
        heightInput.value = '';
        lastCheckInput.value = '';
        notesInput.value = '';

        renderHistoryTable(measurements);
    }


    function renderHistoryTable(measurements) {
        const tbody = document.querySelector('#historyTable tbody');
        if (!tbody) return;
        tbody.innerHTML = '';
        measurements.forEach(m => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${m.date || '-'}</td><td>${m.weight || '-'}</td><td>${m.height || '-'}</td><td>${m.notes || '-'}</td>`;
            tbody.appendChild(tr);
        });

    }

    saveChildDataButton.addEventListener('click', saveChildData);
    addMeasurementButton.addEventListener('click', addMeasurement);

    renderChildData();

    // Удалён весь функционал советов по возрасту ребёнка

    // Удалена функция showDailyAdvice и её вызов
  });
}

if (typeof module !== 'undefined') {
    module.exports = { getAgeString };
}

