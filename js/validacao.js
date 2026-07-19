document.addEventListener("DOMContentLoaded", function() {
    const URL_SCRIPT_GOOGLE = "https://script.google.com/macros/s/AKfycbxkipmzIhTGYl3lfCsogMWNbNKGWV8w29IsXizCVXK1PYEyKH-q9xzxI-TcpeqU2KpC/exec";

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

    // Função para formatar o milhão esteticamente (Ex: 911515 -> 91-1515)
    function formatarMilhao(num) {
        const texto = String(num).replace(/\D/g, '');
        if (texto.length === 6) {
            return texto.substring(0, 2) + '-' + texto.substring(2);
        }
        return texto;
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

    btnFecharValidacao.addEventListener("click", function() {
        modalValidacao.style.display = "none";
    });

    btnFecharUpload.addEventListener("click", function() {
        if (!btnEnviarUpload.disabled) { 
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
                    
                    formUpload.reset();
                    
                    document.getElementById("uploadMilhao").value = milhao;
                    document.getElementById("uploadMilhaoVisual").value = formatarMilhao(milhao);
                    
                    areaProgresso.style.display = "none";
                    barraProgresso.style.width = "0%";
                    
                    modalUpload.style.setProperty("display", "flex", "important");
                } 
                else if (respostaReal.status === "BLOQUEADO_ATIVO") {
                    modalValidacao.style.display = "none";
                    alert("Usuário bloqueado. Contate o administrador!");
                } 
                else {
                    if (!respostaReal.milhaoValido) {
                        modalValidacao.style.display = "none";
                        alert("Usuário CLI bloqueado. Contate o administrador!");
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
                alert("Usuário gateway error ou bloqueado. Contate o administrador!");
            });
    });

    // SUBMIT DO FORMULÁRIO DE UPLOAD (MÚLTIPLOS ARQUIVOS SEQUENCIAIS - FORMATO JSON)
    formUpload.addEventListener("submit", function(e) {
        e.preventDefault();

        const arquivoInput = document.getElementById("uploadArquivo");
        const listaArquivos = arquivoInput.files;
        if (listaArquivos.length === 0) return;

        let qtdFotos = 0;
        let qtdVideos = 0;

        for (let i = 0; i < listaArquivos.length; i++) {
            if (listaArquivos[i].type.startsWith("video/")) {
                qtdVideos++;
            } else {
                qtdFotos++;
            }
        }

        if (qtdFotos > 5) {
            alert(`Limite excedido! Você selecionou ${qtdFotos} fotos. O limite máximo é de 5 fotos por envio.`);
            return;
        }
        if (qtdVideos > 2) {
            alert(`Limite excedido! Você selecionou ${qtdVideos} vídeos. O limite máximo é de 2 vídeos por envio.`);
            return;
        }

        btnEnviarUpload.disabled = true;
        areaProgresso.style.display = "block";

        const nomeGuerra = document.getElementById("uploadNomeGuerra").value;
        const milhao = document.getElementById("uploadMilhao").value;
        const descricao = document.getElementById("uploadDescricao").value;

        let indiceAtual = 0;

        function enviarProximoArquivo() {
            if (indiceAtual >= listaArquivos.length) {
                barraProgresso.style.width = "100%";
                barraProgresso.innerText = "100% Concluído!";
                setTimeout(() => {
                    btnEnviarUpload.disabled = false;
                    btnEnviarUpload.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Enviar para o Drive';
                    modalUpload.style.display = "none";
                    alert("Todos os arquivos foram enviados com sucesso para o Drive da Turma 198!");
                }, 800);
                return;
            }

            const arquivo = listaArquivos[indiceAtual];
            const numExibicao = indiceAtual + 1;
            
            barraProgresso.style.width = "40%";
            barraProgresso.innerText = `[${numExibicao}/${listaArquivos.length}] Lendo arquivo...`;

            const leitor = new FileReader();
            leitor.onload = function(evento) {
                const rawBase64 = evento.target.result.split(',')[1];
                
                barraProgresso.style.width = "75%";
                barraProgresso.innerText = `[${numExibicao}/${listaArquivos.length}] Subindo para o Drive...`;

                fetch(URL_SCRIPT_GOOGLE, {
                    method: "POST",
                    headers: {
                        "Content-Type": "text/plain;charset=utf-8"
                    },
                    body: JSON.stringify({
                        nomeGuerra: nomeGuerra,
                        milhao: milhao,
                        descricao: descricao,
                        nomeArquivo: arquivo.name,
                        tipoMime: arquivo.type,
                        base64: rawBase64
                    })
                })
                .then(res => res.json())
                .then(resultado => {
                    if(resultado.status === "SUCESSO") {
                        indiceAtual++;
                        enviarProximoArquivo();
                    } else {
                        throw new Error(resultado.mensagem || "Erro interno do servidor Google");
                    }
                })
                .catch(err => {
                    console.error(err);
                    btnEnviarUpload.disabled = false;
                    btnEnviarUpload.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Enviar para o Drive';
                    alert(`O envio travou no arquivo: ${arquivo.name}. Erro: ${err.message}`);
                });
            };

            leitor.readAsDataURL(arquivo);
        }

        enviarProximoArquivo();
    });
});