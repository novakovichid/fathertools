document.addEventListener('DOMContentLoaded', () => {
  const startDateInput = document.getElementById('startDateInput');
  const saveStartDateButton = document.getElementById('saveStartDate');
  const pdrElement = document.getElementById('pdr');
  const currentWeekElement = document.getElementById('currentWeek');
  const exactDurationElement = document.getElementById('exactDuration');
  const nutritionTipsElement = document.getElementById('nutritionTips');
  const nutritionImageElement = document.getElementById('nutritionImage');

  let startDate = localStorage.getItem('startDate') || null;

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
    fetchNutritionTips(weeks);
  }

  // Загрузка рекомендаций по питанию из API "Едим Дома"
  async function fetchNutritionTips(week) {
    const query = `беременность+неделя+${week}`; // Ключевые слова для поиска
    const url = `https://api.edimdoma.ru/v2/recipes?query=${encodeURIComponent(query)}`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Ошибка загрузки данных');
      const data = await response.json();

      // Извлекаем первый рецепт из результатов
      const recipe = data.recipes[0];
      if (recipe) {
        nutritionTipsElement.textContent = `Рекомендуем: ${recipe.name}`;
        nutritionImageElement.src = recipe.image_url || 'https://via.placeholder.com/300x200?text=No+Image';
      } else {
        nutritionTipsElement.textContent = 'Рекомендации не найдены. Попробуйте другую неделю.';
        nutritionImageElement.src = 'https://via.placeholder.com/300x200?text=No+Data';
      }
    } catch (error) {
      console.error('Ошибка:', error);
      nutritionTipsElement.textContent = 'Не удалось загрузить рекомендации. Пожалуйста, попробуйте позже.';
      nutritionImageElement.src = 'https://via.placeholder.com/300x200?text=Error';
    }
  }

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
});
