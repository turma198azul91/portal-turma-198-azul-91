document.addEventListener("DOMContentLoaded", function() {
    const URL_SCRIPT_GOOGLE = "https://script.google.com/macros/s/AKfycbxbRjnv7_5dz5YDc2kPZRMkiPGcqiQfAm2b35uNbx35sx0Mp6KHcasjLh4vt9EEpc6a/exec";

    const modal = document.getElementById("modalValidacao");
    const btnFechar = document.getElementById("btnFecharModal");
    const formValidacao = document.getElementById("formValidacao");
    const textoPergunta = document.getElementById("modalTextoPergunta");
    const idPerguntaInput = document.getElementById("modalIdPergunta");
    const msgErro = document.getElementById("modalMensagemErro");
    const btnEnviar = document.getElementById("btnEnviarValidacao");

    const botoesAdicionar = document.querySelectorAll('.btn-add');

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

        const dadosFormulario = {
            milhao: document.getElementById("modalMilhao").value,
            senha: document.getElementById("modalSenha").value,
            idPergunta: idPerguntaInput.value,
            resposta: document.getElementById("modalResposta").value
        };

        fetch(URL_SCRIPT_GOOGLE, {
            method: "POST",
            mode: "no-cors",
            cache: "no-cache",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dadosFormulario)
        })
        .then(() => {
            setTimeout(() => {
                fetch(URL_SCRIPT_GOOGLE)
                .then(res => res.json())
                .then(verificacao => {
                });
            }, 500);

            fetch(URL_SCRIPT_GOOGLE + "?milhao=" + dadosFormulario.milhao + "&senha=" + encodeURIComponent(dadosFormulario.senha) + "&idP=" + dadosFormulario.idPergunta + "&resp=" + encodeURIComponent(dadosFormulario.resposta))
            .then(res => res.json())
            .then(respostaReal => {
                btnEnviar.disabled = false;
                btnEnviar.innerHTML = '<i class="fa-solid fa-check"></i> Validar Credenciais';

                if (respostaReal.status === "SUCESSO") {
                    modal.style.display = "none";
                    
                    alert("Credenciais Confirmadas! Redirecionando para a área de upload...");
                    
                } else {
                    msgErro.innerText = respostaReal.mensagem;
                    msgErro.style.display = "block";
                    
                    btnEnviar.disabled = true;
                }
            })
            .catch(() => {
                btnEnviar.disabled = false;
                btnEnviar.innerHTML = '<i class="fa-solid fa-check"></i> Validar Credenciais';
                msgErro.innerText = "Erro ao processar validação. Tente novamente.";
                msgErro.style.display = "block";
            });
        });
    });
});