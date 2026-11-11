document.addEventListener("DOMContentLoaded", function () {

    const aumentar = document.getElementById("aumentar-fonte");
    const diminuir = document.getElementById("diminuir-fonte");

    const chave = "escalaFonte";

    let escala = parseFloat(localStorage.getItem(chave)) || 1;

    function atualizarFonte() {

        document.documentElement.style.setProperty(
            "--escala-fonte",
            escala
        );

        document.querySelectorAll(
            "h1, h2, h3, h4, p, a, li, span, label, small, strong, button"
        ).forEach(function (elemento) {

            if (!elemento.dataset.tamanhoOriginal) {
                elemento.dataset.tamanhoOriginal =
                    parseFloat(getComputedStyle(elemento).fontSize);
            }

            const tamanhoOriginal =
                parseFloat(elemento.dataset.tamanhoOriginal);

            elemento.style.fontSize =
                (tamanhoOriginal * escala) + "px";

        });

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

    atualizarFonte();

});
