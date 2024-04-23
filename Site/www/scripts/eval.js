import { construct, answers } from "./modules/addEleve.js";

// Get the id  and check it exists

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const evalParam = urlParams.get("e");

if (!evalParam) {
    window.location.href = `https://thoth-edu.fr/`;
} else {
    fetch("https://api.thoth-edu.fr/eval/check_access", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: evalParam }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (!(data.exist == "yes")) {
                window.location.href = `https://thoth-edu.fr/`;
            }
        })
        .catch((error) => console.error("Erreur lors de l'envoi des données :", error));
}

// Get the eval content

let evalContent = {};

fetch("https://api.thoth-edu.fr/eval/get_eval", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: evalParam }),
})
    .then((response) => response.json())
    .then((data) => (evalContent = data))
    .catch((error) => alert("Erreur lors de l'envoi des données :", error));

addEventListener("DOMContentLoaded", () => {
    // Building the questions
    const questionsDiv = document.getElementById("questionsList");
    construct(questionsDiv, evalContent.eval);

    // Putting the title
    const title = document.getElementById("titre");
    title.textContent = evalContent.eval.name;

    // Saving and sending results
    const studentName = document.getElementById("stName");
    const save = document.getElementById("save");
    save.addEventListener("click", () => {
        if (!studentName.value) {
            alert("Veuillez rentrer un nom selon les consignes du professeur.");
        } else {
            let confirmed = window.confirm(
                "Vous ne pourrez plus modifier vos réponses une fois cette évaluation rendue. Veuillez confirmer que vous souhaitez rendre."
            );
            if (confirmed) {
                let sendBackForm = {
                    id: evalParam,
                    responses: answers,
                };

                fetch("https://api.thoth-edu.fr/eval/reps_eleves", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(sendBackForm),
                })
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.status == "success") {
                            alert(
                                "Vos réponses ont bien été renvoyées. Vous allez être redirigé vers la page d'accueil."
                            );
                            setTimeout(() => {
                                window.location.href = `https://thoth-edu.fr`;
                            }, 5000);
                        }
                    })
                    .catch((error) => alert("Erreur lors de l'envoi des données :", error));
            }
        }
    });
});
