document.addEventListener("DOMContentLoaded", function() {
    const URL_SCRIPT_GOOGLE = "https://script.google.com/macros/s/AKfycbxECF41_kBjztmwdSqSEXD7oZ4GMyl3ESgHrreQZSdl2uHtH_60h8Ln4-JUEy-erDYk/exec";

    // Elementos do Modal de Validação
    const modalValidacao = document.getElementById("modalValidacao");
    const btnFecharValidacao = document.getElementById("btnFecharModal");
    const formValidacao = document.getElementById("formValidacao");
    const textoPergunta = document.getElementById("modalTextoPergunta");
    const idPerguntaInput = document.getElementById("modalIdPergunta");
    const btnEnviarValidacao = document.getElementById("btnEnviarValidacao");
    const divMensagemErro = document.getElementById("modalMensagemErro");

    // Botão único de disparo
    const btnAdicionarUnico = document.getElementById('btnUnicoAdicionar');

    if (btnAdicionarUnico) {
        btnAdicionarUnico.addEventListener("click", function(e) {
            e.preventDefault();
            formValidacao.reset();
            divMensagemErro.innerHTML = ""; // Limpa erros anteriores
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
        btnFecharValidacao.addEventListener("click", () => {
            modalValidacao.style.display = "none";
        });
    }

    // Fechar ao clicar fora do modal (opcional, mas melhora a experiência)
    window.addEventListener("click", (e) => {
        if (e.target === modalValidacao) {
            modalValidacao.style.display = "none";
        }
    });

    // Exibir mensagem de erro customizada com botão OK dentro do modal
    function mostrarMensagemBloqueio() {
        divMensagemErro.innerHTML = `
            <div style="background-color: #ffe6e6; color: #d9534f; padding: 10px; border-radius: 5px; text-align: center; margin-bottom: 10px; border: 1px solid #d9534f;">
                <strong>Usuário bloqueado. Contate o administrador!</strong><br><br>
                <button type="button" id="btnOkBloqueio" style="background-color: #d9534f; color: white; border: none; padding: 5px 15px; border-radius: 4px; cursor: pointer; font-weight: bold;">Ok</button>
            </div>
        `;
        
        // Esconde o botão de validar padrão enquanto exibe o aviso
        btnEnviarValidacao.style.display = "none";

        // Ação do botão OK para fechar a mensagem e o modal
        document.getElementById("btnOkBloqueio").addEventListener("click", function() {
            divMensagemErro.innerHTML = "";
            btnEnviarValidacao.style.display = "block";
            modalValidacao.style.display = "none";
        });
    }

    // Submit Validação
    formValidacao.addEventListener("submit", function(e) {
        e.preventDefault();
        btnEnviarValidacao.disabled = true;
        btnEnviarValidacao.innerHTML = 'Validando...';
        divMensagemErro.innerHTML = "";

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
                    // Redirecionamento para o Google Forms de upload
                    window.open("https://docs.google.com/forms/d/e/1FAIpQLSdH26N2dwNmlSGiiQvI9Y5ExBzHNiHd79ONWh7C2CR59oFsdA/viewform", '_blank');
                } else {
                    // Dispara a interface de bloqueio solicitada
                    mostrarMensagemBloqueio();
                }
                btnEnviarValidacao.disabled = false;
                btnEnviarValidacao.innerHTML = '<i class="fa-solid fa-check"></i> Validar';
            })
            .catch(() => {
                divMensagemErro.innerHTML = `<p style="color: #d9534f; text-align: center;">Erro de conexão com o servidor.</p>`;
                btnEnviarValidacao.disabled = false;
                btnEnviarValidacao.innerHTML = '<i class="fa-solid fa-check"></i> Validar';
            });
    });
});