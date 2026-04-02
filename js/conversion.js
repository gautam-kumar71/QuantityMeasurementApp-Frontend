// ========== DATA ==========
export const units = {
  length: ['Centimeter','Inch','Feet','Yard','Meter'],
  weight: ['Milligram','Gram','Kilogram','Tonne'],
  temperature: ['Celsius','Fahrenheit','Kelvin'],
  volume: ['Milliliter','Liter','Gallon']
};

// Conversion to base unit (SI)
export const toBase = {
  length: {
    Centimeter: 0.01,
    Inch: 0.0254,
    Feet: 0.3048,
    Yard: 0.9144,
    Meter: 1,
  },
  weight: {
    Milligram: 0.000001,
    Gram: 0.001,
    Kilogram: 1,
    Tonne: 1000,
  },
  volume: {
    Milliliter: 0.001,
    Liter: 1,
    Gallon: 3.78541,
  }
};

// Pure JS functions for conversion, comparison, arithmetic logic

// Convert value from one unit to another
export function convert(value, fromUnit, toUnit, type) {
  if (type === 'temperature') {
    return convertTemp(value, fromUnit, toUnit);
  }

  if (!toBase[type] || !toBase[type][fromUnit] || !toBase[type][toUnit]) {
    throw new Error(`Invalid units for ${type} conversion`);
  }

  // Convert to base unit first, then to target unit
  const baseValue = value * toBase[type][fromUnit];
  const result = baseValue / toBase[type][toUnit];

  return result;
}

// Temperature conversion (special case)
export function convertTemp(val, from, to) {
  let celsius;
  if (from === 'Celsius') celsius = val;
  else if (from === 'Fahrenheit') celsius = (val - 32) * 5/9;
  else if (from === 'Kelvin') celsius = val - 273.15;
  else throw new Error('Invalid temperature unit');

  if (to === 'Celsius') return celsius;
  if (to === 'Fahrenheit') return celsius * 9/5 + 32;
  if (to === 'Kelvin') return celsius + 273.15;
  throw new Error('Invalid temperature unit');
}

// Compare two values
export function compare(value1, unit1, value2, unit2, type) {
  const convertedValue1 = convert(value1, unit1, unit1, type); // Keep in same unit for comparison
  const convertedValue2 = convert(value2, unit2, unit1, type);

  if (Math.abs(convertedValue1 - convertedValue2) < 0.000001) {
    return 'equal';
  }
  return convertedValue1 > convertedValue2 ? 'greater' : 'less';
}

// Arithmetic operations
export function arithmetic(value1, value2, operator, unit, type) {
  let result;

  switch (operator) {
    case '+':
      result = value1 + value2;
      break;
    case '-':
      result = value1 - value2;
      break;
    case '*':
      result = value1 * value2;
      break;
    case '/':
      if (value2 === 0) throw new Error('Division by zero');
      result = value1 / value2;
      break;
    default:
      throw new Error('Invalid operator');
  }

  return {
    value: result,
    unit: unit,
    type: type
  };
}

// Format result for display
export function formatResult(value, unit) {
  // Round to appropriate decimal places
  let rounded;
  if (Math.abs(value) >= 1000) {
    rounded = Math.round(value);
  } else if (Math.abs(value) >= 1) {
    rounded = Math.round(value * 100) / 100;
  } else {
    rounded = Math.round(value * 10000) / 10000;
  }

  return {
    value: rounded,
    unit: unit,
    display: `${rounded} ${unit}`
  };
}
