// --- 1. Configuration & Data ---
const API_BASE_URL = 'http://localhost:8080/api/v1/quantities';

// Mapping frontend types to backend enums and units
// Change this to match your exact Java enum spellings
const unitData = {
    'LENGTHUNIT': ['FEET', 'INCHES', 'YARDS', 'CENTIMETER'],
    
    'WEIGHTUNIT': [ 'GRAM', 'KILOGRAM', 'TONNE'], 
    'TEMPERATUREUNIT': ['CELSIUS', 'FAHRENHEIT' ],
    'VOLUMEUNIT': ['LITER', 'GALLON', 'MILLILITER']
};

let currentType = 'LENGTHUNIT';
let currentAction = 'COMPARE';

// --- 2. DOM Elements ---
const typeCards = document.querySelectorAll('.type-container .card');
const actionBtns = document.querySelectorAll('.action-container button');
const unit1Select = document.getElementById('unit1');
const unit2Select = document.getElementById('unit2');
const val1Input = document.getElementById('val1');
const val2Input = document.getElementById('val2');
const calculateBtn = document.getElementById('calculateBtn');
const resultDisplay = document.getElementById('resultDisplay');

// --- 3. Dynamic UI Updates ---
function populateDropdowns(type) {
    const units = unitData[type] || [];
    unit1Select.innerHTML = '';
    unit2Select.innerHTML = '';
    
    units.forEach(unit => {
        unit1Select.innerHTML += `<option value="${unit}">${unit}</option>`;
        unit2Select.innerHTML += `<option value="${unit}">${unit}</option>`;
    });
}

// Type Selection Click (Length, Weight, etc.)
typeCards.forEach(card => {
    card.addEventListener('click', () => {
        typeCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        
        // Map HTML text to Backend Enum (e.g., "Length" -> "LENGTHUNIT")
        const typeText = card.innerText.trim().toUpperCase();
        currentType = typeText + "UNIT"; 
        
        populateDropdowns(currentType);
        resultDisplay.innerText = "Result: --";
    });
});

// Action Selection Click (Compare, Convert, Add)
actionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        actionBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Map HTML text to Action
        const actionText = btn.innerText.trim().toUpperCase();
        if (actionText === 'COMPARISON') currentAction = 'COMPARE';
        if (actionText === 'CONVERSION') currentAction = 'CONVERT';
        if (actionText === 'ARITHMETIC') currentAction = 'ADD';

        // If Conversion, we don't need Value 2 (just converting Val1 to Unit2)
        if (currentAction === 'CONVERT') {
            val2Input.style.display = 'none';
        } else {
            val2Input.style.display = 'block';
        }
        
        resultDisplay.innerText = "Result: --";
    });
});

// Initialize first load
populateDropdowns(currentType);

// --- 4. API Communication ---
calculateBtn.addEventListener('click', async () => {
    // Build the payload that Spring Boot expects (QuantityInputDTO)
    const payload = {
        thisQuantityDTO: {
            value: parseFloat(val1Input.value),
            unit: unit1Select.value,
            measurementType: currentType
        },
        thatQuantityDTO: {
            value: currentAction === 'CONVERT' ? 0 : parseFloat(val2Input.value), // Ignore val2 for conversion
            unit: unit2Select.value,
            measurementType: currentType
        }
    };

    try {
        resultDisplay.innerText = "Calculating...";
        
        // Point to the correct endpoint based on action
        let endpoint = `${API_BASE_URL}/${currentAction.toLowerCase()}`;
        
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Calculation failed");
        }

        // Display results based on action
        if (currentAction === 'COMPARE') {
            resultDisplay.innerText = `Result: ${data.resultString.toUpperCase()}`; // TRUE or FALSE
        } else if (currentAction === 'ADD') {
            resultDisplay.innerText = `Result: ${data.resultValue} ${data.resultUnit}`;
        } else if (currentAction === 'CONVERT') {
            resultDisplay.innerText = `Result: ${data.resultValue} ${data.resultUnit}`;
        }

    } catch (error) {
        console.error(error);
        resultDisplay.innerText = `Error: ${error.message}`;
        resultDisplay.style.color = 'red';
        setTimeout(() => resultDisplay.style.color = 'black', 3000); // Reset color
    }
});

// --- Logout ---
document.getElementById('logoutBtn')?.addEventListener('click', () => {
    window.location.href = 'index.html';
});