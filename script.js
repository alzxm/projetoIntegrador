
document.addEventListener("DOMContentLoaded", function () {

    // ACESSIBILIDADE: AUMENTAR E DIMINUIR FONTE

    const aumentar = document.getElementById("aumentar-fonte");
    const diminuir = document.getElementById("diminuir-fonte");

    const chave = "escalaFonte";

    let escala = parseFloat(localStorage.getItem(chave)) || 1;

    // Elementos que terão o tamanho da fonte ajustado
    const seletor = [
        "h1", "h2", "h3", "h4",
        "p", "a", "li", "span",
        "label", "small", "strong",
        "button", "input", "textarea",
        "select", "option"
    ].join(", ");

    // Captura os tamanhos originais antes de aplicar o aumento
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

                // Evita capturar como original um tamanho
                // que já foi aumentado por herança
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

    // Aplica o tamanho escolhido
    function aplicarFonte(elementos) {

        elementos.forEach(function (elemento) {

            const tamanhoOriginal = parseFloat(
                elemento.dataset.tamanhoOriginal
            );

            elemento.style.fontSize =
                (tamanhoOriginal * escala) + "px";

        });

    }

    // Atualiza toda a página
    function atualizarFonte() {

        const elementos = document.querySelectorAll(seletor);

        capturarTamanhos(elementos);

        aplicarFonte(elementos);

        localStorage.setItem(chave, escala);
    }

    // BOTÃO A+

    if (aumentar) {

        aumentar.addEventListener("click", function () {

            escala = Math.min(1.5, +(escala + 0.1).toFixed(2));

            atualizarFonte();

        });

    }

    // BOTÃO A-

    if (diminuir) {

        diminuir.addEventListener("click", function () {

            escala = Math.max(0.7, +(escala - 0.1).toFixed(2));

            atualizarFonte();

        });

    }

    // IDENTIFICA NOVOS ELEMENTOS ADICIONADOS À PÁGINA
    // Isso também funciona com os relatos carregados pelo Supabase

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

    // APLICA A CONFIGURAÇÃO SALVA AO ABRIR A PÁGINA

    atualizarFonte();


    // IDENTIFICA AUTOMATICAMENTE A ABA ATUAL

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
