import { Puser_check, Perror, Pconfirm, Palert } from "/shared/scripts/modules/utils.js";
import { addQuestion, loadFromID, loadFromPending } from "./modules/addQuestions.js";

// ANCHOR - System to check and refresh user's token !
await Puser_check();

async function page() {
    // ANCHOR - Updating constant page content
    const username = document.getElementById("username");
    username.textContent = localStorage.getItem("username");
    document.addEventListener("DOMContentLoaded", () => {
        const backToDashboard = document.getElementById("dashboard");
        backToDashboard.addEventListener("click", () => {
            Pconfirm(
                "Attention ! Vous vous apprêtez à quitter sans sauvegarder ! Confirmez-vous ?",
                () => {
                    window.location.href = "https://professeur.thoth-edu.fr/dashboard";
                }
            );
        });
    });

    // ANCHOR - Wether to load from an id/a pending or not
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const evalParam = urlParams.get("e");
    if (!(evalParam == null)) {
        // Load with an id passed in URL
        loadFromID(evalParam);
    } else if (
        localStorage.getItem("evalPending") &&
        localStorage.getItem("evalPending") != "none"
    ) {
        Pconfirm(
            "Une ancienne évaluation mal enregistrée a été détectée. Nous pouvons essayer de la recharger à partir des informations stockées localement. Veuillez confirmer ou non.",
            () => {
                loadFromPending();
            }
        );
    }

    // ANCHOR - Logic for the add buttons
    const addTypeButtonsDiv = document.getElementById("addType");

    const addQuestionButton = document.getElementById("addQuestion");
    addQuestionButton.addEventListener("click", () => {
        addTypeButtonsDiv.hidden = false;
    });

    const addTradButton = document.getElementById("addTrad");
    addTradButton.addEventListener("click", () => {
        addTypeButtonsDiv.hidden = true;
        addQuestion("traduction");
    });

    const addConjugButton = document.getElementById("addConjug");
    addConjugButton.addEventListener("click", () => {
        addTypeButtonsDiv.hidden = true;
        addQuestion("conjugaison");
    });

    // ANCHOR - Logic for the save button
    const saveButton = document.getElementById("save");
    saveButton.addEventListener("click", () => {
        let evalContent = JSON.parse(localStorage.getItem("evalPending"));
        if (evalContent.name.length <= 0) {
            Palert("Attention, vous devez renseigner un nom à l'évaluation !");
            return;
        }

        fetch("https://api.thoth-edu.fr/crea/save", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                eval: evalContent,
                token: localStorage.getItem("jwt-token"),
                id: evalParam != null ? evalParam : "none",
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status == "success") {
                    Palert(
                        "Votre évaluation a été enregistrée avec succès ! Vous allez être redirigé vers le dashboard.",
                        () => {
                            window.location.href = `https://professeur.thoth-edu.fr/dashboard`;
                        }
                    );
                    setTimeout(() => {
                        window.location.href = `https://professeur.thoth-edu.fr/dashboard`;
                    }, 5000);
                } else {
                    Palert(data.reason);
                }
            })
            .catch((error) => Perror("Error on crea/get : " + error));
    });
}
await page();
