const STORAGE_KEY = "cv_generator_data";

function saveToLocalStorage(cv) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cv));
  } catch (error) {
    console.warn("Unable to save CV data to localStorage.", error);
  }
}

function loadFromLocalStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.warn("Unable to load CV data from localStorage.", error);
    return null;
  }
}

function clearLocalStorage() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn("Unable to clear localStorage.", error);
  }
}
