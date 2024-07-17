import { Plogout } from "/shared/scripts/modules/utils.js";

const header = document.getElementsByTagName("header")[0];

// ANCHOR - Div left
const divLeft = document.createElement("div");
divLeft.id = "id";

const pUsername = document.createElement("p");
pUsername.id = "username";
pUsername.textContent = localStorage.getItem("username");
pUsername.addEventListener("click", () => {
    window.location.href = `https://professeur.thoth-edu.fr/user`;
});

divLeft.append(pUsername);

// ANCHOR - Div center

const divCenter = document.createElement("div");
divCenter.id = "center";

const aThothEdu = document.createElement("a");
aThothEdu.innerHTML = "TOTH<br />EDU";
aThothEdu.href = "https://thoth-edu.fr/";

divCenter.append(aThothEdu);

// ANCHOR - Div right

const divRight = document.createElement("div");
divRight.id = "right";

const aDashboard = document.createElement("a");
aDashboard.href = "https://professeur.thoth-edu.fr/dashboard";

const imgDashboard = document.createElement("img");
imgDashboard.src = "/shared/ressources/icone_home.png";
imgDashboard.alt = "dashboard";
imgDashboard.title = "dashboard";

aDashboard.append(imgDashboard);

const aLogout = document.createElement("a");
aLogout.addEventListener("click", () => {
    Plogout();
});

const imgLogout = document.createElement("img");
imgLogout.src = "/shared/ressources/icone_deconnexion.jpg";
imgLogout.alt = "déconnexion";
imgLogout.title = "déconnexion";

aLogout.append(imgLogout);

divRight.append(aDashboard, aLogout);

header.append(divLeft, divCenter, divRight);
