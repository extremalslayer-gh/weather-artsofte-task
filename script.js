function initMap() {
  const getCoordinatesBtn = document.getElementById('getCoordinatesBtn');
  const resultDiv = document.getElementById('result');
  const latitudeInput = document.getElementById('latitude');
  const longitudeInput = document.getElementById('longitude');


  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 37.7749, lng: -122.4194 },
    zoom: 8,
  });

  const openWeatherMapApiKey = "7d929c5a12fde4d42824079703bc924f"
  
  getCoordinatesBtn.addEventListener('click', function() {
    const latitude = parseFloat(document.getElementById('latitude').value);
    const longitude = parseFloat(document.getElementById('longitude').value);

    if (isNaN(latitude) || isNaN(longitude)) {
      document.getElementById('result').textContent = "Некорректные координаты. Введите числа.";
      document.getElementById('result').classList.add("error");
      return;
    }
    
    resultDiv.textContent = `Широта: ${latitude}, Долгота: ${longitude}`;
    resultDiv.classList.remove("error");

    // Создаем маркер
    const marker = new google.maps.Marker({
      position: { lat: latitude, lng: longitude },
      map: map,
      title: "Ваша позиция",
    });pu
    // Центрируем карту на маркере
    map.setCenter(marker.getPosition());


  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${openWeatherMapApiKey}&units=metric`)
   .then(checkStatus) 
   .then(response => response.json())
   .then(data => {
    if (data.cod === 200) {
     document.getElementById('result').textContent = `Погода в ${data.name}: ${data.weather[0].description}, температура ${data.main.temp}°C`;
    } else {
     document.getElementById('result').textContent = `Ошибка получения погоды: ${data.message || "Неизвестная ошибка"}`;
    }
    document.getElementById('result').classList.remove("error");
   })
   .catch(error => {
    console.error("Ошибка:", error);
    document.getElementById('result').textContent = "Ошибка при получении данных о погоде.";
    document.getElementById('result').classList.add("error");
   });
  });
}


function checkStatus(response) {
 if (!response.ok) {
  throw new Error(`HTTP error! status: ${response.status}`);
 }
 return response;
}

window.onload = function(){
  initMap();
}