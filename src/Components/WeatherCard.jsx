export default function WeatherCard({ weather }) {
  if (!weather) return null;

  const {
    city, country, temperature, feelsLike, humidity,
    windSpeed, pressure, visibility, description,
    iconUrl, sunrise, sunset, timestamp,
  } = weather;

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <article className="weather-card" aria-label={`Current weather for ${city}`}>
      <header className="wc-header">
        <div className="wc-location">
          <h2 className="wc-city">{city}</h2>
          <span className="wc-country">{country}</span>
        </div>
        <time className="wc-timestamp">{timestamp}</time>
      </header>

      <div className="wc-main">
        <img
          src={iconUrl}
          alt={description}
          className="wc-icon"
          width={80}
          height={80}
        />
        <div className="wc-temp-block">
          <p className="wc-temperature">{temperature}°C</p>
          <p className="wc-description">{capitalize(description)}</p>
          <p className="wc-feels">Feels like <strong>{feelsLike}°C</strong></p>
        </div>
      </div>

      <div className="wc-details">
        <DetailItem emoji="💧" label="Humidity"    value={`${humidity}%`} />
        <DetailItem emoji="💨" label="Wind"        value={`${windSpeed} m/s`} />
        <DetailItem emoji="🔭" label="Visibility"  value={`${visibility} km`} />
        <DetailItem emoji="🔽" label="Pressure"    value={`${pressure} hPa`} />
        <DetailItem emoji="🌅" label="Sunrise"     value={sunrise} />
        <DetailItem emoji="🌇" label="Sunset"      value={sunset} />
      </div>
    </article>
  );
}


function DetailItem({ emoji, label, value }) {
  return (
    <div className="detail-item">
      <span className="di-emoji" aria-hidden="true">{emoji}</span>
      <span className="di-label">{label}</span>
      <span className="di-value">{value}</span>
    </div>
  );
}