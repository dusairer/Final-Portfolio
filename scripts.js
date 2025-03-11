// JavaScript file for Final Portfolio

// Add your JavaScript code here

document.addEventListener('DOMContentLoaded', function() {
    console.log('Document is ready');
    // Add more JavaScript code here

    // Interactive card color change logic
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.backgroundColor = 'red';
        });
        card.addEventListener('mouseleave', () => {
            card.style.backgroundColor = '';
        });
    });
});