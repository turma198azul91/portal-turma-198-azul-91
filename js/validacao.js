document.addEventListener("DOMContentLoaded", function() {
    const URL_SCRIPT_GOOGLE = "https://script.google.com/macros/s/AKfycbwi4tURTbxEkAQlShzb8zbtiNtABlg4M7ia6yINWWZEZkEfNzYDksDZAINEZzI0DzCn/exec";

    // Elementos do Modal de Validação
    const modalValidacao = document.getElementById("modalValidacao");
    const btnFecharValidacao = document.getElementById("btnFecharModal");
    const formValidacao = document.getElementById("formValidacao");
    const textoPergunta = document.getElementById("modalTextoPergunta");
    const idPerguntaInput = document.getElementById("modalIdPergunta");
    const btnEnviarValidacao = document.getElementById("btnEnviarValidacao");

    // Botão único de disparo
    const btnAdicionarUnico = document.getElementById('btnUnicoAdicionar');

    if (btnAdicionarUnico) {
        btnAdicionarUnico.addEventListener("click", function(e) {
            e.preventDefault();
            formValidacao.reset();
            modalValidacao.style.display = "flex";
            carregarPerguntaAleatoria();
        });
    }

    function carregarPerguntaAleatoria() {
        textoPergunta.innerText = "Carregando pergunta de segurança...";
        btnEnviarValidacao.disabled = true;

        fetch(URL_SCRIPT_GOOGLE)
            .then(res => res.json())
            .then(data => {
                idPerguntaInput.value = data.id;
                textoPergunta.innerText = data.pergunta;
                btnEnviarValidacao.disabled = false;
            })
            .catch(err => {
                textoPergunta.innerText = "Falha ao conectar. Tente novamente.";
                console.error(err);
            });
    }

    // Fechar modal
    if (btnFecharValidacao) {
        btnFecharValidacao.addEventListener("click", () => modalValidacao.style.display = "none");
    }

    // Submit Validação
    formValidacao.addEventListener("submit", function(e) {
        e.preventDefault();
        btnEnviarValidacao.disabled = true;
        btnEnviarValidacao.innerHTML = 'Validando...';

        const params = new URLSearchParams({
            milhao: document.getElementById("modalMilhao").value,
            senha: document.getElementById("modalSenha").value,
            idP: idPerguntaInput.value,
            resp: document.getElementById("modalResposta").value
        });

        fetch(URL_SCRIPT_GOOGLE + "?" + params.toString())
            .then(res => res.json())
            .then(respostaReal => {
                if (respostaReal.status === "SUCESSO") {
                    modalValidacao.style.display = "none";
                    // Redirecionamento para o seu Google Forms
                    window.open("https://docs.google.com/forms/d/e/1FAIpQLSdH26N2dwNmlSGiiQvI9Y5ExBzHNiHd79ONWh7C2CR59oFsdA/viewform", '_blank');
                } else {
                    alert("Usuário bloqueado ou dados incorretos!");
                }
                btnEnviarValidacao.disabled = false;
                btnEnviarValidacao.innerHTML = 'Validar';
            })
            .catch(() => {
                alert("Erro de conexão.");
                btnEnviarValidacao.disabled = false;
            });
    });
});