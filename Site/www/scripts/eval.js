import { construct, answers } from "./modules/addEleve.js";
import { Pconfirm, Palert, Pinput } from "../../shared/scripts/modules/utils.js";

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const evalParam = urlParams.get("e");

// Check if access exists
async function check_id() {
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
            .catch((error) => Palert("Erreur lors de l'envoi des données :" + error));
    }
}
await check_id();

// Get eval content

let evalContent = {};

async function get_eval_content() {
    await fetch("https://api.thoth-edu.fr/eval/get_eval", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: evalParam }),
    })
        .then((response) => response.json())
        .then((data) => (evalContent = data))
        .catch((error) => Palert("Erreur lors de l'envoi des données :" + error));
}
await get_eval_content();

// Load page content

async function page() {
    // Building the questions
    const questionsDiv = document.getElementById("questionsList");
    console.log(evalContent);

    // Construct, either with our without precedent answers
    const oldAnswers = JSON.parse(localStorage.getItem("evalPending"));
    if (oldAnswers != null && oldAnswers.id == evalParam) {
        Pconfirm(
            "Il semblerait que vous ayez déjà commencé à répondre à cette évaluation, sans que cela ne soit correctement enregistré. Voulez-vous recharger vos réponses ?",
            () => {
                construct(questionsDiv, evalContent.eval.questions, oldAnswers);
            },
            () => {
                localStorage.removeItem("evalPending");
                construct(questionsDiv, evalContent.eval.questions);
            }
        );
    } else {
        if (oldAnswers != null) {
            localStorage.removeItem("evalPending");
        }
        construct(questionsDiv, evalContent.eval.questions);
    }

    // Putting the title
    const title = document.getElementById("titre");
    title.textContent = evalContent.eval.name + " - " + evalContent.name;

    // Saving and sending results
    const studentName = document.getElementById("stName");
    const save = document.getElementById("save");
    save.addEventListener("click", () => {
        if (!studentName.value) {
            Palert("Veuillez rentrer un nom selon les consignes du professeur.");
        } else {
            Pconfirm(
                "Vous ne pourrez plus modifier vos réponses une fois cette évaluation rendue. Veuillez confirmer que vous souhaitez rendre.",
                () => {
                    let sendBackForm = {
                        id_access: evalParam,
                        id_el: studentName.value,
                        responses: answers,
                    };
                    console.log(sendBackForm);

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
                                Palert(
                                    "Vos réponses ont bien été renvoyées. Vous allez être redirigé vers la page d'accueil."
                                );
                                setTimeout(() => {
                                    localStorage.removeItem("evalPending");
                                    window.location.href = `https://thoth-edu.fr`;
                                }, 5000);
                            }
                        })
                        .catch((error) => Palert("Erreur lors de l'envoi des données : " + error));
                }
            );
        }
    });
}
page();
