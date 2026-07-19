document.addEventListener("DOMContentLoaded", function() {
    const URL_SCRIPT_GOOGLE = "https://script.google.com/macros/s/AKfycbwbMe2KAv2zYMpQTpDUAv0QDvK7vexGTSDjbQMatLBJ925GF_sXl_ZNoO1aeHyK9u73/exec";

    const modal = document.getElementById("modalValidacao");
    const btnFechar = document.getElementById("btnFecharModal");
    const formValidacao = document.getElementById("formValidacao");
    const textoPergunta = document.getElementById("modalTextoPergunta");
    const idPerguntaInput = document.getElementById("modalIdPergunta");
    const msgErro = document.getElementById("modalMensagemErro");
    const btnEnviar = document.getElementById("btnEnviarValidacao");

    const botoesAdicionar = document.querySelectorAll('.btn-add');

    // Altera dinamicamente o texto do botão para "Validar"
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

        // Monta a requisição para o Google validar as credenciais e o intervalo do milhão
        const urlValidacao = URL_SCRIPT_GOOGLE + 
            "?milhao=" + milhao + 
            "&senha=" + encodeURIComponent(senha) + 
            "&idP=" + idPergunta + 
            "&resp=" + encodeURIComponent(resposta);

        // SITUAÇÃO 2 (Gatilho Imediato): Se o Milhão for inválido (intruso), o tempo de 30 min inicia JÁ NO CLIQUE DO VALIDAR
        // O script do Google retornará se o milhão é válido ou não através da propriedade 'milhaoValido'
        
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
                    // Se já estiver no bloqueio de 30 minutos (Planilha), barra direto mantendo o tempo anterior
                    modal.style.display = "none";
                    alert("Usuário bloqueado. Contate o administrador!");
                } 
                else {
                    // Houve erro de digitação de credenciais
                    if (!respostaReal.milhaoValido) {
                        // CASO DO INTRUSO (Milhão incorreto): O bloqueio já foi disparado no clique (computado pelo Google)
                        modal.style.display = "none";
                        alert("Usuário bloqueado. Contate o administrador!");
                    } else {
                        // SITUAÇÃO 1 (Participante): Milhão correto, mas errou senha/resposta.
                        // O bloqueio só passa a contar DEPOIS que ele clica no "Ok" do alert
                        alert("Usuário bloqueado. Contate o administrador!");
                        
                        // O código abaixo só executa após o usuário fechar o alert acima
                        modal.style.display = "none";
                        
                        // Notifica o servidor do Google para cravar o início do bloqueio a partir deste exato segundo
                        fetch(URL_SCRIPT_GOOGLE + "?registrarBloqueioAposOk=" + milhao);
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