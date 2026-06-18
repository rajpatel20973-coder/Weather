import { useState, useCallback } from "react";

const BASE_URL = "https://api.openweathermap.org/data/2.5";

function normalizeWeather(raw) {
  return {
    city: raw.name,
    country: raw.sys.country,
    temperature: Math.round(raw.main.temp),
    feelsLike: Math.round(raw.main.feels_like),
    humidity: raw.main.humidity,
    windSpeed: raw.wind.speed,
    pressure: raw.main.pressure,
    visibility: raw.visibility
      ? (raw.visibility / 1000).toFixed(1)
      : "N/A",
    description: raw.weather[0].description,
    iconUrl: `https://openweathermap.org/img/wn/${raw.weather[0].icon}@2x.png`,
    sunrise: new Date(raw.sys.sunrise * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    sunset: new Date(raw.sys.sunset * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    timestamp: new Date(raw.dt * 1000).toLocaleString(),
  };
}


function normalizeForecast(list) {
  const dailyMap = {};

  list.forEach((item) => {
    const date = new Date(item.dt * 1000).toLocaleDateString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

    if (!dailyMap[date]) {
      dailyMap[date] = {
        date,
        temps: [],
        description: item.weather[0].description,
        iconUrl: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
      };
    }

    dailyMap[date].temps.push(Math.round(item.main.temp));
  });

  return Object.values(dailyMap).map((day) => ({
    ...day,
    tempMin: Math.min(...day.temps),
    tempMax: Math.max(...day.temps),
  }));
}

export function useWeather() {
  const [apiKey, setApiKeyState] = useState(() => {
    const saved = localStorage.getItem("weather_api_key");

    if (saved) return saved;

    const envKey = import.meta.env.VITE_WEATHER_API_KEY;

    return envKey && envKey !== "YOUR_OPENWEATHERMAP_API_KEY"
      ? envKey
      : "c2e273789e82da46058fcd31d2e3da16"; // Hardcoded fallback
  });

  const saveApiKey = useCallback((newKey) => {
    const trimmed = newKey.trim();

    if (trimmed) {
      localStorage.setItem("weather_api_key", trimmed);
    } else {
      localStorage.removeItem("weather_api_key");
    }

    setApiKeyState(trimmed);
  }, []);

  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = useCallback(
    async (city) => {
      if (!apiKey) {
        setError(
          "Please configure your OpenWeatherMap API Key."
        );
        return;
      }

      if (!city || city.trim().length < 2) {
        setError(
          "Please enter a valid city name."
        );
        return;
      }

      setLoading(true);
      setError(null);
      setWeather(null);
      setForecast([]);

      const encoded = encodeURIComponent(city.trim());

      const weatherUrl =
        `${BASE_URL}/weather?q=${encoded}&appid=${apiKey}&units=metric`;

      const forecastUrl =
        `${BASE_URL}/forecast?q=${encoded}&appid=${apiKey}&units=metric`;

      try {
        const [wRes, fRes] = await Promise.all([
          fetch(weatherUrl),
          fetch(forecastUrl),
        ]);

        if (!wRes.ok) {
          if (wRes.status === 401) {
            throw new Error("Invalid API key.");
          }

          if (wRes.status === 404) {
            throw new Error(
              `City "${city}" not found.`
            );
          }

          throw new Error(
            `Weather API error: ${wRes.status}`
          );
        }

        if (!fRes.ok) {
          throw new Error(
            `Forecast API error: ${fRes.status}`
          );
        }

        const [wData, fData] = await Promise.all([
          wRes.json(),
          fRes.json(),
        ]);

        setWeather(normalizeWeather(wData));
        setForecast(normalizeForecast(fData.list));
      } catch (err) {
        if (err.name === "TypeError") {
          setError(
            "Network error. Please check your internet connection."
          );
        } else {
          setError(err.message);
        }

        console.error("[useWeather] Error:", err);
      } finally {
        setLoading(false);
      }
    },
    [apiKey]
  );

  return {
    weather,
    forecast,
    loading,
    error,
    search,
    apiKey,
    saveApiKey,
  };
}