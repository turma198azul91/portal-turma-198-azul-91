document.addEventListener("DOMContentLoaded", function() {
    const menuToggle = document.querySelector(".menu-toggle");
    const navMenu = document.querySelector(".button-grid") || document.querySelector(".navbar");
    const content = document.querySelector(".content") || document.querySelector(".content-wrapper");

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", function(e) {
            navMenu.classList.toggle("active");
            if (content) content.classList.toggle("dimmed");
            
            const icon = menuToggle.querySelector("i");
            if (icon) {
                icon.className = navMenu.classList.contains("active") ? "fa-solid fa-xmark" : "fa-solid fa-bars";
            }
        });
    }
});