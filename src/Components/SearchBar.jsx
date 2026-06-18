import { useState } from "react";

export default function SearchBar({ onSearch, disabled }) {
  const [inputValue, setInputValue] = useState("");
  const [inputError, setInputError] = useState("");

  function validate(value) {
    if (!value.trim()) return "City name cannot be empty.";
    if (value.trim().length < 2) return "Please enter at least 2 characters.";
    if (!/^[a-zA-Z\s\-'.]+$/.test(value))
      return "Only letters, spaces, hyphens, and apostrophes are allowed.";
    return "";
  }

  function handleSubmit(e) {
    e.preventDefault();
    const validationMsg = validate(inputValue);
    if (validationMsg) {
      setInputError(validationMsg);
      return;
    }
    setInputError("");
    onSearch(inputValue.trim());
  }

  function handleChange(e) {
    setInputValue(e.target.value);
    if (inputError) setInputError(""); // Clear inline error on type
  }

  return (
    <form className="search-form" onSubmit={handleSubmit} noValidate>
      <div className="input-wrapper">
        <input
          className={`search-input${inputError ? " search-input--error" : ""}`}
          type="text"
          value={inputValue}
          onChange={handleChange}
          placeholder="Enter a city… (e.g. Tokyo)"
          aria-label="City name"
          aria-describedby={inputError ? "input-error" : undefined}
          aria-invalid={!!inputError}
          disabled={disabled}
          autoComplete="off"
        />
        {inputError && (
          <p id="input-error" className="input-error" role="alert">
            {inputError}
          </p>
        )}
      </div>
      <button className="search-btn" type="submit" disabled={disabled}>
        {disabled ? "Searching…" : "Search"}
      </button>
    </form>
  );
}