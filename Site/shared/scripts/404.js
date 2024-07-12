const backButton = document.getElementById("back");

backButton.addEventListener("click", () => {
    if (document.referrer.indexOf(window.location.host) !== -1) {
        window.location.href = document.referrer;
    } else {
        window.location.href = window.location.origin;
    }
});
