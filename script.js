
document.addEventListener("DOMContentLoaded", function() {

    let escala = 1;

    const aumentar = document.getElementById("aumentar-fonte");
    const diminuir = document.getElementById("diminuir-fonte");

    // Elementos de texto do site
    const textos = document.querySelectorAll(
        "h1, h2, h3, h4, p, a, li, span, label"
    );

    // Guardar o tamanho original de cada texto
    textos.forEach(function(elemento) {
        elemento.dataset.tamanhoOriginal =
            parseFloat(getComputedStyle(elemento).fontSize);
    });

    function atualizarFonte() {
        textos.forEach(function(elemento) {
            const tamanhoOriginal =
                parseFloat(elemento.dataset.tamanhoOriginal);

            elemento.style.fontSize =
                (tamanhoOriginal * escala) + "px";
        });
    }

    // Aumentar
    aumentar.addEventListener("click", function() {
        if (escala < 1.5) {
            escala += 0.1;
            atualizarFonte();
        }
    });

    // Diminuir
    diminuir.addEventListener("click", function() {
        if (escala > 0.7) {
            escala -= 0.1;
            atualizarFonte();
        }
    });

});
