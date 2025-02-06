document.addEventListener('DOMContentLoaded', () => {
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
    const nutritionImageElement = document.getElementById('nutritionImage');
  
    let startDate = localStorage.getItem('startDate') || null;
  
    // Статические данные для рекомендаций по питанию
    const nutritionTipsData = {
      1: {
        tip: "Убедитесь, что ваш рацион богат фолиевой кислотой. Ешьте больше зелени и орехов.",
        image: "https://via.placeholder.com/300x200?text=Week+1"
      },
      2: {
        tip: "Добавьте в меню продукты, богатые железом, такие как мясо, шпинат и бобовые.",
        image: "https://via.placeholder.com/300x200?text=Week+2"
      },
      default: {
        tip: "Следите за сбалансированным питанием и регулярно консультируйтесь с врачом.",
        image: "https://via.placeholder.com/300x200?text=Default"
      }
    };
  
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
  
      // Обновление рекомендаций по питанию
      updateNutritionTips(weeks);
    }
  
    // Обновление рекомендаций по питанию
    function updateNutritionTips(week) {
      const tipData = nutritionTipsData[week] || nutritionTipsData.default;
      nutritionTipsElement.textContent = tipData.tip;
      nutritionImageElement.src = tipData.image;
      nutritionImageElement.alt = `Рекомендации для ${week}-й недели`;
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
  });
