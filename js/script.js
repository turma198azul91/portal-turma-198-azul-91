document.addEventListener("DOMContentLoaded", function() {
    const menuToggle = document.querySelector(".menu-toggle");
    const navbar = document.querySelector(".navbar");

    if (menuToggle && navbar) {
        menuToggle.addEventListener("click", function() {
            navbar.classList.toggle("active");
            
            // Muda o ícone de barras para o "X" quando estiver aberto
            const icon = menuToggle.querySelector("i");
            if (navbar.classList.contains("active")) {
                icon.className = "fa-solid fa-xmark";
            } else {
                icon.className = "fa-solid fa-bars";
            }
        });
    }
});