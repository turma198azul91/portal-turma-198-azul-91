document.addEventListener("DOMContentLoaded", function() {
    const menuToggle = document.querySelector(".menu-toggle");
    const navMenu = document.querySelector(".button-grid") || document.querySelector(".navbar");
    const content = document.querySelector(".content") || document.querySelector(".content-wrapper");
    const btnFecharMobile = document.querySelector(".menu-fechar-mobile");

    // Abertura e fechamento pelo menu toggle principal (canto superior direito)
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

    // Fechamento pelo botão "X" interno do menu mobile expandido
    if (btnFecharMobile && navMenu) {
        btnFecharMobile.addEventListener("click", function() {
            navMenu.classList.remove("active");
            if (content) content.classList.remove("dimmed");
            
            const icon = menuToggle ? menuToggle.querySelector("i") : null;
            if (icon) {
                icon.className = "fa-solid fa-bars";
            }
        });
    }
});