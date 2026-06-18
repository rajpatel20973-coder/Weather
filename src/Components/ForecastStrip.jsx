export default function ForecastStrip({ forecast }) {
  if (!forecast || forecast.length === 0) return null;

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <section className="forecast-strip" aria-label="5-day forecast">
      <h3 className="fs-title">5-Day Forecast</h3>
      <div className="fs-grid">
        {forecast.slice(0, 5).map((day) => (
          <div key={day.date} className="fs-day">
            <p className="fs-date">{day.date}</p>
            <img
              src={day.iconUrl}
              alt={day.description}
              className="fs-icon"
              width={40}
              height={40}
            />
            <p className="fs-desc">{capitalize(day.description)}</p>
            <p className="fs-temps">
              <strong>{day.tempMax}°</strong> / {day.tempMin}°
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}