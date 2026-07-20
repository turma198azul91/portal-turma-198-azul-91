document.addEventListener("DOMContentLoaded", function() {
    const menuToggle = document.querySelector(".menu-toggle");
    const navMenu = document.querySelector(".button-grid");

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", function() {
            navMenu.classList.toggle("active");
            
            const icon = menuToggle.querySelector("i");
            if (navMenu.classList.contains("active")) {
                icon.className = "fa-solid fa-xmark";
            } else {
                icon.className = "fa-solid fa-bars";
            }
        });
    }
});