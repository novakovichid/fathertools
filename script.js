document.addEventListener('DOMContentLoaded', () => {
  // Проверяем, на какой странице мы находимся
  if (window.location.pathname.endsWith('checklist.html')) {
    initChecklist();
  } else if (window.location.pathname.endsWith('tracker.html')) {
    initTracker();
  }
});

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
  const nutritionTipsElement = document.getElementById('nutritionTips');

  let startDate = localStorage.getItem('startDate') || null;

  // Загрузка данных из JSON-файла
  let nutritionTipsData = {};
  fetch('nutrition-tips.json')
    .then(response => {
      if (!response.ok) throw new Error('Ошибка загрузки данных');
      return response.json();
    })
    .then(data => {
      nutritionTipsData = data;
      if (startDate) updateCalculations();
    })
    .catch(error => {
      console.error('Ошибка:', error);
      alert('Не удалось загрузить рекомендации по питанию.');
    });

  // Сохранение даты начала беременности
  saveStartDateButton.addEventListener('click', () => {
    startDate = startDateInput.value;
    if (startDate) {
      localStorage.setItem('startDate', startDate);
      updateCalculations();
    } else {
      alert('Пожалуйста, выберите дату.');
    }
  });

  // Обновление всех расчетов
  function updateCalculations() {
    if (!startDate) return;

    const start = new Date(startDate);
    const today = new Date();

    // Расчет ПДР (280 дней = 40 недель)
    const pdr = new Date(start.getTime() + 280 * 24 * 60 * 60 * 1000);
    pdrElement.textContent = formatDate(pdr);

    // Расчет текущей недели и точного срока
    const diffTime = Math.abs(today - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(diffDays / 7) + 1; // Учитываем первую неделю
    const days = diffDays % 7;

    currentWeekElement.textContent = `${weeks} неделя`;
    exactDurationElement.textContent = `${weeks - 1} недель ${days} дней`;

    // Загрузка рекомендаций по питанию
    const dayOfMonth = (diffDays % 31) + 1; // Текущий день месяца (1–31)
    updateNutritionTips(dayOfMonth);
  }

  // Обновление рекомендаций по питанию
  function updateNutritionTips(day) {
    const tipData = nutritionTipsData[day] || {
      tip: 'Рекомендации не найдены.'
    };

    nutritionTipsElement.textContent = tipData.tip;
  }

  // Расчет срока на указанную дату
  calculateForDateButton.addEventListener('click', () => {
    const customDate = customDateInput.value;
    if (!customDate || !startDate) {
      alert('Пожалуйста, укажите дату начала беременности и дату для расчета.');
      return;
    }

    const date = new Date(customDate);
    const start = new Date(startDate);
    const diffTime = Math.abs(date - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(diffDays / 7) + 1; // Учитываем первую неделю
    const days = diffDays % 7;

    customDateResultElement.textContent = `${weeks} неделя (${weeks - 1} недель ${days} дней)`;
  });

  // Расчет даты по указанному сроку
  calculateForWeeksButton.addEventListener('click', () => {
    const weeks = parseInt(customWeekInput.value, 10);
    const days = parseInt(customDayInput.value, 10) || 0; // Дни необязательны

    if (!startDate || isNaN(weeks)) {
      alert('Пожалуйста, укажите дату начала беременности и срок.');
      return;
    }

    const start = new Date(startDate);
    const targetDate = new Date(start.getTime() + ((weeks - 1) * 7 + days) * 24 * 60 * 60 * 1000);
    customWeekResultElement.textContent = formatDate(targetDate);
  });

  // Форматирование даты
  function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }

  // Инициализация при загрузке
  if (startDate) {
    startDateInput.value = startDate;
    updateCalculations();
  }
}

// Инициализация чек-листа покупок
function initChecklist() {
  const newItemInput = document.getElementById('newItemInput');
  const addItemButton = document.getElementById('addItemButton');
  const shoppingList = document.getElementById('shoppingList');

  let items = [];

  // Загрузка данных из JSON-файла
  fetch('shopping-list.json')
    .then(response => response.json())
    .then(data => {
      items = data;
      renderShoppingList();
    })
    .catch(error => {
      console.error('Ошибка загрузки списка покупок:', error);
      alert('Не удалось загрузить список покупок.');
    });

  // Функция отображения списка
  function renderShoppingList() {
    shoppingList.innerHTML = '';
    items.forEach((item, index) => {
      const li = document.createElement('li');
      li.className = item.completed ? 'completed' : '';

      // Текст товара
      const itemName = document.createElement('span');
      itemName.textContent = item.name;
      itemName.className = 'item-name';

      // Контейнер для иконок
      const controls = document.createElement('div');
      controls.className = 'controls';

      // Иконка "Куплено/Отменить"
      const markButton = document.createElement('button');
      markButton.className = 'icon-button mark';
      markButton.innerHTML = item.completed ? '&#10004;' : '&#9998;'; // Галочка или карандаш
      markButton.onclick = () => toggleItem(index);

      // Иконка "Удалить"
      const deleteButton = document.createElement('button');
      deleteButton.className = 'icon-button delete';
      deleteButton.innerHTML = '&#128465;'; // Корзина
      deleteButton.onclick = () => deleteItem(index);

      controls.appendChild(markButton);
      controls.appendChild(deleteButton);

      li.appendChild(itemName);
      li.appendChild(controls);
      shoppingList.appendChild(li);
    });
  }

  // Добавление нового товара
  addItemButton.addEventListener('click', () => {
    const newItemName = newItemInput.value.trim();
    if (newItemName) {
      items.push({ name: newItemName, completed: false });
      newItemInput.value = '';
      saveItems();
      renderShoppingList();
    }
  });

  // Переключение статуса товара
  function toggleItem(index) {
    items[index].completed = !items[index].completed;
    saveItems();
    renderShoppingList();
  }

  // Удаление товара
  function deleteItem(index) {
    items.splice(index, 1);
    saveItems();
    renderShoppingList();
  }

  // Сохранение данных в JSON-файл
  function saveItems() {
    fetch('shopping-list.json', {
      method: 'PUT', // Или POST, если сервер поддерживает
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(items)
    })
      .then(() => console.log('Список сохранен'))
      .catch(error => console.error('Ошибка сохранения списка:', error));
  }
}
