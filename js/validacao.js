document.addEventListener("DOMContentLoaded", function() {
    const URL_SCRIPT_GOOGLE = "https://script.google.com/macros/s/AKfycbx-bdGLvhe9bIAd9pxif3sQ1MCifJnlV-KTUDMkyHXQvVAVmii2O6rHfrjPLUxI-w-f/exec";

    // Elementos do Modal 1: Validação
    const modalValidacao = document.getElementById("modalValidacao");
    const btnFecharValidacao = document.getElementById("btnFecharModal");
    const formValidacao = document.getElementById("formValidacao");
    const textoPergunta = document.getElementById("modalTextoPergunta");
    const idPerguntaInput = document.getElementById("modalIdPergunta");
    const msgErro = document.getElementById("modalMensagemErro");
    const btnEnviarValidacao = document.getElementById("btnEnviarValidacao");

    // Elementos do Modal 2: Upload
    const modalUpload = document.getElementById("modalUpload");
    const btnFecharUpload = document.getElementById("btnFecharModalUpload");
    const formUpload = document.getElementById("formUpload");
    const btnEnviarUpload = document.getElementById("btnEnviarUpload");
    const areaProgresso = document.getElementById("areaProgresso");
    const barraProgresso = document.getElementById("barraProgresso");

    const botoesAdicionar = document.querySelectorAll('.btn-add');

    if (btnEnviarValidacao) {
        btnEnviarValidacao.innerHTML = '<i class="fa-solid fa-check"></i> Validar';
    }

    function carregarPerguntaAleatoria() {
        textoPergunta.innerText = "Carregando pergunta de segurança...";
        idPerguntaInput.value = "";
        btnEnviarValidacao.disabled = true;
        msgErro.style.display = "none";

        fetch(URL_SCRIPT_GOOGLE)
            .then(res => res.json())
            .then(data => {
                idPerguntaInput.value = data.id;
                textoPergunta.innerText = data.pergunta;
                btnEnviarValidacao.disabled = false;
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
            modalValidacao.style.display = "flex";
            carregarPerguntaAleatoria();
        });
    });

    // Fechamento dos Modais
    btnFecharValidacao.addEventListener("click", function() {
        modalValidacao.style.display = "none";
    });

    btnFecharUpload.addEventListener("click", function() {
        if (!btnEnviarUpload.disabled) { // Impede fechar enquanto envia
            modalUpload.style.display = "none";
        }
    });

    window.addEventListener("click", function(e) {
        if (e.target === modalValidacao) {
            modalValidacao.style.display = "none";
        }
        if (e.target === modalUpload && !btnEnviarUpload.disabled) {
            modalUpload.style.display = "none";
        }
    });

    // SUBMIT DO FORMULÁRIO DE VALIDAÇÃO
    formValidacao.addEventListener("submit", function(e) {
        e.preventDefault();

        btnEnviarValidacao.disabled = true;
        btnEnviarValidacao.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Validando...';
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
                btnEnviarValidacao.disabled = false;
                btnEnviarValidacao.innerHTML = '<i class="fa-solid fa-check"></i> Validar';

                if (respostaReal.status === "SUCESSO") {
                    modalValidacao.style.display = "none";
                    
                    // Sucesso total! Abre o modal de upload e pré-preenche o Milhão validado
                    formUpload.reset();
                    document.getElementById("uploadMilhao").value = milhao;
                    areaProgresso.style.display = "none";
                    barraProgresso.style.width = "0%";
                    modalUpload.style.display = "flex";
                } 
                else if (respostaReal.status === "BLOQUEADO_ATIVO") {
                    modalValidacao.style.display = "none";
                    alert("Usuário bloqueado. Contate o administrador!");
                } 
                else {
                    if (!respostaReal.milhaoValido) {
                        modalValidacao.style.display = "none";
                        alert("Usuário bloqueado. Contate o administrador!");
                    } else {
                        alert("Usuário bloqueado. Contate o administrador!");
                        modalValidacao.style.display = "none";
                        fetch(URL_SCRIPT_GOOGLE + "?registrarBloqueioAposOk=" + encodeURIComponent(milhao));
                    }
                }
            })
            .catch(err => {
                console.error(err);
                btnEnviarValidacao.disabled = false;
                btnEnviarValidacao.innerHTML = '<i class="fa-solid fa-check"></i> Validar';
                modalValidacao.style.display = "none";
                alert("Usuário bloqueado. Contate o administrador!");
            });
    });

    // SUBMIT DO FORMULÁRIO DE UPLOAD (Manda o arquivo em Base64 para o Drive)
    formUpload.addEventListener("submit", function(e) {
        e.preventDefault();

        const arquivoInput = document.getElementById("uploadArquivo");
        if (arquivoInput.files.length === 0) return;

        btnEnviarUpload.disabled = true;
        btnEnviarUpload.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando arquivo...';
        areaProgresso.style.display = "block";
        barraProgresso.style.width = "50%"; // Progresso simulado de leitura
        barraProgresso.innerText = "50% (Processando...)";

        const arquivo = arquivoInput.files[0];
        const leitor = new FileReader();

        leitor.onload = function(evento) {
            const rawBase64 = evento.target.result.split(',')[1];
            
            barraProgresso.style.width = "80%";
            barraProgresso.innerText = "80% (Subindo para o Drive...)";

            // Monta os dados adicionais que você pediu
            const dadosForm = {
                nomeGuerra: document.getElementById("uploadNomeGuerra").value,
                milhao: document.getElementById("uploadMilhao").value,
                descricao: document.getElementById("uploadDescricao").value,
                nomeArquivo: arquivo.name,
                tipoMime: arquivo.type,
                base64: rawBase64
            };

            // Envia via POST (Necessário para carregar arquivos grandes)
            fetch(URL_SCRIPT_GOOGLE, {
                method: "POST",
                body: JSON.stringify(dadosForm)
            })
            .then(res => res.json())
            .then(respostaDrive => {
                btnEnviarUpload.disabled = false;
                btnEnviarUpload.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Enviar para o Drive';

                if (respostaDrive.status === "SUCESSO") {
                    barraProgresso.style.width = "100%";
                    barraProgresso.innerText = "100% Concluído!";
                    setTimeout(() => {
                        modalUpload.style.display = "none";
                        alert("Arquivo enviado com sucesso para a Turma 198!");
                    }, 500);
                } else {
                    alert("Erro ao enviar: " + respostaDrive.mensagem);
                }
            })
            .catch(err => {
                console.error(err);
                btnEnviarUpload.disabled = false;
                btnEnviarUpload.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Enviar para o Drive';
                alert("Erro de conexão ao tentar subir o arquivo. Tente novamente.");
            });
        };

        leitor.readAsDataURL(arquivo);
    });
});