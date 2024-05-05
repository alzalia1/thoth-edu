import { construct } from "./modules/dashConstruct.js";
import { Pconfirm, Palert, Pinput } from "../../shared/scripts/modules/utils.js";

// System to check and refresh user's token !

let userCheckInProgress = false;
let userCheckTimeoutId = null;
// let isWindowFocused = true;

async function user_check() {
    if (userCheckInProgress) {
        return;
    }

    userCheckInProgress = true;

    await fetch("https://api.thoth-edu.fr/user/check", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt-token")}`,
        },
        body: JSON.stringify({ token: localStorage.getItem("jwt-token") }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.status == "fail") {
                throw Error();
            } else {
                localStorage.setItem("jwt-token", data.new);
            }
        })
        .catch((error) => {
            window.stop();
            Palert("Votre demande n'est pas autorisée ! Veuillez vous connecter avant.");
            console.log(error);
            window.location.href = `https://professeur.thoth-edu.fr/`;
        })
        .finally(() => {
            userCheckInProgress = false;
            if (userCheckTimeoutId !== null) {
                clearTimeout(userCheckTimeoutId);
            }
            userCheckTimeoutId = setTimeout(() => {
                user_check();
            }, 1800000);
        });
}

/* Si la sortie de l'onglet soit désactiver le rafraichissement
document.addEventListener("visibilitychange", async () => {
    if (document.visibilityState === "visible") {
        await user_check();
    }
});

window.addEventListener("focus", async () => {
    isWindowFocused = true;
    await user_check();
});

window.addEventListener("blur", async () => {
    isWindowFocused = false;
    clearTimeout(userCheckTimeoutId);
});
*/

await user_check();

async function page() {
    // Vers crea_eval
    const newEval = document.getElementById("newEval");
    newEval.addEventListener("click", () => {
        window.location.href = `https://professeur.thoth-edu.fr/crea_eval`;
    });

    // Getting user infos
    let userI = {};

    await fetch("https://api.thoth-edu.fr/dashboard/infos_user", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt-token")}`,
        },
        body: JSON.stringify({ token: localStorage.getItem("jwt-token") }),
    })
        .then((response) => response.json())
        .then((data) => {
            userI = data;
        })
        .catch((error) => Palert("Erreur lors de l'envoi des données :", error));

    /*
        userI = {
            username: "testy",
            evals: [
                { name: "C - Esp4", id: "45Uia8" },
                { name: "A - Esp5", id: "4520a8" },
                { name: "D - App7", id: "uAUia8" },
            ],
        };
    */
    console.log(userI);
    // Setting the page
    localStorage.setItem("username", userI.username);
    const username = document.getElementById("username");
    username.textContent = localStorage.getItem("username");

    const evalsDiv = document.getElementById("evals");
    construct(evalsDiv, userI.evals, { url: "controle", param: "e" });
}
await page();
