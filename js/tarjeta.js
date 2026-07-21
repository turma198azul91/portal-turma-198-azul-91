window.addEventListener("load", () => {
    setTimeout(() => {
        const preloader = document.querySelector(".preloader");
        if (preloader) {
            preloader.style.display = "none";
        }
        document.body.classList.add('loaded');
    }, 6000);
});

setTimeout(() => {
    const container = document.getElementById('grito-container');
    if (!container) return;

    const frases = [
        "Na força do combate",
        "no sangue do inimigo",
        "a Azul não se abate",
        "e não foge do perigo",
        "nossa força vem do céu",
        "e do homem interior",
        "Especialistas nós seremos",
        "pois conhecemos seu valor",
        "Azul 91"
    ];

    let tarjetasAtivas = [];
    const minDistance = 80;

    function getCabecalhoHeight() {
        const navbar = document.querySelector('.navbar');
        const headerTitle = document.querySelector('.header-title');
        let totalHeight = 120;
        if (navbar) totalHeight += navbar.offsetHeight;
        if (headerTitle) totalHeight += headerTitle.offsetHeight;
        return totalHeight;
    }

    function colide(pos1, pos2) {
        return !(
            pos1.left + pos1.width + minDistance < pos2.left ||
            pos1.left > pos2.left + pos2.width + minDistance ||
            pos1.top + pos1.height + minDistance < pos2.top ||
            pos1.top > pos2.top + pos2.height + minDistance
        );
    }

    function gerarPosicao(tarjetaWidth, tarjetaHeight) {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const cabecalhoHeight = getCabecalhoHeight();
        const margemInferior = 100;
        const maxAttempts = 80;

        for (let i = 0; i < maxAttempts; i++) {
            const left = Math.random() * (vw - tarjetaWidth);
            const top = Math.random() * (vh - cabecalhoHeight - margemInferior - tarjetaHeight) + cabecalhoHeight;
            const novaPos = { left, top, width: tarjetaWidth, height: tarjetaHeight };

            if (!tarjetasAtivas.some(pos => colide(novaPos, pos))) {
                return novaPos;
            }
        }

        return {
            left: Math.random() * (vw - tarjetaWidth),
            top: Math.random() * (vh - cabecalhoHeight - margemInferior - tarjetaHeight) + cabecalhoHeight,
            width: tarjetaWidth,
            height: tarjetaHeight
        };
    }

    const intervaloEntreTarjetas = 800;

    document.querySelectorAll('.tarjeta-generica').forEach(t => {
        if (!t.textContent.trim()) t.remove();
    });

    function exibirTarjetasLoop() {
        tarjetasAtivas = [];

        frases.forEach((texto, index) => {
            setTimeout(() => {
                const tarjeta = document.createElement('div');
                tarjeta.className = 'tarjeta-generica';
                tarjeta.setAttribute('data-valida', 'true');
                tarjeta.textContent = texto;
                tarjeta.style.opacity = '0';

                container.appendChild(tarjeta);

                requestAnimationFrame(() => {
                    const rect = tarjeta.getBoundingClientRect();
                    const pos = gerarPosicao(rect.width, rect.height);

                    tarjeta.style.top = `${pos.top}px`;
                    tarjeta.style.left = `${pos.left}px`;
                    tarjeta.style.opacity = '1';

                    tarjetasAtivas.push(pos);
                });

                setTimeout(() => tarjeta.remove(), 5000);
            }, index * intervaloEntreTarjetas);
        });

        const tempoTotal = (frases.length - 1) * intervaloEntreTarjetas + 5000;
        setTimeout(exibirTarjetasLoop, tempoTotal);
    }

    function exibirMiniaturasLoop() {
        const imagensFixas = [
            "./assets/imagens/NomeTurma.png",
            "./assets/imagens/caneca.png"
        ];

        imagensFixas.forEach((src, index) => {
            setTimeout(() => {
                const img = document.createElement("img");
                img.src = src;
                img.className = "miniatura-animada";
                img.style.width = "100px";
                img.style.height = "100px";
                img.setAttribute('alt', `Miniatura ${index + 1}`);
                img.style.opacity = "0";
                container.appendChild(img);

                requestAnimationFrame(() => {
                    const rect = img.getBoundingClientRect();
                    const pos = gerarPosicao(rect.width, rect.height);
                    img.style.top = `${pos.top}px`;
                    img.style.left = `${pos.left}px`;
                    img.style.opacity = "1";
                    tarjetasAtivas.push(pos);
                });

                setTimeout(() => img.remove(), 5000);
            }, index * 600);
        });

        setTimeout(() => {
            const moedaWrapper = document.createElement("div");
            moedaWrapper.className = "moeda-container";
            moedaWrapper.style.width = "60px";
            moedaWrapper.style.height = "60px";

            const moeda = document.createElement("div");
            moeda.className = "moeda";

            const frente = document.createElement("img");
            frente.src = "./assets/imagens/moedaFrente.png";
            frente.className = "moeda-face moeda-frente";

            const verso = document.createElement("img");
            verso.src = "./assets/imagens/moedaVerso.png";
            verso.className = "moeda-face moeda-verso";

            moeda.appendChild(frente);
            moeda.appendChild(verso);
            moedaWrapper.appendChild(moeda);
            container.appendChild(moedaWrapper);

            const rect = moedaWrapper.getBoundingClientRect();
            const pos = gerarPosicao(rect.width, rect.height);
            moedaWrapper.style.top = `${pos.top}px`;
            moedaWrapper.style.left = `${pos.left}px`;

            tarjetasAtivas.push({
                top: pos.top,
                left: pos.left,
                width: rect.width,
                height: rect.height
            });

            setTimeout(() => {
                moeda.style.transform = "rotateY(180deg)";
            }, 2500);

            setTimeout(() => {
                moedaWrapper.remove();
            }, 5000);
        }, imagensFixas.length * 600);

        setTimeout(exibirMiniaturasLoop, 7000);
    }

    exibirTarjetasLoop();
    exibirMiniaturasLoop();
}, 5500);

document.addEventListener('DOMContentLoaded', function () {
    const URL_SCRIPT_GOOGLE = "https://script.google.com/macros/s/AKfycbxECF41_kBjztmwdSqSEXD7oZ4GMyl3ESgHrreQZSdl2uHtH_60h8Ln4-JUEy-erDYk/exec";

    const menuToggle = document.querySelector('.menu-toggle');
    const navbar = document.querySelector('.navbar');

    if (menuToggle && navbar) {
        const novoMenuToggle = menuToggle.cloneNode(true);
        menuToggle.parentNode.replaceChild(novoMenuToggle, menuToggle);

        const toggleFinal = document.querySelector('.menu-toggle');

        toggleFinal.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            
            navbar.classList.toggle('active');
            
            const icon = toggleFinal.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-xmark');
            }
        });

        document.querySelectorAll('.navbar .btn-nav, .navbar .btn-gerar-tarjeta-nav').forEach(botao => {
            botao.addEventListener('click', () => {
                navbar.classList.remove('active');
                const icon = toggleFinal.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-xmark');
                }
            });
        });
    }

    const inputMilhaoModal = document.getElementById("milhao"); 
    const inputGuerra = document.getElementById("nomeGuerra"); 
    const finalAluno = document.getElementById("finalAluno");
    const finalMilhao = document.getElementById("finalMilhao"); 
    const finalNome = document.getElementById("finalNome"); 
    
    const btnGerarTarjeta = document.getElementById("btnGerarTarjeta"); 
    const popupUpload = document.getElementById("popupUpload"); 
    const modalMensagemErro = document.getElementById("modalMensagemErro");
    const btnOkErro = document.getElementById("btnOkErro");
    const containerBotaoGerar = document.getElementById("containerBotaoGerar");

    if (inputMilhaoModal) {
        inputMilhaoModal.removeAttribute("readonly");
    }

    window.closePopup = function() {
        if (popupUpload) popupUpload.style.display = "none";
        if (modalMensagemErro) modalMensagemErro.style.display = "none";
        if (containerBotaoGerar) containerBotaoGerar.style.display = "block";
        const uploadForm = document.getElementById("uploadForm");
        if (uploadForm) uploadForm.reset();
    };

    if (btnOkErro) {
        btnOkErro.addEventListener("click", function() {
            window.closePopup();
        });
    }

    if (btnGerarTarjeta) {
        btnGerarTarjeta.addEventListener("click", function() {
            if (modalMensagemErro) modalMensagemErro.style.display = "none";
            if (containerBotaoGerar) containerBotaoGerar.style.display = "block";
            if (popupUpload) {
                popupUpload.style.display = "flex";
            }
            const uploadForm = document.getElementById("uploadForm");
            if (uploadForm) {
                uploadForm.reset();
            }
            if (inputMilhaoModal) {
                inputMilhaoModal.focus();
            }
        });
    }

    const uploadForm = document.getElementById("uploadForm");
    if (uploadForm) {
        uploadForm.addEventListener("submit", function(e) {
            e.preventDefault();
            
            const milhaoDigitado = inputMilhaoModal.value.trim();
            const nomeGuerraDigitado = inputGuerra.value.trim().toUpperCase();

            if (!milhaoDigitado) {
                alert("Por favor, digite o seu milhão.");
                return;
            }

            const btnSubmit = uploadForm.querySelector("button[type='submit']");
            const textoOriginalBotao = btnSubmit.innerHTML;
            btnSubmit.disabled = true;
            btnSubmit.innerHTML = "Validando...";

            if (modalMensagemErro) modalMensagemErro.style.display = "none";

            fetch(URL_SCRIPT_GOOGLE + "?milhao=" + encodeURIComponent(milhaoDigitado))
                .then(res => res.json())
                .then(resposta => {
                    btnSubmit.disabled = false;
                    btnSubmit.innerHTML = textoOriginalBotao;

                    if (resposta.status === "SUCESSO") {
                        if (popupUpload) popupUpload.style.display = "none";
                        iniciarAnimacaoTarjeta(milhaoDigitado, nomeGuerraDigitado);
                    } else {
                        if (modalMensagemErro && containerBotaoGerar) {
                            containerBotaoGerar.style.display = "none";
                            modalMensagemErro.style.display = "block";
                        } else {
                            alert("Usuário inválido!");
                        }
                    }
                })
                .catch(err => {
                    btnSubmit.disabled = false;
                    btnSubmit.innerHTML = textoOriginalBotao;
                    console.error(err);
                    alert("Erro de conexão ao validar o milhão. Tente novamente.");
                });
        });
    }

    function iniciarAnimacaoTarjeta(milhaoVal, nomeVal) {
        const textoAluno = "ALUNO";
        const fullMilhao = `91-${milhaoVal}`;
        const fullNome = nomeVal !== "" ? nomeVal : "NOME DE GUERRA";
        const totalCaracteres = textoAluno.length + fullMilhao.length + fullNome.length;

        const tarjeta = document.getElementById("tarjetaFinal");
        const container = document.getElementById("tarjetaFinalContainer");
        const loader = document.getElementById("tarjetaLoader");
        const btnVerTarjetaContainer = document.getElementById("btnVerTarjetaContainer");

        if (finalAluno) finalAluno.textContent = "";
        if (finalMilhao) finalMilhao.textContent = "";
        if (finalNome) finalNome.textContent = "";
        
        if (container) container.style.display = "none";
        if (tarjeta) {
            tarjeta.style.display = "none";
            tarjeta.style.transform = "scale(1)";
            tarjeta.style.animation = "none";
        }
        if (loader) loader.style.display = "none";
        if (btnVerTarjetaContainer) btnVerTarjetaContainer.style.display = "none";

        if (container) container.style.display = "flex";
        if (tarjeta) {
            tarjeta.style.display = "flex";
            tarjeta.style.animation = "spinTarjeta 2.5s linear infinite";
        }

        const tempoPorCaractere = 700;
        let step = 0;
        let ultimoTimestamp = null;

        if (loader) loader.style.display = "block";

        function animar(timestamp) {
            if (!ultimoTimestamp) ultimoTimestamp = timestamp;
            const delta = timestamp - ultimoTimestamp;

            if (delta >= tempoPorCaractere && step < totalCaracteres) {
                if (step < textoAluno.length) {
                    if (finalAluno) finalAluno.textContent += textoAluno[step];
                } else if (step < textoAluno.length + fullMilhao.length) {
                    if (finalMilhao) finalMilhao.textContent += fullMilhao[step - textoAluno.length];
                } else {
                    if (finalNome) finalNome.textContent += fullNome[step - textoAluno.length - fullMilhao.length];
                }

                if (tarjeta) {
                    tarjeta.style.transform = `scale(1) rotate(${step * 10}deg)`;
                }
                step++;
                ultimoTimestamp = timestamp;
            }

            if (step < totalCaracteres) {
                requestAnimationFrame(animar);
            } else {
                if (tarjeta) {
                    tarjeta.style.animation = "none";
                    tarjeta.style.transform = "scale(1)";
                }
                if (loader) loader.style.display = "none";
                if (btnVerTarjetaContainer) btnVerTarjetaContainer.style.display = "block";
            }
        }

        requestAnimationFrame(animar);
    }

    function esconderTarjeta() {
        const tarjeta = document.getElementById("tarjetaFinal");
        const container = document.getElementById("tarjetaFinalContainer");
        const btnVerTarjetaContainer = document.getElementById("btnVerTarjetaContainer");

        if (tarjeta) {
            tarjeta.style.display = "none";
            tarjeta.style.animation = "none";
        }
        if (container) container.style.display = "none";
        if (btnVerTarjetaContainer) btnVerTarjetaContainer.style.display = "none";
    }

    if (btnGerarTarjeta) {
        btnGerarTarjeta.addEventListener("click", esconderTarjeta);
    }

    const btnVerTarjeta = document.getElementById("btnVerTarjeta");
    if (btnVerTarjeta) {
        btnVerTarjeta.addEventListener("click", () => {
            const popup = document.getElementById("popupTarjetaGrande");
            const nomeStr = finalNome ? finalNome.textContent || "NOME" : "NOME";
            const titulo = document.getElementById("tituloPopupTarjeta");
            const destino = document.getElementById("tarjetaExpandida");
            const original = document.getElementById("tarjetaFinal");

            if (titulo) titulo.textContent = `Tarjeta de ${nomeStr}`;
            if (destino) destino.innerHTML = "";

            if (original) {
                const clone = original.cloneNode(true);
                clone.removeAttribute("id");
                clone.style.display = "flex";
                clone.style.transform = "scale(1.2)";
                clone.style.transformOrigin = "center center";
                if (destino) destino.appendChild(clone);
            }

            if (popup) popup.style.display = "flex";

            const tarjetaFinalContainer = document.getElementById("tarjetaFinalContainer");
            if (tarjetaFinalContainer) {
                tarjetaFinalContainer.style.display = "none";
            }
        });
    }

    const btnSalvarTarjeta = document.getElementById("btnSalvarTarjeta");
    if (btnSalvarTarjeta) {
        btnSalvarTarjeta.addEventListener("click", () => {
            const tarjetaEl = document.querySelector("#tarjetaExpandida .tarjeta");
            if (!tarjetaEl) return;

            tarjetaEl.style.transform = "none";

            html2canvas(tarjetaEl, { backgroundColor: null }).then(canvas => {
                const link = document.createElement('a');
                const nomeMilhao = finalMilhao ? finalMilhao.textContent.replace("91-", "") : "0000";
                link.download = `tarjeta-${nomeMilhao}.png`;
                link.href = canvas.toDataURL();
                link.click();

                tarjetaEl.style.transform = "scale(1.2)";
                fecharPopupTarjeta();

                const tarjetaFinalContainer = document.getElementById("tarjetaFinalContainer");
                const btnVerTarjetaContainer = document.getElementById("btnVerTarjetaContainer");
                if (tarjetaFinalContainer) tarjetaFinalContainer.style.display = "none";
                if (btnVerTarjetaContainer) btnVerTarjetaContainer.style.display = "none";
            });
        });
    }

    const btnFecharPopupTarjeta = document.getElementById("btnFecharPopupTarjeta");
    if (btnFecharPopupTarjeta) {
        btnFecharPopupTarjeta.addEventListener("click", () => {
            fecharPopupTarjeta();
        });
    }

    function fecharPopupTarjeta() {
        const popup = document.getElementById("popupTarjetaGrande");
        const containerDestino = document.getElementById("tarjetaExpandida");

        if (popup) popup.style.display = "none";
        if (containerDestino) containerDestino.innerHTML = "";

        // Oculta completamente a tarjeta gerada e o botão "Ver Tarjeta", 
        // forçando o usuário a realizar a operação novamente.
        const tarjetaFinalContainer = document.getElementById("tarjetaFinalContainer");
        const btnVerTarjetaContainer = document.getElementById("btnVerTarjetaContainer");
        const tarjetaFinal = document.getElementById("tarjetaFinal");

        if (tarjetaFinalContainer) tarjetaFinalContainer.style.display = "none";
        if (btnVerTarjetaContainer) btnVerTarjetaContainer.style.display = "none";
        if (tarjetaFinal) {
            tarjetaFinal.style.display = "none";
            tarjetaFinal.style.animation = "none";
        }
    }
});