// Object to keep track of calculator data
const calculator = {
    displayValue: '0',
    firstOperand: null,
    waitingForSecondOperand: false,
    operator: null,
};

// Updates the HTML screen text
function updateDisplay() {
    const screen = document.getElementById('screen');
    screen.innerText = calculator.displayValue;
}
updateDisplay();

// Handle Digit Inputs
function inputDigit(digit) {
    const { displayValue, waitingForSecondOperand } = calculator;

    if (waitingForSecondOperand === true) {
        calculator.displayValue = digit;
        calculator.waitingForSecondOperand = false;
    } else {
        calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
    }
}

// Handle Decimal Point
function inputDecimal(dot) {
    if (calculator.waitingForSecondOperand === true) {
        calculator.displayValue = "0.";
        calculator.waitingForSecondOperand = false;
        return;
    }

    if (!calculator.displayValue.includes(dot)) {
        calculator.displayValue += dot;
    }
}

// Handle Operators (+, -, *, /)
function handleOperator(nextOperator) {
    const { firstOperand, displayValue, operator } = calculator;
    const inputValue = parseFloat(displayValue);

    if (operator && calculator.waitingForSecondOperand)  {
        calculator.operator = nextOperator;
        return;
    }

    if (firstOperand === null && !isNaN(inputValue)) {
        calculator.firstOperand = inputValue;
    } else if (operator) {
        const result = calculate(firstOperand, inputValue, operator);
        calculator.displayValue = `${parseFloat(result.toFixed(7))}`; // Limit trailing decimals
        calculator.firstOperand = result;
    }

    calculator.waitingForSecondOperand = true;
    calculator.operator = nextOperator;
}

// Basic Math Operations Engine
function calculate(firstOperand, secondOperand, operator) {
    if (operator === '+') return firstOperand + secondOperand;
    if (operator === '-') return firstOperand - secondOperand;
    if (operator === '*') return firstOperand * secondOperand;
    if (operator === '/') return firstOperand / secondOperand;

    return secondOperand;
}

// Reset everything (AC Button)
function resetCalculator() {
    calculator.displayValue = '0';
    calculator.firstOperand = null;
    calculator.waitingForSecondOperand = false;
    calculator.operator = null;
}

// Click Listeners for Buttons
const keys = document.querySelector('.calculator-keys');
keys.addEventListener('click', (event) => {
    const { target } = event;
    if (!target.matches('button')) return;

    if (target.classList.contains('operator')) {
        handleOperator(target.value);
        updateDisplay();
        return;
    }

    if (target.classList.contains('all-clear')) {
        resetCalculator();
        updateDisplay();
        return;
    }

    if (target.value === '.') {
        inputDecimal(target.value);
        updateDisplay();
        return;
    }

    if (target.value === '=') {
        handleOperator(calculator.operator);
        calculator.operator = null;
        calculator.waitingForSecondOperand = false;
        updateDisplay();
        return;
    }

    inputDigit(target.value);
    updateDisplay();
});


// BONUS: KEYBOARD SUPPORT
document.addEventListener('keydown', (event) => {
    let key = event.key;

    if (key >= '0' && key <= '9') {
        inputDigit(key);
    } else if (key === '.') {
        inputDecimal(key);
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        handleOperator(key);
    } else if (key === 'Enter' || key === '=') {
        handleOperator(calculator.operator);
        calculator.operator = null;
        calculator.waitingForSecondOperand = false;
    } else if (key === 'Escape' || key.toLowerCase() === 'c') {
        resetCalculator();
    }
    updateDisplay();
});