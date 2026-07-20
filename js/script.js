document.addEventListener("DOMContentLoaded", function() {
    const menuToggle = document.querySelector(".menu-toggle");
    const buttonGrid = document.querySelector(".button-grid");
    const content = document.querySelector(".content");

    if (menuToggle && buttonGrid) {
        menuToggle.addEventListener("click", function() {
            buttonGrid.classList.toggle("active");
            content.classList.toggle("dimmed"); // Adiciona o efeito de esmaecer o fundo
            
            const icon = menuToggle.querySelector("i");
            icon.className = buttonGrid.classList.contains("active") ? "fa-solid fa-xmark" : "fa-solid fa-bars";
        });
    }
});