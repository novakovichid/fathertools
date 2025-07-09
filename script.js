document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.endsWith('checklist.html')) {
    initChecklist();
  } else if (window.location.pathname.endsWith('tracker.html')) {
    initTracker();
  }
});

// --- ВСТАВЬТЕ СВОЙ КЛЮЧ OpenRouter НИЖЕ ---
window.OPENROUTER_API_KEY = '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';
// ------------------------------------------

// Инициализация трекера беременности
function initTracker() {
  const startDateInput = document.getElementById('startDateInput');
  const saveStartDateButton = document.getElementById('saveStartDate');
  const pdrElement = document.getElementById('pdr');
  const currentWeekElement = document.getElementById('currentWeek');
  const exactDurationElement = document.getElementById('exactDuration');
  const customDateInput = document.getElementById('customDateInput');
  const calculateForDateButton = document.getElementById('calculateForDate');
  const customDateResultElement = document.getElementById('customDateResult');
  const customWeekInput = document.getElementById('customWeekInput');
  const customDayInput = document.getElementById('customDayInput');
  const calculateForWeeksButton = document.getElementById('calculateForWeeks');
  const customWeekResultElement = document.getElementById('customWeekResult');
  // Удаляю все упоминания nutritionTipsElement и updateNutritionTips
  const weekTipsElement = document.getElementById('weekTips');
  const correctionDaysInput = document.getElementById('correctionDaysInput');

  // Прогресс-бар
  const progressBar = document.getElementById('pregnancyProgressBar');
  const progressText = document.getElementById('progressText');

  let startDate = localStorage.getItem('startDate') || null;
  let correctionDays = parseInt(localStorage.getItem('correctionDays'), 10) || 0;

  // Загрузка данных о неделях беременности
  fetch('pregnancy_weeks.json')
    .then(response => response.json())
    .then(data => {
      console.log('Данные успешно загружены:', data);
      window.pregnancyWeeksData = data;
      if (startDate) updateCalculations();
    })
    .catch(error => {
      console.error('Ошибка:', error);
      alert('Не удалось загрузить данные о неделях беременности.');
    });

  saveStartDateButton.addEventListener('click', () => {
    startDate = startDateInput.value;
    correctionDays = parseInt(correctionDaysInput.value, 10) || 0;
    if (startDate) {
      localStorage.setItem('startDate', startDate);
      localStorage.setItem('correctionDays', correctionDays);
      updateCalculations();
    } else {
      alert('Пожалуйста, выберите дату.');
    }
  });

  function getCorrectedStartDate() {
    if (!startDate) return null;
    const start = new Date(startDate);
    start.setDate(start.getDate() + correctionDays);
    return start;
  }

  function updateCalculations() {
    if (!startDate) return;
    const start = getCorrectedStartDate();
    const today = new Date();
    const pdr = new Date(start.getTime() + 280 * 24 * 60 * 60 * 1000);
    pdrElement.textContent = formatDate(pdr);

    const diffTime = Math.abs(today - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(diffDays / 7) + 1;
    const days = diffDays % 7;

    currentWeekElement.textContent = `${weeks} неделя`;
    exactDurationElement.textContent = `${weeks - 1} недель ${days} дней`;

    // Обновление прогресс-бара
    updateProgressBar(weeks);

    // Обновление советов для текущей недели
    updateWeekTips(weeks);
  }

  function updateProgressBar(weeks) {
    const totalWeeks = 40; // Общее количество недель беременности
    const progressPercentage = (weeks / totalWeeks) * 100;
    progressBar.style.width = `${progressPercentage}%`;
    progressText.textContent = `${weeks} неделя • ${progressPercentage.toFixed(0)}%`;
  }

  function updateWeekTips(week) {
    const weekData = window.pregnancyWeeksData?.[week];
    if (!weekData) {
      console.warn(`Данные для недели ${week} не найдены.`);
      weekTipsElement.innerHTML = '<p>Советы для этой недели недоступны.</p>';
      return;
    }

    const childInfo = weekData.child.map(item => `<li>${item}</li>`).join('');
    const motherInfo = weekData.mother.map(item => `<li>${item}</li>`).join('');
    const tipsInfo = weekData.tips.map(item => `<li>${item}</li>`).join('');

    weekTipsElement.innerHTML = `
      <h3>Развитие ребенка:</h3>
      <ul>${childInfo}</ul>
      <h3>Изменения у матери:</h3>
      <ul>${motherInfo}</ul>
      <h3>Советы:</h3>
      <ul>${tipsInfo}</ul>
    `;
  }

  calculateForDateButton.addEventListener('click', () => {
    const customDate = customDateInput.value;
    if (!customDate || !startDate) {
      alert('Пожалуйста, укажите дату начала беременности и дату для расчета.');
      return;
    }

    const date = new Date(customDate);
    const start = getCorrectedStartDate();
    const diffTime = Math.abs(date - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(diffDays / 7) + 1;
    const days = diffDays % 7;

    customDateResultElement.textContent = `${weeks} неделя (${weeks - 1} недель ${days} дней)`;

    // Обновление прогресс-бара
    updateProgressBar(weeks);

    // Обновление советов для указанной даты
    updateWeekTips(weeks);
  });

  calculateForWeeksButton.addEventListener('click', () => {
    const weeks = parseInt(customWeekInput.value, 10);
    const days = parseInt(customDayInput.value, 10) || 0;

    if (!startDate || isNaN(weeks)) {
      alert('Пожалуйста, укажите дату начала беременности и срок.');
      return;
    }

    const start = getCorrectedStartDate();
    const targetDate = new Date(start.getTime() + ((weeks - 1) * 7 + days) * 24 * 60 * 60 * 1000);
    customWeekResultElement.textContent = formatDate(targetDate);

    // Обновление прогресс-бара
    updateProgressBar(weeks);

    // Обновление советов для указанной недели
    updateWeekTips(weeks);
  });

  function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }

  if (startDate) {
    startDateInput.value = startDate;
    if (correctionDaysInput) correctionDaysInput.value = correctionDays;
    updateCalculations();
  }
}

// Инициализация чек-листа покупок
function initChecklist() {
  const newItemInput = document.getElementById('newItemInput');
  const addItemButton = document.getElementById('addItemButton');
  const shoppingList = document.getElementById('shoppingList');
  let items = [];

  // Загрузка данных из localStorage
  function loadItems() {
    const savedItems = localStorage.getItem('shoppingList');
    if (savedItems) {
      items = JSON.parse(savedItems);
    }
  }

  // Сохранение данных в localStorage
  function saveItems() {
    localStorage.setItem('shoppingList', JSON.stringify(items));
  }

  // Функция отображения списка
  function renderShoppingList() {
    shoppingList.innerHTML = '';
    items.forEach((item, index) => {
      const li = document.createElement('li');
      li.className = item.completed ? 'completed' : '';
      const itemName = document.createElement('span');
      itemName.textContent = item.name;
      itemName.className = 'item-name';
      const controls = document.createElement('div');
      controls.className = 'controls';
      const markButton = document.createElement('button');
      markButton.className = 'icon-button mark';
      markButton.innerHTML = item.completed ? '&#10004;' : '&#9998;';
      markButton.onclick = () => toggleItem(index);
      const deleteButton = document.createElement('button');
      deleteButton.className = 'icon-button delete';
      deleteButton.innerHTML = '&#128465;';
      deleteButton.onclick = () => deleteItem(index);
      controls.appendChild(markButton);
      controls.appendChild(deleteButton);
      li.appendChild(itemName);
      li.appendChild(controls);
      shoppingList.appendChild(li);
    });
  }

  addItemButton.addEventListener('click', () => {
    const newItemName = newItemInput.value.trim();
    if (newItemName) {
      items.push({ name: newItemName, completed: false });
      newItemInput.value = '';
      saveItems();
      renderShoppingList();
    }
  });

  function toggleItem(index) {
    items[index].completed = !items[index].completed;
    saveItems();
    renderShoppingList();
  }

  function deleteItem(index) {
    items.splice(index, 1);
    saveItems();
    renderShoppingList();
  }

  loadItems();
  renderShoppingList();
}
