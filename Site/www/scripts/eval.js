import { construct, answers } from "./modules/addEleve.js";
import { Pconfirm, Palert, Pinput, Perror } from "../../shared/scripts/modules/utils.js";

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const evalParam = urlParams.get("e");

// ANCHOR - Check if access exists
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
            .catch((error) => Perror("Error on eval/check_access : " + error));
    }
}

// ANCHOR - Get eval content
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
        .catch((error) => Perror("Error on eval/get_eval : " + error));
}

// SECTION - Load page content
let nomEleve;
async function page() {
    Pinput(
        "Veuillez indiquer votre nom avant de commencer ce contrôle. \n\nAttention ! Si vous quittez cette page ou ce navigateur web, le site considèrera que vous trichez !",
        (e) => {
            nomEleve = e;
            // ANCHOR - Putting name
            const name = document.getElementById("name");
            name.textContent = "Nom de l'élève : " + nomEleve;
        }
    );

    // ANCHOR - Warn about anti-cheat (and setup)
    Palert(
        "Attention ! Si vous quittez cette page ou ce navigateur web, le site considèrera que vous trichez, et vous serez obligé d'envoyer le contrôle dans son état actuel !"
    );

    // FIXME : ÇA NE MARCHE PAS CETTE MERDE ANTI-TRICHE
    // document.addEventListener("visibilitychange", async () => {
    //     if (document.visibilityState === "hidden") {
    //         await sendAnsEleve(true);
    //     }
    // });

    // window.addEventListener("blur", async () => {
    //     await sendAnsEleve(true);
    // });

    // ANCHOR - Building the questions
    const questionsDiv = document.getElementById("questionsList");

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

    // ANCHOR - Putting the title
    const title = document.getElementById("titre");
    title.textContent = evalContent.eval.name + " - " + evalContent.name;

    // ANCHOR - Chronomètre
    const chrono = document.getElementById("chrono");
    let tempsEcoule = 0;

    function mettreAJourCompteARebours() {
        const TEMPS_RESTANT = Math.floor(duration / 1000);
        // Calculer le nombre de minutes et de secondes restantes
        const minutesRestantes = Math.floor((TEMPS_RESTANT - tempsEcoule) / 60);
        const secondesRestantes = (TEMPS_RESTANT - tempsEcoule) % 60;

        // Mettre à jour l'affichage du compte à rebours
        chrono.innerHTML = `${minutesRestantes}m ${secondesRestantes}s`;

        // Incrémenter le temps écoulé
        tempsEcoule++;

        // Arrêter le compte à rebours si le temps est écoulé
        if (tempsEcoule >= TEMPS_RESTANT) {
            clearInterval(intervalCompteARebours);
        }
    }

    // Définir l'intervalle pour la mise à jour du compte à rebours
    const intervalCompteARebours = setInterval(mettreAJourCompteARebours, 1000);

    // ANCHOR - Saving and sending results
    const save = document.getElementById("save");
    save.addEventListener("click", () => {
        Pconfirm(
            "Vous ne pourrez plus modifier vos réponses une fois cette évaluation rendue. Veuillez confirmer que vous souhaitez rendre.",
            () => {
                sendAnsEleve(false);
            }
        );
    });
}
// ùSECTION

// ANCHOR - Send answers
async function sendAnsEleve(aTriche) {
    let sendBackForm = {
        id_access: evalParam,
        id_el: nomEleve,
        answers: answers,
        aTriche: aTriche,
    };

    fetch("https://api.thoth-edu.fr/eval/ans_students", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(sendBackForm),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.status == "success") {
                if (aTriche) {
                    Palert(
                        "Il semblerait que vous ayez triché - ou du moins vous avez quitté cette page. Votre contrôle a donc été enregistré, avec une note à 0.",
                        () => {
                            localStorage.removeItem("evalPending");
                            window.location.href = `https://thoth-edu.fr`;
                        }
                    );
                } else {
                    Palert(
                        "Vos réponses ont bien été renvoyées. Vous allez être redirigé vers la page d'accueil.",
                        () => {
                            localStorage.removeItem("evalPending");
                            window.location.href = `https://thoth-edu.fr`;
                        }
                    );
                }
                setTimeout(() => {
                    localStorage.removeItem("evalPending");
                    window.location.href = `https://thoth-edu.fr`;
                }, 5000);
            }
        })
        .catch((error) => Perror("Error on eval/ans_students : " + error));
}

let duration;
async function init() {
    await check_id();
    await get_eval_content();
    await page();

    // ANCHOR - Set time limit
    const currentTime = new Date().getTime();
    const endTime = new Date(parseInt(evalContent.time.end)).getTime();
    duration = endTime - currentTime;
    console.log(duration, evalContent.time.end, endTime);

    const MAX_DELAY = 2147483547;
    if (duration <= 0) {
        duration = 0;
    } else if (duration > MAX_DELAY) {
        duration = MAX_DELAY;
    }

    setTimeout(() => {
        Palert(
            "Vous êtes à court de temps ! Votre évaluation sera envoyée comme elle est maintenant, veuillez indiquer votre nom ici.",
            async () => {
                await sendAnsEleve(false);
            }
        );
    }, duration);
}
init();
