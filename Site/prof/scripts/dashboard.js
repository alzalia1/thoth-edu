import { construct } from "./modules/dashConstruct.js";
import { Palert, Perror, Plogout, Puser_check } from "../../shared/scripts/modules/utils.js";

// ANCHOR - System to check and refresh user's token
await Puser_check();

// SECTION - Page content
async function page() {
    // ANCHOR - Vers crea_eval
    const newEval = document.getElementById("newEval");
    newEval.addEventListener("click", () => {
        window.location.href = `https://professeur.thoth-edu.fr/crea_eval`;
    });

    // ANCHOR - Getting user infos
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
        .catch((error) => Perror("Error on dashboard/infos_user : " + error));

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

    // ANCHOR - Setting the page
    localStorage.setItem("username", userI.username);

    const evalsDiv = document.getElementById("evals");
    construct(evalsDiv, userI.evals, { url: "eval", param: "e" });
}
await page();
// ùSECTION
