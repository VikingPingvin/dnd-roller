// D&D Dice Roller - Client-Side JavaScript Implementation
// Converted from Go backend to work with GitHub Pages

class DiceRoller {
    constructor() {
        this.diceInput = '';
    }

    // Main dice rolling function - equivalent to Go's rollDice()
    rollDice(input) {
        const roll = {
            input: input,
            result: 0,
            details: '',
            error: ''
        };

        // Parse dice notation and modifiers
        const diceRegex = /(\d+)d(\d+)/g;
        const diceMatches = [...input.matchAll(diceRegex)];

        if (diceMatches.length === 0) {
            roll.error = "Invalid dice notation. Use format like '1d6', '2d8+3', or '1d20+2d6'";
            return roll;
        }

        let totalResult = 0;
        const details = [];

        // Process each dice group
        for (const match of diceMatches) {
            const count = parseInt(match[1]);
            const sides = parseInt(match[2]);

            if (count <= 0 || count > 100) {
                roll.error = "Dice count must be between 1 and 100";
                return roll;
            }
            if (sides <= 0 || sides > 1000) {
                roll.error = "Dice sides must be between 1 and 1000";
                return roll;
            }

            // Roll the dice
            const rolls = [];
            let subtotal = 0;
            for (let i = 0; i < count; i++) {
                const result = this.rollSingleDie(sides);
                rolls.push(result);
                subtotal += result;
            }

            const rollsStr = rolls.join(', ');
            if (count === 1) {
                details.push(`${count}d${sides}: ${subtotal}`);
            } else {
                details.push(`${count}d${sides}: [${rollsStr}] = ${subtotal}`);
            }

            totalResult += subtotal;
        }

        // Handle modifiers (simple approach: find all +/- numbers not preceded by 'd')
        const modRegex = /[+-]\d(?!d)+/g;
        const allMods = input.match(modRegex) || [];

        for (const mod of allMods) {
            // Simple check: if the modifier position in string is not right after a 'd', it's a standalone modifier
            const modPos = input.indexOf(mod);
            if (modPos > 0 && input[modPos - 1] !== 'd') {
                const modifier = parseInt(mod);
                totalResult += modifier;
                if (modifier > 0) {
                    details.push(`(+${modifier})`);
                } else {
                    details.push(`(${modifier})`);
                }
            }
        }

        roll.result = totalResult;
        roll.details = details.join(' ');
        return roll;
    }

    // Cryptographically secure random number generator - equivalent to Go's rollSingleDie()
    rollSingleDie(sides) {
        // Use crypto.getRandomValues for secure random numbers
        const array = new Uint32Array(1);
        crypto.getRandomValues(array);

        // Convert to range [1, sides]
        return (array[0] % sides) + 1;
    }

    // Handle form submission
    async handleSubmit(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const input = formData.get('dice').trim();

        if (!input) {
            this.displayResult({
                error: 'Please enter dice notation'
            });
            return;
        }

        const roll = this.rollDice(input);
        this.displayResult(roll);
    }

    // Display results in the UI
    displayResult(roll) {
        const resultsDiv = document.getElementById('results');

        if (roll.error) {
            resultsDiv.innerHTML = `
                <div class="text-red-500 text-center">
                    <div class="text-4xl mb-2">❌</div>
                    <p class="text-sm">Error: ${roll.error}</p>
                </div>
            `;
        } else {
            resultsDiv.innerHTML = `
                <div class="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <div class="text-3xl font-bold text-green-800 mb-2">${roll.result}</div>
                    <div class="text-sm text-green-600 mb-1">${roll.details}</div>
                    <div class="text-xs text-gray-500">Input: ${roll.input}</div>
                </div>
            `;
        }
    }

    // Set example dice value and submit
    async rollExample(value) {
        const input = document.querySelector('input[name="dice"]');
        input.value = value;
        this.diceInput = value;

        // Trigger form submission
        const form = document.querySelector('form');
        if (form) {
            const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
            form.dispatchEvent(submitEvent);
        }
    }

    // Initialize the app
    init() {
        // Bind form submission
        const form = document.querySelector('form');
        if (form) {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        }

        // Auto-focus input
        const input = document.querySelector('input[name="dice"]');
        if (input) {
            input.focus();

            // Bind input changes to internal state
            input.addEventListener('input', (e) => {
                this.diceInput = e.target.value;
            });
        }

        // Bind example buttons
        const exampleButtons = document.querySelectorAll('[data-example]');
        exampleButtons.forEach(button => {
            const value = button.getAttribute('data-example');
            button.addEventListener('click', () => this.rollExample(value));
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.diceRoller = new DiceRoller();
    window.diceRoller.init();
});