document.addEventListener("DOMContentLoaded", function() {
    const menuToggle = document.querySelector(".menu-toggle");
    const navMenu = document.querySelector(".button-grid") || document.querySelector(".navbar");
    const content = document.querySelector(".content") || document.querySelector(".content-wrapper");
    const btnAdicionar = document.getElementById("btnUnicoAdicionar");
    const modal = document.getElementById("modalValidacao");

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", function(e) {
            e.stopPropagation();
            navMenu.classList.toggle("active");
            if (content) content.classList.toggle("dimmed");
            
            const icon = menuToggle.querySelector("i");
            if (icon) {
                icon.className = navMenu.classList.contains("active") ? "fa-solid fa-xmark" : "fa-solid fa-bars";
            }
        });
    }

    // Força a abertura do modal independente do estado da página
    if (btnAdicionar && modal) {
        btnAdicionar.addEventListener("click", function(e) {
            e.preventDefault();
            modal.style.display = "flex";
        });
    }
});