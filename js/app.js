// Entry point: DOMContentLoaded handler, initializes all modules

import { state, setSelectedType, setSelectedAction, updateValue, updateUnit, setOperator } from './state.js';
import { convert, compare, arithmetic, formatResult, units } from './conversion.js';
import { postHistory, getHistory, clearHistory } from './api.js';
import {
  populateDropdown,
  showResult,
  hideResult,
  toggleOperators,
  updateActionButton,
  updateLabels,
  showPopup,
  closePopup,
  getInputValues,
  highlightTypeCard,
  highlightActionTab
} from './ui.js';

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
});

function initializeApp() {
  // Set up initial state
  populateDropdown('unit-from', state.selectedType);
  populateDropdown('unit-to', state.selectedType);
  populateDropdown('arith-unit', state.selectedType);

  // Set default units
  const unitFrom = document.getElementById('unit-from');
  const unitTo = document.getElementById('unit-to');
  const arithUnit = document.getElementById('arith-unit');

  if (unitFrom && unitFrom.options.length > 0) {
    updateUnit('from', unitFrom.value);
  }
  if (unitTo && unitTo.options.length > 1) {
    unitTo.selectedIndex = 1;
    updateUnit('to', unitTo.value);
  }
  if (arithUnit && arithUnit.options.length > 0) {
    updateUnit('arith', arithUnit.value);
  }

  // Set up input event listeners
  setupInputListeners();

  // Update UI based on initial state
  updateActionButton(state.selectedAction);
  updateLabels(state.selectedAction);
  toggleOperators(state.selectedAction === 'arithmetic');
  
  // Note: Dashboard is shown by default for testing. 
  // For production with auth flow, remove the lines below:
  // document.getElementById('auth-page').classList.remove('active');
  // document.getElementById('dashboard-page').classList.add('active');
  // document.querySelectorAll('.icon-btn').forEach(btn => {
  //   btn.style.display = 'flex';
  // });
}

function setupInputListeners() {
  // Value inputs
  const valFrom = document.getElementById('val-from');
  const valTo = document.getElementById('val-to');
  const arithA = document.getElementById('arith-a');
  const arithB = document.getElementById('arith-b');

  if (valFrom) {
    valFrom.addEventListener('input', (e) => {
      updateValue('from', parseFloat(e.target.value) || 0);
    });
  }

  if (valTo) {
    valTo.addEventListener('input', (e) => {
      updateValue('to', parseFloat(e.target.value) || 0);
    });
  }

  if (arithA) {
    arithA.addEventListener('input', (e) => {
      updateValue('arithA', parseFloat(e.target.value) || 0);
    });
  }

  if (arithB) {
    arithB.addEventListener('input', (e) => {
      updateValue('arithB', parseFloat(e.target.value) || 0);
    });
  }

  // Operator select
  const arithOp = document.getElementById('arith-op');
  if (arithOp) {
    arithOp.addEventListener('change', (e) => {
      setOperator(e.target.value);
    });
  }
}

// Global functions for HTML onclick handlers
window.selectType = function(type) {
  setSelectedType(type);
  highlightTypeCard(type);

  // Update dropdowns
  populateDropdown('unit-from', type);
  populateDropdown('unit-to', type);
  populateDropdown('arith-unit', type);

  // Set default units
  const unitFrom = document.getElementById('unit-from');
  const unitTo = document.getElementById('unit-to');
  const arithUnit = document.getElementById('arith-unit');

  if (unitFrom && unitFrom.options.length > 0) {
    updateUnit('from', unitFrom.value);
  }
  if (unitTo && unitTo.options.length > 1) {
    unitTo.selectedIndex = 1;
    updateUnit('to', unitTo.value);
  }
  if (arithUnit && arithUnit.options.length > 0) {
    updateUnit('arith', arithUnit.value);
  }

  hideResult();
};

window.selectAction = function(action) {
  setSelectedAction(action);
  highlightActionTab(action);
  updateActionButton(action);
  updateLabels(action);
  toggleOperators(action === 'arithmetic');
  hideResult();
};

window.onUnitChange = function() {
  const unitFrom = document.getElementById('unit-from');
  const unitTo = document.getElementById('unit-to');

  if (unitFrom) updateUnit('from', unitFrom.value);
  if (unitTo) updateUnit('to', unitTo.value);
};

window.calculate = async function() {
  const values = getInputValues();
  const { selectedType, selectedAction } = state;

  try {
    let result;
    let resultText;
    let note = '';

    if (selectedAction === 'comparison') {
      const comparison = compare(values.fromValue, values.fromUnit, values.toValue, values.toUnit, selectedType);
      if (comparison === 'equal') {
        resultText = 'Values are equal';
        note = `${values.fromValue} ${values.fromUnit} = ${values.toValue} ${values.toUnit}`;
      } else if (comparison === 'greater') {
        resultText = `${values.fromUnit} is greater`;
        note = `${values.fromValue} ${values.fromUnit} > ${values.toValue} ${values.toUnit}`;
      } else {
        resultText = `${values.toUnit} is greater`;
        note = `${values.fromValue} ${values.fromUnit} < ${values.toValue} ${values.toUnit}`;
      }
    } else if (selectedAction === 'conversion') {
      const converted = convert(values.fromValue, values.fromUnit, values.toUnit, selectedType);
      const formatted = formatResult(converted, values.toUnit);
      resultText = formatted.display;
      note = `${values.fromValue} ${values.fromUnit} = ${formatted.display}`;

      // Update the "to" input field
      const valTo = document.getElementById('val-to');
      if (valTo) valTo.value = formatted.value;
    } else if (selectedAction === 'arithmetic') {
      const arithResult = arithmetic(values.arithA, values.arithB, values.arithOp, values.arithUnit, selectedType);
      const formatted = formatResult(arithResult.value, arithResult.unit);
      resultText = formatted.display;
      const opDisplay = { '+': '+', '-': '−', '*': '×', '/': '÷' };
      note = `${values.arithA} ${opDisplay[values.arithOp] || values.arithOp} ${values.arithB} = ${formatted.value} ${arithResult.unit}`;
    }

    showResult(resultText, note);

    // Save to history
    await postHistory({
      type: selectedType,
      action: selectedAction,
      timestamp: new Date().toISOString(),
      result: resultText
    });

  } catch (error) {
    showPopup('Error', error.message || 'An error occurred during calculation');
  }
};

window.showHistory = async function() {
  try {
    const history = await getHistory();
    const modal = document.getElementById('history-modal');
    const list = document.getElementById('history-list');
    if (!modal || !list) return;

    list.innerHTML = '';

    if (history.length === 0) {
      list.innerHTML = `
        <div class="history-empty">
          <span class="history-empty-icon">📋</span>
          <p>No history yet.</p>
          <small>Perform a calculation to see it here.</small>
        </div>`;
    } else {
      // Show newest first
      [...history].reverse().forEach(h => {
        const item = document.createElement('div');
        item.className = 'history-item';
        const typeIcon = { length: '📏', weight: '⚖️', temperature: '🌡️', volume: '🧴' }[h.type] || '📐';
        const actionLabel = { comparison: 'Comparison', conversion: 'Conversion', arithmetic: 'Arithmetic' }[h.action] || h.action;
        const date = h.timestamp ? new Date(h.timestamp).toLocaleString() : '';
        item.innerHTML = `
          <div class="history-item-header">
            <span class="history-type">${typeIcon} ${h.type ? h.type.charAt(0).toUpperCase() + h.type.slice(1) : ''}</span>
            <span class="history-action-badge">${actionLabel}</span>
          </div>
          <div class="history-result">${h.result || '—'}</div>
          ${date ? `<div class="history-time">${date}</div>` : ''}
        `;
        list.appendChild(item);
      });
    }

    modal.classList.add('show');
  } catch (error) {
    console.error('Error loading history:', error);
  }
};

window.closeHistoryModal = function() {
  const modal = document.getElementById('history-modal');
  if (modal) modal.classList.remove('show');
};

window.clearAllHistory = async function() {
  await clearHistory();
  // Refresh the list
  window.showHistory();
};

window.logout = function() {
  const authPage = document.getElementById('auth-page');
  const dashboardPage = document.getElementById('dashboard-page');

  // Navigate back to auth page
  if (dashboardPage) dashboardPage.classList.remove('active');
  if (authPage) authPage.classList.add('active');

  // Hide header buttons
  document.querySelectorAll('.icon-btn').forEach(btn => {
    btn.style.display = 'none';
  });

  // Reset result box
  hideResult();

  showPopup('Logout', 'You have been logged out successfully.');
};

window.switchTab = function(tab) {
  const loginTab = document.getElementById('tab-login');
  const signupTab = document.getElementById('tab-signup');
  const loginForm = document.getElementById('form-login');
  const signupForm = document.getElementById('form-signup');

  if (tab === 'login') {
    loginTab?.classList.add('active');
    signupTab?.classList.remove('active');
    loginForm?.classList.add('active');
    signupForm?.classList.remove('active');
  } else {
    loginTab?.classList.remove('active');
    signupTab?.classList.add('active');
    loginForm?.classList.remove('active');
    signupForm?.classList.add('active');
  }
};

window.login = function() {
  const email = document.getElementById('login-email')?.value;
  const password = document.getElementById('login-password')?.value;

  if (!email || !password) {
    showPopup('Error', 'Please fill in all fields');
    return;
  }

  // Show dashboard using active class (preserves flex layout)
  const authPage = document.getElementById('auth-page');
  const dashboardPage = document.getElementById('dashboard-page');

  if (authPage) authPage.classList.remove('active');
  if (dashboardPage) dashboardPage.classList.add('active');

  // Show header buttons
  document.querySelectorAll('.icon-btn').forEach(btn => {
    btn.style.display = 'flex';
  });

  showPopup('Success', 'Login successful!');
};

window.signup = function() {
  const name = document.getElementById('signup-name')?.value;
  const mobile = document.getElementById('signup-mobile')?.value;
  const email = document.getElementById('signup-email')?.value;
  const password = document.getElementById('signup-password')?.value;

  if (!name || !mobile || !email || !password) {
    showPopup('Error', 'Please fill in all fields');
    return;
  }

  // Show dashboard using active class (preserves flex layout)
  const authPage = document.getElementById('auth-page');
  const dashboardPage = document.getElementById('dashboard-page');

  if (authPage) authPage.classList.remove('active');
  if (dashboardPage) dashboardPage.classList.add('active');

  // Show header buttons
  document.querySelectorAll('.icon-btn').forEach(btn => {
    btn.style.display = 'flex';
  });

  showPopup('Success', 'Account created successfully!');
};

window.googleAuth = function() {
  // Show dashboard using active class (preserves flex layout)
  const authPage = document.getElementById('auth-page');
  const dashboardPage = document.getElementById('dashboard-page');

  if (authPage) authPage.classList.remove('active');
  if (dashboardPage) dashboardPage.classList.add('active');

  // Show header buttons
  document.querySelectorAll('.icon-btn').forEach(btn => {
    btn.style.display = 'flex';
  });

  showPopup('Success', 'Google authentication successful!');
};

window.closePopup = closePopup;