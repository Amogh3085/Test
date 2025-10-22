class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '';
        this.previousOperand = '';
        this.operation = undefined;
        this.updateDisplay();
    }

    delete() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '') {
            this.currentOperand = '0';
        }
        this.updateDisplay();
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number.toString();
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
        this.updateDisplay();
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
        this.updateDisplay();
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
                computation = prev * current;
                break;
            case '/':
                if (current === 0) {
                    alert('Cannot divide by zero!');
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }
        
        // Round to avoid floating point precision issues
        computation = Math.round((computation + Number.EPSILON) * 100000000) / 100000000;
        
        this.currentOperand = computation;
        this.operation = undefined;
        this.previousOperand = '';
        this.updateDisplay();
    }

    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            });
        }
        
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        if (this.currentOperand === '') {
            this.currentOperandTextElement.innerText = '0';
        } else {
            this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand);
        }
        
        if (this.operation != null) {
            this.previousOperandTextElement.innerText = 
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandTextElement.innerText = '';
        }
    }
}

// Initialize calculator
const previousOperandTextElement = document.getElementById('previousOperand');
const currentOperandTextElement = document.getElementById('currentOperand');

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

// Keyboard support
document.addEventListener('keydown', function(event) {
    if (event.key >= '0' && event.key <= '9' || event.key === '.') {
        calculator.appendNumber(event.key);
    }
    
    if (event.key === '+' || event.key === '-' || event.key === '*' || event.key === '/') {
        calculator.chooseOperation(event.key);
    }
    
    if (event.key === 'Enter' || event.key === '=') {
        event.preventDefault();
        calculator.compute();
    }
    
    if (event.key === 'Backspace') {
        event.preventDefault();
        calculator.delete();
    }
    
    if (event.key === 'Escape') {
        calculator.clear();
    }
});

// Prevent right-click context menu on calculator
document.querySelector('.calculator').addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

// Add visual feedback for keyboard presses
document.addEventListener('keydown', function(event) {
    const keyMap = {
        '0': 'calculator.appendNumber("0")',
        '1': 'calculator.appendNumber("1")',
        '2': 'calculator.appendNumber("2")',
        '3': 'calculator.appendNumber("3")',
        '4': 'calculator.appendNumber("4")',
        '5': 'calculator.appendNumber("5")',
        '6': 'calculator.appendNumber("6")',
        '7': 'calculator.appendNumber("7")',
        '8': 'calculator.appendNumber("8")',
        '9': 'calculator.appendNumber("9")',
        '.': 'calculator.appendNumber(".")',
        '+': 'calculator.chooseOperation("+")',
        '-': 'calculator.chooseOperation("-")',
        '*': 'calculator.chooseOperation("*")',
        '/': 'calculator.chooseOperation("/")',
        'Escape': 'calculator.clear()',
        'Backspace': 'calculator.delete()'
    };
    
    if (keyMap[event.key]) {
        // Find and highlight the corresponding button
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(btn => {
            if (btn.onclick && btn.onclick.toString().includes(keyMap[event.key].split('(')[1].split(')')[0])) {
                btn.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    btn.style.transform = '';
                }, 100);
            }
        });
    }
});