const switchButton = document.getElementById("test");
const signInDiv = document.getElementById("signin");
const signUpDiv = document.getElementById("signup");

switchButton.addEventListener("click", displayInvert);

function displayInvert() {
    signInDiv.hidden = true - signInDiv.hidden;
    signUpDiv.hidden = true - signUpDiv.hidden;
}
