const currentScriptPath = document.currentScript.src;
const basePath = currentScriptPath.substring(
    0,
    currentScriptPath.lastIndexOf("/") + 1
);

const cheminVers404 = basePath + "Pages/404.html";

window.onerror = function (message, source, lineno, colno, error) {
    if (message.toLowerCase().includes("not found")) {
        window.location.href = cheminVers404;
    }
};

window.addEventListener("unhandledrejection", function (event) {
    if (event.reason.message.toLowerCase().includes("not found")) {
        window.location.href = cheminVers404;
    }
});
