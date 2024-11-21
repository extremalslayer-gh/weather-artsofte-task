function initMap() {
  const getCoordinatesBtn = document.getElementById('getCoordinatesBtn');
  const resultDiv = document.getElementById('result');
  // Инициализация карты Яндекс.Карт
  ymaps.ready(init);
  function init(){
    let map = new ymaps.Map("map", {
        center: [55.76, 37.64], // Центр карты (Москва)
        zoom: 10
    });

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

      // Создаем метку
      const myGeoObject = new ymaps.GeoObject({
        geometry: {
            type: "Point",
            coordinates: [latitude, longitude]
        },
        properties: {
            iconCaption: 'Ваша позиция'
        }
      }, {
          preset: 'islands#blueDotIcon' // Можно выбрать другой пресет иконки
      });

      map.geoObjects.add(myGeoObject);
      map.setCenter([latitude, longitude], 15); // Установим зум поближе
      openWeatherAPI = '7d929c5a12fde4d42824079703bc924f'

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
