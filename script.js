document.addEventListener("DOMContentLoaded", function() {

    const aumentar = document.getElementById("aumentar-fonte");
    const diminuir = document.getElementById("diminuir-fonte");

    // Recupera o tamanho salvo
    let escala = parseFloat(localStorage.getItem("escalaFonte")) || 1;

    // Seleciona os textos do site
    const textos = document.querySelectorAll(
        "h1, h2, h3, h4, p, a, li, span, label"
    );

    // Salva os tamanhos originais
    textos.forEach(function(elemento) {
        elemento.dataset.tamanhoOriginal =
            parseFloat(getComputedStyle(elemento).fontSize);
    });

    // Atualiza o tamanho dos textos
    function atualizarFonte() {
        textos.forEach(function(elemento) {
            const tamanhoOriginal =
                parseFloat(elemento.dataset.tamanhoOriginal);

            elemento.style.fontSize =
                (tamanhoOriginal * escala) + "px";
        });

        // Salva a escala para as outras páginas
        localStorage.setItem("escalaFonte", escala);
    }

    // Aumentar a fonte
    if (aumentar) {
        aumentar.addEventListener("click", function() {
            if (escala < 1.5) {
                escala = Math.min(1.5, escala + 0.1);
                atualizarFonte();
            }
        });
    }

    // Diminuir a fonte
    if (diminuir) {
        diminuir.addEventListener("click", function() {
            if (escala > 0.7) {
                escala = Math.max(0.7, escala - 0.1);
                atualizarFonte();
            }
        });
    }

    // Aplica o tamanho salvo ao abrir qualquer página
    atualizarFonte();

});
