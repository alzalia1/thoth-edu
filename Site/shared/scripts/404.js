const backButton = document.getElementById("back");

backButton.addEventListener("click", back);

function back() {
    history.back();
}
