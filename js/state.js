// Module-level state management for the quantity measurement app

export const state = {
  selectedType: 'length', // Current measurement type (length, weight, temperature, volume)
  selectedAction: 'comparison', // Current action (comparison, conversion, arithmetic)
  values: {
    from: 1,
    to: 1,
    arithA: 1,
    arithB: 1
  },
  units: {
    from: '',
    to: '',
    arith: ''
  },
  operator: '+'
};

// State management functions
export function setSelectedType(type) {
  state.selectedType = type;
}

export function setSelectedAction(action) {
  state.selectedAction = action;
}

export function updateValue(field, value) {
  state.values[field] = value;
}

export function updateUnit(field, unit) {
  state.units[field] = unit;
}

export function setOperator(op) {
  state.operator = op;
}

export function getState() {
  return { ...state };
}

export function resetValues() {
  state.values = {
    from: 1,
    to: 1,
    arithA: 1,
    arithB: 1
  };
}