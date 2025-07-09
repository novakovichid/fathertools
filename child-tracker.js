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
    const updateChildParamsButton = document.getElementById('updateChildParams');

    function saveChildData() {
        const data = {
            name: childNameInput.value.trim(),
            birthDate: birthDateInput.value,
            weight: weightInput.value,
            height: heightInput.value,
            lastCheck: lastCheckInput.value,
            notes: notesInput.value.trim()
        };
        localStorage.setItem('childData', JSON.stringify(data));
        renderChildData();
    }

    function saveParamsOnly() {
        const data = JSON.parse(localStorage.getItem('childData') || '{}');
        data.weight = weightInput.value;
        data.height = heightInput.value;
        data.lastCheck = lastCheckInput.value;
        data.notes = notesInput.value.trim();
        localStorage.setItem('childData', JSON.stringify(data));
        renderChildData();
    }

    function renderChildData() {
        const data = JSON.parse(localStorage.getItem('childData') || '{}');
        childNameSpan.textContent = data.name || '-';
        childBirthDateSpan.textContent = data.birthDate || '-';
        childWeightSpan.textContent = data.weight || '-';
        childHeightSpan.textContent = data.height || '-';
        childLastCheckSpan.textContent = data.lastCheck || '-';
        childNotesSpan.textContent = data.notes || '-';
        // Возраст
        if (data.birthDate) {
            childAgeSpan.textContent = getAgeString(data.birthDate);
        } else {
            childAgeSpan.textContent = '-';
        }
        // Подставить значения в инпуты
        childNameInput.value = data.name || '';
        birthDateInput.value = data.birthDate || '';
        weightInput.value = data.weight || '';
        heightInput.value = data.height || '';
        lastCheckInput.value = data.lastCheck || '';
        notesInput.value = data.notes || '';
    }

    function getAgeString(birthDateStr) {
        const birth = new Date(birthDateStr);
        const now = new Date();
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

    function normalizeAge(str) {
        return (str || '').replace(/[.]/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
    }

    saveChildDataButton.addEventListener('click', saveChildData);
    updateChildParamsButton.addEventListener('click', saveParamsOnly);

    renderChildData();

    // Загрузка совета из child-advice.json
    function getChildAgeString() {
        const birth = document.getElementById('birthDateInput').value;
        if (!birth) return '';
        const now = new Date();
        const b = new Date(birth);
        let years = now.getFullYear() - b.getFullYear();
        let months = now.getMonth() - b.getMonth();
        if (months < 0) { years--; months += 12; }
        let ageStr = '';
        if (years > 0) ageStr += years + ' год' + (years > 1 && years < 5 ? 'а' : years > 4 ? 'ов' : '') + ' ';
        if (months > 0) ageStr += months + ' мес.';
        return ageStr.trim();
    }

    function showAdvice() {
        fetch('https://raw.githubusercontent.com/novakovichid/fathertools/main/child-advice.json')
            .then(res => res.json())
            .then(data => {
                const adviceBlock = document.getElementById('childAdvice');
                const siteAge = getChildAgeString();
                let warning = '';
                console.log('siteAge:', siteAge, 'data.age:', data.age);
                if (siteAge && data.age && normalizeAge(siteAge) !== normalizeAge(data.age)) {
                    warning = `\n\n⚠️ Совет сгенерирован для возраста: ${data.age}. Ваш возраст: ${siteAge}.`;
                    showAdviceInstruction(siteAge);
                } else {
                    document.getElementById('advice-instruction').innerHTML = '';
                }
                adviceBlock.innerText = data.advice + warning;
            })
            .catch(() => {
                document.getElementById('childAdvice').innerText = 'Совет временно недоступен.';
            });
    }

    function showAdviceInstruction(age) {
        document.getElementById('advice-instruction').innerHTML =
            `Для получения индивидуального совета <a href="https://github.com/novakovichid/fathertools/issues/new?title=update-child-age&body=${encodeURIComponent(age)}" target="_blank">создайте issue</a> с заголовком <b>update-child-age</b> и текстом: <b>${age}</b>.<br>Совет появится через 1-2 минуты.`;
    }

    // Показывать совет при загрузке и при изменении даты рождения
    showAdvice();
    document.getElementById('birthDateInput').addEventListener('change', showAdvice);
}); 