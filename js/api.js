// Fetch wrappers for API communication with json-server

const API_BASE = 'http://localhost:3000';

// Get all units for a specific type
export async function getUnits(type) {
  try {
    const response = await fetch(`${API_BASE}/units?type=${type}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching units:', error);
    return [];
  }
}

// Get conversion factors between units
export async function getConversion(fromUnit, toUnit, type) {
  try {
    const response = await fetch(`${API_BASE}/conversions?from=${fromUnit}&to=${toUnit}&type=${type}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Error fetching conversion:', error);
    return null;
  }
}

// Post conversion history (stored in localStorage)
export async function postHistory(conversion) {
  try {
    const existing = JSON.parse(localStorage.getItem('qma_history') || '[]');
    const entry = { ...conversion, id: Date.now() };
    existing.push(entry);
    // Keep only the last 100 entries
    if (existing.length > 100) existing.splice(0, existing.length - 100);
    localStorage.setItem('qma_history', JSON.stringify(existing));
    return entry;
  } catch (error) {
    console.error('Error saving history:', error);
    return null;
  }
}

// Get conversion history (from localStorage)
export async function getHistory() {
  try {
    const data = JSON.parse(localStorage.getItem('qma_history') || '[]');
    return data;
  } catch (error) {
    console.error('Error fetching history:', error);
    return [];
  }
}

// Clear all history
export async function clearHistory() {
  try {
    localStorage.removeItem('qma_history');
    return true;
  } catch (error) {
    console.error('Error clearing history:', error);
    return false;
  }
}