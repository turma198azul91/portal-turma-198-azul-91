document.addEventListener("DOMContentLoaded", function() {
    const URL_SCRIPT_GOOGLE = "https://script.google.com/macros/s/AKfycbx-bdGLvhe9bIAd9pxif3sQ1MCifJnlV-KTUDMkyHXQvVAVmii2O6rHfrjPLUxI-w-f/exec";

    const modal = document.getElementById("modalValidacao");
    const btnFechar = document.getElementById("btnFecharModal");
    const formValidacao = document.getElementById("formValidacao");
    const textoPergunta = document.getElementById("modalTextoPergunta");
    const idPerguntaInput = document.getElementById("modalIdPergunta");
    const msgErro = document.getElementById("modalMensagemErro");
    const btnEnviar = document.getElementById("btnEnviarValidacao");

    const botoesAdicionar = document.querySelectorAll('.btn-add');

    // Força o nome do botão para apenas "Validar"
    if (btnEnviar) {
        btnEnviar.innerHTML = '<i class="fa-solid fa-check"></i> Validar';
    }

    function carregarPerguntaAleatoria() {
        textoPergunta.innerText = "Carregando pergunta de segurança...";
        idPerguntaInput.value = "";
        btnEnviar.disabled = true;
        msgErro.style.display = "none";

        fetch(URL_SCRIPT_GOOGLE)
            .then(res => res.json())
            .then(data => {
                idPerguntaInput.value = data.id;
                textoPergunta.innerText = data.pergunta;
                btnEnviar.disabled = false;
            })
            .catch(err => {
                textoPergunta.innerText = "Falha ao conectar com o servidor da turma. Tente novamente.";
                console.error(err);
            });
    }

    botoesAdicionar.forEach(botao => {
        botao.addEventListener("click", function(e) {
            e.preventDefault();
            formValidacao.reset();
            modal.style.display = "flex";
            carregarPerguntaAleatoria();
        });
    });

    btnFechar.addEventListener("click", function() {
        modal.style.display = "none";
    });

    window.addEventListener("click", function(e) {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });

    formValidacao.addEventListener("submit", function(e) {
        e.preventDefault();

        btnEnviar.disabled = true;
        btnEnviar.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Validando...';
        msgErro.style.display = "none";

        const milhao = document.getElementById("modalMilhao").value;
        const senha = document.getElementById("modalSenha").value;
        const idPergunta = idPerguntaInput.value;
        const resposta = document.getElementById("modalResposta").value;

        const urlValidacao = URL_SCRIPT_GOOGLE + 
            "?milhao=" + encodeURIComponent(milhao) + 
            "&senha=" + encodeURIComponent(senha) + 
            "&idP=" + encodeURIComponent(idPergunta) + 
            "&resp=" + encodeURIComponent(resposta);

        fetch(urlValidacao)
            .then(res => res.json())
            .then(respostaReal => {
                btnEnviar.disabled = false;
                btnEnviar.innerHTML = '<i class="fa-solid fa-check"></i> Validar';

                if (respostaReal.status === "SUCESSO") {
                    modal.style.display = "none";
                    alert("Credenciais Confirmadas! Redirecionando para a área de upload...");
                } 
                else if (respostaReal.status === "BLOQUEADO_ATIVO") {
                    // Já está no castigo de 30 minutos: fecha direto e exibe o alerta (preservando o tempo)
                    modal.style.display = "none";
                    alert("Usuário bloqueado. Contate o administrador!");
                } 
                else {
                    if (!respostaReal.milhaoValido) {
                        // SITUAÇÃO 2 (Intruso): O Google já salvou o bloqueio no clique. Fecha e avisa.
                        modal.style.display = "none";
                        alert("Usuário bloqueado. Contate o administrador!");
                    } else {
                        // SITUAÇÃO 1 (Participante): Errou dados mas o Milhão é quente.
                        // Mostra o alert primeiro; a contagem só inicia após clicar no "Ok".
                        alert("Usuário bloqueado. Contate o administrador!");
                        modal.style.display = "none";
                        
                        // Notifica o Google para iniciar a gravação do cronômetro agora
                        fetch(URL_SCRIPT_GOOGLE + "?registrarBloqueioAposOk=" + encodeURIComponent(milhao));
                    }
                }
            })
            .catch(err => {
                console.error(err);
                btnEnviar.disabled = false;
                btnEnviar.innerHTML = '<i class="fa-solid fa-check"></i> Validar';
                modal.style.display = "none";
                alert("Usuário bloqueado. Contate o administrador!");
            });
    });
});