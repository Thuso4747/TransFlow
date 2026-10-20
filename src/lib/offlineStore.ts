const SAVED_KEY = 'tf-saved-journeys';
const OFFLINE_KEY = 'tf-offline-packages';
const TRIP_KEY = 'tf-active-trip';
const PAST_KEY = 'tf-past-trips';
const A11Y_KEY = 'tf-a11y';

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
  }
}

export function loadSavedJourneys<T>(fallback: T): T {
  return readJson(SAVED_KEY, fallback);
}

export function saveSavedJourneys(value: unknown) {
  writeJson(SAVED_KEY, value);
}

export function loadOfflinePackages<T>(fallback: T): T {
  return readJson(OFFLINE_KEY, fallback);
}

export function saveOfflinePackages(value: unknown) {
  writeJson(OFFLINE_KEY, value);
}

export function loadActiveTrip<T>(fallback: T): T {
  return readJson(TRIP_KEY, fallback);
}

export function saveActiveTrip(value: unknown | null) {
  if (value == null) {
    try {
      localStorage.removeItem(TRIP_KEY);
    } catch {
    }
    return;
  }
  writeJson(TRIP_KEY, value);
}

export function loadTripProgress(journeyId: string): number {
  return readJson(`tf-progress-${journeyId}`, -1);
}

export function saveTripProgress(journeyId: string, checkedTo: number) {
  writeJson(`tf-progress-${journeyId}`, checkedTo);
}

export function loadPastTrips<T>(fallback: T): T {
  return readJson(PAST_KEY, fallback);
}

export function savePastTrips(value: unknown) {
  writeJson(PAST_KEY, value);
}

export function loadA11y<T>(fallback: T): T {
  return readJson(A11Y_KEY, fallback);
}

export function saveA11y(value: unknown) {
  writeJson(A11Y_KEY, value);
}
