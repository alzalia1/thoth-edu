const footer = document.createElement("footer");

const copyrightText = document.createElement("p");
copyrightText.innerHTML = `&copy; ${new Date().getFullYear()}`;

const footerMenu = document.createElement("nav");
footerMenu.innerHTML =
    "<a href='https://thoth-edu.fr/'>Thoth-edu</a> - <a href='https://about.thoth-edu.fr/contact'>Contact</a> - <a href='https://about.thoth-edu.fr/about'>À propos de nous</a>";

footer.append(copyrightText, footerMenu);
footer.style.backgroundColor = "rgba(0,0,0,0.1)";
footer.style.width = "100%";
footer.style.textAlign = "center";
document.body.append(footer);
