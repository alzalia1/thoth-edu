import { construct } from "./modules/dashConstruct.js";
import {
    Pconfirm,
    Palert,
    Pinput,
    Plogout,
    Puser_check,
    Perror,
} from "../../shared/scripts/modules/utils.js";

// ANCHOR - System to check and refresh user's token
await Puser_check();

// SECTION - Loads page content
async function page() {
    // ANCHOR - Getting eval content
    let evalI = {};
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const evalParam = urlParams.get("e");

    await fetch("https://api.thoth-edu.fr/dashboard/eval/get", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt-token")}`,
        },
        body: JSON.stringify({ id: evalParam }),
    })
        .then((response) => response.json())
        .then((data) => (evalI = data))
        .catch((error) => Perror("Error on dashboard/eval/get : " + error));

    /*
    evalI = {
        name: "Contrôle grammaire - 2024/2025",
        note: 12,
        nb_reps: 78,
        acces: [
            { name: "TG1", id: "45Uia8", note: 14 },
            { name: "TG2", id: "4520a8", status: 0, note: 16 },
            { name: "TG3", id: "uAUia8", status: 2, note: 13 },
        ],
    };
    */

    // ANCHOR - Setting the page stats
    const username = document.getElementById("username");
    username.textContent = localStorage.getItem("username");

    const EVname = document.getElementById("EVname");
    EVname.textContent = evalI.name;

    const nb_acces = document.getElementById("EVacces");
    nb_acces.textContent = "Nombre d'accès à cette évaluation : " + evalI.acces.length.toString();

    const nb_reps = document.getElementById("EVreps");
    nb_reps.textContent =
        "Nombre total de réponses à cette évaluation : " + evalI.nb_reps.toString();

    const moyenne = document.getElementById("EVmoy");
    moyenne.textContent = "Moyenne : " + evalI.note.toString();

    const accesDiv = document.getElementById("acces");
    construct(accesDiv, evalI.acces, { url: "acces", param: "a" });

    // ANCHOR - Build the "creating access" div
    const createAccess = document.getElementById("create_access");
    const newAccessDivBig = document.getElementById("newAccessBig");
    createAccess.addEventListener("click", () => {
        if (newAccessDivBig.style.display == "block") {
            newAccessDivBig.style.display = "none";
        } else {
            newAccessDivBig.style.display = "block";
        }
    });

    window.addEventListener("click", function (event) {
        if (event.target == newAccessDivBig) {
            newAccessDivBig.style.display = "none";
        }
    });

    const saveNewAccess = document.getElementById("saveNewAccess");
    saveNewAccess.addEventListener("click", () => {
        const name = document.getElementById("NAname");
        const random = document.getElementById("NArandom");
        const start = document.getElementById("NAstart");
        const end = document.getElementById("NAend");
        const error = document.getElementById("NAerror");
        error.textContent = "";
        error.style.whiteSpace = "pre-line";
        let isError = false;

        // Checks the values
        if (!name.value) {
            error.textContent = error.textContent + "Veuillez indiquer un nom valide";
            isError = true;
        }
        if (!start.value) {
            error.textContent = error.textContent + "\nVeuillez indiquer une date de début valide";
            isError = true;
        }
        if (!end.value) {
            error.textContent = error.textContent + "\nVeuillez indiquer une date de fin valide";
            isError = true;
        }

        // If there is no error, then save
        if (!isError) {
            fetch("https://api.thoth-edu.fr/dashboard/eval/create_access", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("jwt-token")}`,
                },
                body: JSON.stringify({
                    name: name.value,
                    id_eval: evalParam,
                    id_access: "none",
                    random: random.checked,
                    time: {
                        start: Date.parse(start.value),
                        end: Date.parse(end.value),
                    },
                }),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.status == "success") {
                        window.location.reload();
                    } else {
                        Palert("Oh non ! Quelque chose a mal fonctionné : ", data.reason);
                    }
                })
                .catch((error) => Perror("Error on dashboard/eval/create_access : " + error));
        }
    });

    // ANCHOR - Deleting eval button
    const deleteEval = document.getElementById("delete");
    deleteEval.addEventListener("click", () => {
        Pconfirm(
            "Vous allez supprimer l'évaluation. Cette action est IRRÉVERSIBLE, et il sera totalement impossible de récupérer les données, quelles qu'elles soient, de l'évaluation, des accès et des copies.",
            () => {
                Pinput(
                    `Veuillez recopier l'id de cette évaluation pour confirmer : \n\n${evalParam}`,
                    (inputDelete) => {
                        if (inputDelete == evalParam) {
                            fetch("https://api.thoth-edu.fr/dashboard/eval/delete", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${localStorage.getItem("jwt-token")}`,
                                },
                                body: JSON.stringify({ id: evalParam }),
                            })
                                .then((response) => response.json())
                                .then((data) => {
                                    if (data.status == "fail") {
                                        Palert("Il y a eu un problème : ", data.reason);
                                    } else {
                                        window.location.href = `https://professeur.thoth-edu.fr/dashboard`;
                                    }
                                })
                                .catch((error) =>
                                    Perror("Error on dashboard/eval/delete  : " + error)
                                );
                        } else {
                            Palert("Vous avez mal recopié l'id. Veuillez recommencer");
                        }
                    }
                );
            }
        );
    });

    // ANCHOR - Editing eval button
    const editEval = document.getElementById("edit");
    editEval.addEventListener("click", () => {
        window.location.href = `https://professeur.thoth-edu.fr/crea_eval?eval=${evalParam}`;
    });

    // ANCHOR - Logout button
    const deconnect = document.getElementById("logout");
    deconnect.addEventListener("click", () => {
        Plogout();
    });
}
await page();
// ùSECTION
