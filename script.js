let currentInput = '0';

function updateDisplay() {
    const display = document.getElementById('display');
    display.textContent = currentInput;
}

function appendToDisplay(value) {
    if (currentInput === '0' && !['+', '-', '*', '/', '%', '.'].includes(value)) {
        currentInput = value;
    } else {
        currentInput += value;
    }
    updateDisplay();
    console.log("Current Input:", currentInput); // Menggunakan console.log
}

function clearDisplay() {
    currentInput = '0';
    updateDisplay();
}

function deleteLast() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    updateDisplay();
}

function calculate() {
    try {
        // Menggunakan eval()  
        const result = eval(currentInput); 
        
        // Menggunakan DOM & Event
        const historyList = document.getElementById('history-list');
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.textContent = `${currentInput} = ${result}`;
        historyList.prepend(historyItem);

        // Efek Menggunakan jQuery 
        $('#display').fadeOut(100).fadeIn(100);
        
        currentInput = result.toString();
        updateDisplay();
    } catch (error) {
        alert('Invalid expression!'); // Menggunakan alert 
        clearDisplay();
    }
}

/* interaktif menggunakan jQuery */
$(document).ready(function() {
    // Efek Awal: FadeIn Card
    $('.calculator-card').fadeIn(1000);

    // efek Hover menggunakan jQuery
    $('.btn-calc').hover(
        function() { $(this).css('opacity', '0.8'); },
        function() { $(this).css('opacity', '1'); }
    );
});
