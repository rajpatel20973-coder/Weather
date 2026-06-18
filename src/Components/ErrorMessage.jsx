export default function ErrorMessage({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div className="error-banner" role="alert" aria-live="assertive">
      <span className="error-icon" aria-hidden="true">⚠</span>
      <p className="error-text">{message}</p>
      {onDismiss && (
        <button
          className="error-dismiss-btn"
          onClick={onDismiss}
          aria-label="Dismiss error"
        >
          ✕
        </button>
      )}
    </div>
  );
}