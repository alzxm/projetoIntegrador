
document.addEventListener("DOMContentLoaded", function () {

    /* Acessibilidade: tamanho da fonte */

    const aumentar = document.getElementById("aumentar-fonte");
    const diminuir = document.getElementById("diminuir-fonte");

    const chaveFonte = "escalaFonte";
    let escala = parseFloat(localStorage.getItem(chaveFonte)) || 1;

    const seletor = [
        "h1", "h2", "h3", "h4",
        "p", "a", "li", "span",
        "label", "small", "strong",
        "button", "input", "textarea",
        "select", "option"
    ].join(", ");

    function capturarTamanhos(elementos) {
        elementos.forEach(function (elemento) {

            if (!elemento.dataset.tamanhoOriginal) {
                const tamanhoAtual = parseFloat(
                    getComputedStyle(elemento).fontSize
                );

                const pai = elemento.parentElement;

                const tamanhoPai = pai
                    ? parseFloat(getComputedStyle(pai).fontSize)
                    : 0;

                const herdado = pai &&
                    Math.abs(tamanhoAtual - tamanhoPai) < 0.1;

                const tamanhoOriginal =
                    herdado && escala !== 1
                        ? tamanhoAtual / escala
                        : tamanhoAtual;

                elemento.dataset.tamanhoOriginal = tamanhoOriginal;
            }
        });
    }

    function aplicarFonte(elementos) {
        elementos.forEach(function (elemento) {
            const tamanhoOriginal = parseFloat(
                elemento.dataset.tamanhoOriginal
            );

            elemento.style.fontSize =
                (tamanhoOriginal * escala) + "px";
        });
    }

    function atualizarFonte() {
        const elementos = document.querySelectorAll(seletor);

        capturarTamanhos(elementos);
        aplicarFonte(elementos);

        localStorage.setItem(chaveFonte, escala);
    }

    if (aumentar) {
        aumentar.addEventListener("click", function () {
            escala = Math.min(1.5, +(escala + 0.1).toFixed(2));
            atualizarFonte();
        });
    }

    if (diminuir) {
        diminuir.addEventListener("click", function () {
            escala = Math.max(0.7, +(escala - 0.1).toFixed(2));
            atualizarFonte();
        });
    }


    /* Modo claro, escuro e automático */

    const chaveTema = "preferenciaTemaV2";
    const temas = ["automatico", "claro", "escuro"];

    let tema = localStorage.getItem(chaveTema) || "automatico";

    if (!temas.includes(tema)) {
        tema = "automatico";
    }

    const areaAcessibilidade = document.querySelector(".acessibilidade");

    let botaoTema = document.querySelector(".botao-tema");

    if (areaAcessibilidade && !botaoTema) {
        botaoTema = document.createElement("button");
        botaoTema.type = "button";
        botaoTema.className = "botao-tema";
        botaoTema.setAttribute("aria-label", "Alterar tema");

        areaAcessibilidade.appendChild(botaoTema);
    }

    const preferenciaSistema = window.matchMedia(
        "(prefers-color-scheme: dark)"
    );

    function aplicarTema() {
        let temaAplicado = tema;

        if (tema === "automatico") {
            temaAplicado = preferenciaSistema.matches
                ? "escuro"
                : "claro";
        }

        document.documentElement.setAttribute(
            "data-tema",
            temaAplicado
        );

        if (!botaoTema) return;

        const configuracoes = {
            automatico: {
                texto: "Auto",
                descricao: "Tema automático"
            },
            claro: {
                texto: "☀",
                descricao: "Tema claro"
            },
            escuro: {
                texto: "☾",
                descricao: "Tema escuro"
            }
        };

        botaoTema.textContent = configuracoes[tema].texto;

        botaoTema.setAttribute(
            "aria-label",
            configuracoes[tema].descricao + ". Clique para alterar."
        );

        botaoTema.title = configuracoes[tema].descricao;
    }

    if (botaoTema) {
        botaoTema.addEventListener("click", function () {
            const indiceAtual = temas.indexOf(tema);

            tema = temas[(indiceAtual + 1) % temas.length];

            localStorage.setItem(chaveTema, tema);
            aplicarTema();
        });
    }

    if (preferenciaSistema.addEventListener) {
        preferenciaSistema.addEventListener("change", function () {
            if (tema === "automatico") {
                aplicarTema();
            }
        });
    } else if (preferenciaSistema.addListener) {
        preferenciaSistema.addListener(function () {
            if (tema === "automatico") {
                aplicarTema();
            }
        });
    }

    aplicarTema();


    /* Elementos adicionados dinamicamente */

    const observador = new MutationObserver(function (alteracoes) {
        alteracoes.forEach(function (alteracao) {
            alteracao.addedNodes.forEach(function (no) {

                if (no.nodeType !== 1) return;

                const novosElementos = [];

                if (no.matches(seletor)) {
                    novosElementos.push(no);
                }

                novosElementos.push(
                    ...no.querySelectorAll(seletor)
                );

                capturarTamanhos(novosElementos);
                aplicarFonte(novosElementos);
            });
        });
    });

    observador.observe(document.body, {
        childList: true,
        subtree: true
    });

    atualizarFonte();


    /* Identificar a página atual */

    const links = document.querySelectorAll("nav a");

    const paginaAtual = window.location.pathname
        .split("/")
        .pop() || "index.html";

    links.forEach(function (link) {
        const destino = new URL(link.href).pathname
            .split("/")
            .pop();

        if (destino === paginaAtual) {
            link.classList.add("aba-atual");
        }
    });

});


/* Mensagem personalizada de agradecimento */

window.mostrarAgradecimento = function () {

    const modalExistente = document.querySelector(".modal-agradecimento");

    if (modalExistente) return;

    const fundo = document.createElement("div");
    fundo.className = "modal-agradecimento";

    const caixa = document.createElement("div");
    caixa.className = "conteudo-agradecimento";
    caixa.setAttribute("role", "dialog");
    caixa.setAttribute("aria-modal", "true");
    caixa.setAttribute("aria-labelledby", "titulo-agradecimento");

    const titulo = document.createElement("h2");
    titulo.id = "titulo-agradecimento";
    titulo.textContent = "Projeto Integrador";

    const mensagem = document.createElement("p");
    mensagem.textContent = "O grupo agradece pela sua avaliação!";

    const botao = document.createElement("button");
    botao.type = "button";
    botao.textContent = "OK";

    caixa.appendChild(titulo);
    caixa.appendChild(mensagem);
    caixa.appendChild(botao);
    fundo.appendChild(caixa);
    document.body.appendChild(fundo);

    botao.focus();

    function fecharModal() {
        fundo.remove();
        document.removeEventListener("keydown", fecharComEsc);
    }

    function fecharComEsc(evento) {
        if (evento.key === "Escape") {
            fecharModal();
        }
    }

    botao.addEventListener("click", fecharModal);

    fundo.addEventListener("click", function (evento) {
        if (evento.target === fundo) {
            fecharModal();
        }
    });

    document.addEventListener("keydown", fecharComEsc);
};


/* Animação dos botões */

document.addEventListener("click", function (evento) {

    const botao = evento.target.closest(
        "#aumentar-fonte, #diminuir-fonte, .botao-tema"
    );

    if (!botao) return;

    botao.classList.remove("animacao-clique");

    void botao.offsetWidth;

    botao.classList.add("animacao-clique");

    setTimeout(function () {
        botao.classList.remove("animacao-clique");
    }, 500);

});
