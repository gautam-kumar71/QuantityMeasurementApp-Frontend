// DOM helpers: populateDropdown(), showResult(), toggleOperators()

import { units } from './conversion.js';
import { state } from './state.js';

// Populate dropdown with units based on selected type
export function populateDropdown(selectId, type) {
  const select = document.getElementById(selectId);
  if (!select) return;

  select.innerHTML = '';

  const unitList = units[type] || [];
  unitList.forEach(unit => {
    const option = document.createElement('option');
    option.value = unit;
    option.textContent = unit;
    select.appendChild(option);
  });
}

// Show result in the result box
export function showResult(value, note = '') {
  const resultBox = document.getElementById('result-box');
  const resultValue = document.getElementById('result-value');
  const resultNote = document.getElementById('result-note');

  if (resultBox && resultValue) {
    resultValue.textContent = value;
    if (resultNote) {
      resultNote.textContent = note;
    }
    resultBox.classList.add('show');
  }
}

// Hide result box
export function hideResult() {
  const resultBox = document.getElementById('result-box');
  if (resultBox) {
    resultBox.classList.remove('show');
  }
}

// Toggle arithmetic operators visibility
export function toggleOperators(show) {
  const dualCalc = document.getElementById('dual-calc');
  const arithCalc = document.getElementById('arith-calc');

  if (show) {
    if (dualCalc) dualCalc.style.display = 'none';
    if (arithCalc) arithCalc.style.display = 'block';
  } else {
    if (dualCalc) dualCalc.style.display = 'grid';
    if (arithCalc) arithCalc.style.display = 'none';
  }
}

// Update action button text based on selected action
export function updateActionButton(action) {
  const btn = document.getElementById('main-action-btn');
  if (!btn) return;

  switch (action) {
    case 'comparison':
      btn.textContent = 'Compare';
      break;
    case 'conversion':
      btn.textContent = 'Convert';
      break;
    case 'arithmetic':
      btn.textContent = 'Calculate';
      break;
    default:
      btn.textContent = 'Calculate';
  }
}

// Update labels based on action
export function updateLabels(action) {
  const fromLabel = document.getElementById('from-label');
  const toLabel = document.getElementById('to-label');

  if (fromLabel && toLabel) {
    if (action === 'comparison') {
      fromLabel.textContent = 'VALUE 1';
      toLabel.textContent = 'VALUE 2';
    } else {
      fromLabel.textContent = 'FROM';
      toLabel.textContent = 'TO';
    }
  }
}

// Show custom popup
export function showPopup(title, message) {
  const popup = document.getElementById('custom-popup');
  const popupTitle = document.getElementById('popup-title');
  const popupMessage = document.getElementById('popup-message');

  if (popup && popupTitle && popupMessage) {
    popupTitle.textContent = title;
    popupMessage.textContent = message;
    popup.classList.add('show');
  }
}

// Close custom popup
export function closePopup() {
  const popup = document.getElementById('custom-popup');
  if (popup) {
    popup.classList.remove('show');
  }
}

// Get input values
export function getInputValues() {
  const valFrom = document.getElementById('val-from');
  const valTo = document.getElementById('val-to');
  const unitFrom = document.getElementById('unit-from');
  const unitTo = document.getElementById('unit-to');
  const arithA = document.getElementById('arith-a');
  const arithB = document.getElementById('arith-b');
  const arithOp = document.getElementById('arith-op');
  const arithUnit = document.getElementById('arith-unit');

  return {
    fromValue: parseFloat(valFrom?.value) || 0,
    toValue: parseFloat(valTo?.value) || 0,
    fromUnit: unitFrom?.value || '',
    toUnit: unitTo?.value || '',
    arithA: parseFloat(arithA?.value) || 0,
    arithB: parseFloat(arithB?.value) || 0,
    arithOp: arithOp?.value || '+',
    arithUnit: arithUnit?.value || ''
  };
}

// Set input values
export function setInputValues(values) {
  const { fromValue, toValue, arithA, arithB } = values;

  const valFrom = document.getElementById('val-from');
  const valTo = document.getElementById('val-to');
  const arithAInput = document.getElementById('arith-a');
  const arithBInput = document.getElementById('arith-b');

  if (valFrom && fromValue !== undefined) valFrom.value = fromValue;
  if (valTo && toValue !== undefined) valTo.value = toValue;
  if (arithAInput && arithA !== undefined) arithAInput.value = arithA;
  if (arithBInput && arithB !== undefined) arithBInput.value = arithB;
}

// Highlight active type card
export function highlightTypeCard(type) {
  document.querySelectorAll('.type-card').forEach(card => {
    card.classList.remove('active');
  });
  const activeCard = document.getElementById(`type-${type}`);
  if (activeCard) {
    activeCard.classList.add('active');
  }
}

// Highlight active action tab
export function highlightActionTab(action) {
  document.querySelectorAll('.action-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  const activeTab = document.getElementById(`action-${action}`);
  if (activeTab) {
    activeTab.classList.add('active');
  }
}