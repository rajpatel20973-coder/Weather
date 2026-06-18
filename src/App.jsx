import { useState } from "react";
import { useWeather } from "./Components/useWeather";
import SearchBar      from "./Components/SearchBar";
import LoadingSpinner from "./Components/LoadingSpinner";
import ErrorMessage   from "./Components/ErrorMessage";
import WeatherCard    from "./Components/WeatherCard";
import ForecastStrip  from "./Components/ForecastStrip";


export default function App() {
  const { weather, forecast, loading, error, search, apiKey, saveApiKey } = useWeather();
  const [showSettings, setShowSettings] = useState(!apiKey);
  const [tempKey, setTempKey] = useState(apiKey || "");

  function handleSaveKey(e) {
    e.preventDefault();
    saveApiKey(tempKey);
    setShowSettings(false);
  }

  function handleDismissError() {
    window.location.reload();
  }

  return (
    <div className="app-root">
      <header className="app-header">
        <div className="header-left">
          <h1 className="app-title">☁ SkyScope</h1>
          <p className="app-subtitle">Real-time weather for any city on Earth</p>
        </div>
        <button
          className={`settings-btn ${showSettings ? "active" : ""}`}
          onClick={() => setShowSettings(!showSettings)}
          aria-label="Toggle API Key Settings"
        >
          {showSettings ? "Close Settings" : "⚙ API Settings"}
        </button>
      </header>

      {showSettings && (
        <section className="api-key-config" aria-label="API Key configuration">
          <h2 className="config-title">⚙ OpenWeatherMap API Key</h2>
          <p className="config-desc">
            This application requires a free API key from{" "}
            <a href="https://openweathermap.org/" target="_blank" rel="noopener noreferrer">
              OpenWeatherMap
            </a>
            . Your key is stored locally in your browser.
          </p>
          <form className="config-form" onSubmit={handleSaveKey}>
            <div className="config-input-wrapper">
              <input
                type="text"
                className="config-input"
                placeholder="Enter OpenWeatherMap API Key"
                value={tempKey}
                onChange={(e) => setTempKey(e.target.value)}
              />
            </div>
            <button type="submit" className="config-save-btn">
              Save Key
            </button>
          </form>
          <div className={`key-status ${apiKey ? "configured" : "not-configured"}`}>
            {apiKey ? "✓ API Key Configured" : "⚠ API Key Not Configured"}
          </div>
        </section>
      )}

      <SearchBar onSearch={search} disabled={loading} />

      {/* aria-live region: announces updates to screen readers */}
      <main className="results-area" aria-live="polite" aria-atomic="true">
        {loading && <LoadingSpinner />}

        {error && !loading && (
          <ErrorMessage message={error} onDismiss={handleDismissError} />
        )}

        {!loading && !error && weather && (
          <>
            <WeatherCard weather={weather} />
            <ForecastStrip forecast={forecast} />
          </>
        )}

        {!loading && !error && !weather && (
          <div className="empty-state">
            <p className="empty-state-text">Search for a city to see the weather.</p>
          </div>
        )}
      </main>
    </div>
  );
}