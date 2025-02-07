document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('grid');
  const scoreElement = document.getElementById('score');
  const restartButton = document.getElementById('restartButton');

  let board = [];
  let score = 0;

  // Инициализация игры
  function initGame() {
    board = Array.from({ length: 4 }, () => Array(4).fill(null));
    score = 0;
    scoreElement.textContent = score;
    addRandomTile();
    addRandomTile();
    renderBoard();
  }

  // Добавление случайной плитки (2 или 4)
  function addRandomTile() {
    const emptyCells = [];
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (board[row][col] === null) {
          emptyCells.push({ row, col });
        }
      }
    }
    if (emptyCells.length > 0) {
      const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      board[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  // Отрисовка игрового поля
  function renderBoard() {
    grid.innerHTML = '';
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const cell = document.createElement('div');
        if (board[row][col]) {
          cell.textContent = board[row][col];
          cell.setAttribute('data-value', board[row][col]);
        }
        grid.appendChild(cell);
      }
    }
  }

  // Обработка движения плиток
  function slide(row) {
    const filteredRow = row.filter(value => value !== null);
    const newRow = [];
    while (filteredRow.length > 0) {
      if (filteredRow.length >= 2 && filteredRow[0] === filteredRow[1]) {
        newRow.push(filteredRow[0] * 2);
        score += filteredRow[0] * 2;
        filteredRow.splice(0, 2);
      } else {
        newRow.push(filteredRow.shift());
      }
    }
    while (newRow.length < 4) {
      newRow.push(null);
    }
    return newRow;
  }

  // Перемещение плиток влево
  function moveLeft() {
    let changed = false;
    for (let row = 0; row < 4; row++) {
      const originalRow = [...board[row]];
      board[row] = slide(board[row]);
      if (!arraysEqual(originalRow, board[row])) {
        changed = true;
      }
    }
    return changed;
  }

  // Проверка равенства массивов
  function arraysEqual(arr1, arr2) {
    return arr1.every((value, index) => value === arr2[index]);
  }

  // Транспонирование матрицы
  function transpose(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
  }

  // Перемещение плиток вправо
  function moveRight() {
    rotateBoard();
    rotateBoard();
    const changed = moveLeft();
    rotateBoard();
    rotateBoard();
    return changed;
  }

  // Перемещение плиток вверх
  function moveUp() {
    rotateBoard();
    const changed = moveLeft();
    rotateBoard();
    rotateBoard();
    rotateBoard();
    return changed;
  }

  // Перемещение плиток вниз
  function moveDown() {
    rotateBoard();
    rotateBoard();
    rotateBoard();
    const changed = moveLeft();
    rotateBoard();
    return changed;
  }

  // Поворот доски на 90 градусов
  function rotateBoard() {
    board = transpose(board).map(row => row.reverse());
  }

  // Обработка нажатий клавиш
  function handleKeyPress(event) {
    let changed = false;
    if (event.key === 'ArrowLeft') {
      changed = moveLeft();
    } else if (event.key === 'ArrowRight') {
      changed = moveRight();
    } else if (event.key === 'ArrowUp') {
      changed = moveUp();
    } else if (event.key === 'ArrowDown') {
      changed = moveDown();
    }
    if (changed) {
      addRandomTile();
      renderBoard();
      scoreElement.textContent = score;
      checkGameOver();
    }
  }

  // Проверка завершения игры
  function checkGameOver() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (board[row][col] === null) {
          return;
        }
        if (
          (row > 0 && board[row][col] === board[row - 1][col]) ||
          (col > 0 && board[row][col] === board[row][col - 1])
        ) {
          return;
        }
      }
    }
    alert('Игра окончена!');
  }

  // Перезапуск игры
  restartButton.addEventListener('click', initGame);

  // Запуск игры
  window.addEventListener('keydown', handleKeyPress);
  initGame();
});
