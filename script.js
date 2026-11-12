
document.addEventListener("DOMContentLoaded", function () {

    // =================================
    // ACESSIBILIDADE: TAMANHO DA FONTE
    // =================================

    const aumentar = document.getElementById("aumentar-fonte");
    const diminuir = document.getElementById("diminuir-fonte");

    const chave = "escalaFonte";

    let escala = parseFloat(localStorage.getItem(chave)) || 1;

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

        localStorage.setItem(chave, escala);
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


    // =================================
    // MODO CLARO, ESCURO E AUTOMÁTICO
    // =================================

    const chaveTema = "preferenciaTema";

    const temas = ["automatico", "claro", "escuro"];

    let tema = localStorage.getItem(chaveTema) || "automatico";

    if (!temas.includes(tema)) {
        tema = "automatico";
    }

    const botaoTema = document.createElement("button");

    botaoTema.type = "button";
    botaoTema.className = "botao-tema";
    botaoTema.setAttribute("aria-label", "Alterar tema");

    const areaAcessibilidade = document.querySelector(".acessibilidade");

    if (areaAcessibilidade) {
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

        if (tema === "automatico") {
            botaoTema.textContent = "Auto";
            botaoTema.setAttribute(
                "aria-label",
                "Tema automático. Clique para alterar."
            );
            botaoTema.title = "Tema automático";
        }

        if (tema === "claro") {
            botaoTema.textContent = "☀";
            botaoTema.setAttribute(
                "aria-label",
                "Tema claro. Clique para alterar."
            );
            botaoTema.title = "Tema claro";
        }

        if (tema === "escuro") {
            botaoTema.textContent = "☾";
            botaoTema.setAttribute(
                "aria-label",
                "Tema escuro. Clique para alterar."
            );
            botaoTema.title = "Tema escuro";
        }

    }

    botaoTema.addEventListener("click", function () {

        const indiceAtual = temas.indexOf(tema);

        tema = temas[(indiceAtual + 1) % temas.length];

        localStorage.setItem(chaveTema, tema);

        aplicarTema();

    });

    preferenciaSistema.addEventListener("change", function () {

        if (tema === "automatico") {
            aplicarTema();
        }

    });

    aplicarTema();


    // =================================
    // ELEMENTOS ADICIONADOS DINAMICAMENTE
    // =================================

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


    // =================================
    // IDENTIFICAR ABA ATUAL
    // =================================

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
