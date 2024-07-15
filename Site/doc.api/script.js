document.addEventListener("DOMContentLoaded", function () {
    hljs.highlightAll();

    const stickyDiv = document.querySelector(".sticky-div");
    const stickyDivPosition = stickyDiv.offsetTop;
    const content = document.querySelector(".content");

    window.addEventListener("scroll", function () {
        if (window.scrollY + 8 >= stickyDivPosition) {
            stickyDiv.classList.add("sticky");
            content.style.paddingTop = `${stickyDiv.offsetHeight}px`;
        } else {
            stickyDiv.classList.remove("sticky");
            content.style.paddingTop = "0";
        }
    });

    const tradButton = document.getElementById("showTrad");
    const conjugButton = document.getElementById("showConjug");

    tradButton.addEventListener("click", () => {
        let trads = document.querySelectorAll(".traduction");
        trads.forEach((trad) => {
            trad.hidden = false;
        });

        let conjugs = document.querySelectorAll(".conjugaison");
        conjugs.forEach((conjug) => {
            conjug.hidden = true;
        });

        tradButton.classList.add("selected");
        conjugButton.classList.remove("selected");
    });

    conjugButton.addEventListener("click", () => {
        let trads = document.querySelectorAll(".traduction");
        trads.forEach((trad) => {
            trad.hidden = true;
        });

        let conjugs = document.querySelectorAll(".conjugaison");
        conjugs.forEach((conjug) => {
            conjug.hidden = false;
        });

        tradButton.classList.remove("selected");
        conjugButton.classList.add("selected");
    });
});
