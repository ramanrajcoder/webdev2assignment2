const apiKey = "41d88258ae40ca8579a7c4f3f2f3131c";

const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const weatherResult = document.getElementById("weatherResult");
const historyDiv = document.getElementById("history");
const consoleBox = document.getElementById("consoleOutput");
function log(message) {
  consoleBox.innerHTML += message + "<br>";
}

log("1️⃣ Sync Start");

async function fetchWeather(city) {
  try {
    log("3️⃣ [ASYNC] Start fetching");

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );

    if (!response.ok) {
      throw new Error("City not found");
    }

    const data = await response.json();

    weatherResult.innerHTML = `
  <h3>${data.name}</h3>
  <p>Temperature: ${data.main.temp} °C</p>
  <p>Condition: ${data.weather[0].description}</p>
  <p>Humidity: ${data.main.humidity}%</p>
  <p>Wind Speed: ${data.wind.speed} m/s</p>
`;
    saveToLocalStorage(city);

  } catch (error) {
    weatherResult.innerHTML = `<p style="color:red;">${error.message}</p>`;
  }
}

function saveToLocalStorage(city) {
  let history = JSON.parse(localStorage.getItem("weatherHistory")) || [];

  if (!history.includes(city)) {
    history.push(city);
    localStorage.setItem("weatherHistory", JSON.stringify(history));
  }

  loadHistory();
}

function loadHistory() {
  historyDiv.innerHTML = "";
  let history = JSON.parse(localStorage.getItem("weatherHistory")) || [];

  history.forEach(city => {
    const span = document.createElement("span");
    span.textContent = city;

    span.addEventListener("click", () => {
      fetchWeather(city);
    });

    historyDiv.appendChild(span);
  });
}

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();

  if (!city) {
    weatherResult.innerHTML = `<p style="color:red;">Please enter a city</p>`;
    return;
  }

  fetchWeather(city);

  Promise.resolve().then(() => {
    log("4️⃣ Promise.then (Microtask)");
  });

  setTimeout(() => {
    log("5️⃣ setTimeout (Macrotask)");
  }, 0);
});

log("2️⃣ Sync End");

window.onload = loadHistory;