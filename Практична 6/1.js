// Отримуємо елементи з HTML
const fetchDataButton = document.getElementById("fetchDataButton");
const consoleElement = document.getElementById("console");

// Функція для виведення повідомлень у консоль
function logToConsole(message) {
  // Створюємо новий елемент для кожного запису
  const logEntry = document.createElement("div");
  logEntry.textContent = message; // Додаємо текст повідомлення
  consoleElement.appendChild(logEntry); // Додаємо новий запис у консоль
  consoleElement.scrollTop = consoleElement.scrollHeight; // Прокручуємо консоль донизу
}

// Функція для запиту з таймаутом
function fetchWithTimeout(url, timeout) {
  return Promise.race([
    fetch(url).then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    }),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timeout")), timeout)
    ),
  ]);
}

// Асинхронна функція для виконання паралельних запитів
async function fetchData() {
  const urls = [
    "https://jsonplaceholder.typicode.com/posts/1",
    "https://jsonplaceholder.typicode.com/users/1",
  ];

  logToConsole("Starting concurrent requests...");

  // Виконуємо запити одночасно з таймаутом 3000 мс
  const results = await Promise.allSettled(
    urls.map((url) => fetchWithTimeout(url, 3000))
  );

  // Обробка результатів
  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      logToConsole(`Request ${index + 1}: Success`);
      logToConsole(JSON.stringify(result.value, null, 2));
    } else {
      logToConsole(`Request ${index + 1}: ${result.reason.message}`);
    }
  });

  logToConsole("All requests processed.");
}

// Додаємо слухач подій до кнопки
fetchDataButton.addEventListener("click", fetchData);