export default function LoadingSpinner() {
  return (
    <div className="loading-container" role="status" aria-label="Loading weather data">
      <div className="spinner" />
      <p className="loading-text">Fetching weather data…</p>
    </div>
  );
}