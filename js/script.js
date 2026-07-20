document.addEventListener("DOMContentLoaded", function() {
    const menuToggle = document.querySelector(".menu-toggle");
    const buttonGrid = document.querySelector(".button-grid");

    if (menuToggle && buttonGrid) {
        menuToggle.addEventListener("click", function() {
            buttonGrid.classList.toggle("active");
            const icon = menuToggle.querySelector("i");
            icon.className = buttonGrid.classList.contains("active") ? "fa-solid fa-xmark" : "fa-solid fa-bars";
        });
    }
});