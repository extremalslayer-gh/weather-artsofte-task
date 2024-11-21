function initMap() {
  const getCoordinatesBtn = document.getElementById('getCoordinatesBtn');
  const resultDiv = document.getElementById('result');

  // Инициализация карты OpenStreetMap с помощью Leaflet
  const map = L.map('map').setView([55.76, 37.64], 10); // Москва, зум 10

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  // Добавим эту строку - map.setView - чтобы карта была видна сразу
  map.setView([55.76, 37.64], 10);


  getCoordinatesBtn.addEventListener('click', function() {
    const latitude = parseFloat(document.getElementById('latitude').value);
    const longitude = parseFloat(document.getElementById('longitude').value);

    if (isNaN(latitude) || isNaN(longitude)) {
      resultDiv.textContent = "Некорректные координаты. Введите числа.";
      resultDiv.classList.add("error");
      return;
    }

    resultDiv.textContent = `Широта: ${latitude}, Долгота: ${longitude}`;
    resultDiv.classList.remove("error");

    // Добавляем маркер с помощью Leaflet
    L.marker([latitude, longitude]).addTo(map)
      .bindPopup("Ваша позиция")
      .openPopup();

    map.setView([latitude, longitude], 15); // Установим зум поближе
    const openWeatherAPI = '7d929c5a12fde4d42824079703bc924f'; // Ваш ключ OpenWeatherMap

    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${openWeatherAPI}&units=metric&lang=ru`)
      .then(checkStatus)
      .then(response => response.json())
      .then(data => {
        if (data.cod === 200) {
          resultDiv.textContent = `Местность: ${data.name}. Погода: ${data.weather[0].description}, температура ${data.main.temp}°C`;
        } else {
          resultDiv.textContent = `Ошибка получения погоды: ${data.message || "Неизвестная ошибка"}`;
        }
        resultDiv.classList.remove("error");
      })
      .catch(error => {
        console.error("Ошибка:", error);
        resultDiv.textContent = "Ошибка при получении данных о погоде.";
        resultDiv.classList.add("error");
      });
  });
}

function checkStatus(response) {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response;
}

window.onload = function() {
  initMap();
};
