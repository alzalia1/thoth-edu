import { addQuestion, questions, loadFromID, loadFromPending } from "./modules/addQuestions.js";
import { Pconfirm, Palert, Pinput } from "../../shared/scripts/modules/utils.js";

// System to check and refresh user's token !
let userCheckInProgress = false;
let userCheckTimeoutId = null;

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
await user_check();

async function page() {
    // Setting the page
    const username = document.getElementById("username");
    username.textContent = localStorage.getItem("username");

    // load or not ?
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const evalParam = urlParams.get("eval");
    const evalName = document.getElementById("nom_eval");
    if (!(evalParam == null)) {
        // Loads questions if passed parameter
        await fetch("https://api.thoth-edu.fr/crea/get", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("jwt-token")}`,
            },
            body: JSON.stringify({ id: evalParam }),
        })
            .then((response) => response.json())
            .then((data) => {
                evalName.value = data.eval.name;
                loadFromID(data.eval.questions);
            })
            .catch((error) => Palert("Erreur lors de l'envoi des données :" + error));
    } else if (
        localStorage.getItem("evalPending") &&
        localStorage.getItem("evalPending") != "none"
    ) {
        Pconfirm(
            "Une ancienne évaluation mal enregistrée a été détectée. Voulez-vous la recharger ?",
            () => {
                loadFromPending(JSON.parse(localStorage.getItem("evalPending")));
            }
        );
        /*
        const reload = window.confirm(
            "Une ancienne évaluation mal enregistrée a été détectée. Voulez-vous la recharger ?"
        );
        if (reload) {
            loadFromPending(JSON.parse(localStorage.getItem("evalPending")));
        }
        */
    }

    // Something, I guess
    const addType = document.getElementById("addType");
    const statQuestions = document.getElementById("nbQuestions");

    const addConjugButton = document.getElementById("addConjug");
    addConjugButton.addEventListener("click", () => {
        addQuestion("conjugaison");
        addType.hidden = true;
        statQuestions.textContent = "Nombre de questions : " + questions.length.toString();
    });

    const addTradButton = document.getElementById("addTrad");
    addTradButton.addEventListener("click", () => {
        addQuestion("traduction");
        addType.hidden = true;
        statQuestions.textContent = "Nombre de questions : " + questions.length.toString();
    });

    const addQuestionButton = document.getElementById("addQuestion");
    addQuestionButton.addEventListener("click", () => {
        addType.hidden = false;
    });

    // Saving
    const saveButton = document.getElementById("save");
    saveButton.addEventListener("click", () => {
        Pconfirm(
            "Vous vous appretez à sauvegarder. Cela vous ramènera sur votre dashboard.",
            () => {
                // Making the correct data format
                if (evalName == "") {
                    Palert("Vous devez indiquer un nom pour l'évaluation");
                } else {
                    let evalData = {
                        name: evalName.value,
                        questions: [],
                    };

                    questions.forEach((question) => {
                        evalData.questions.push(question.eval);
                    });

                    let formData = {
                        eval: evalData,
                        token: localStorage.getItem("jwt-token"),
                    };

                    if (evalParam) {
                        formData.id = evalParam;
                    } else {
                        formData.id = "none";
                    }

                    // Sending data
                    fetch("https://api.thoth-edu.fr/crea/save", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem("jwt-token")}`,
                        },
                        body: JSON.stringify(formData),
                    })
                        .then((response) => response.json())
                        .then((data) => {
                            if (data.status == "success") {
                                Palert("Évaluation sauvegardée avec succès");
                                localStorage.setItem("evalPending", "none");
                                if (evalParam) {
                                    window.location.href = `https://professeur.thoth-edu.fr/dashboard/controle?e=${evalParam}`;
                                } else {
                                    window.location.href = `https://professeur.thoth-edu.fr/dashboard`;
                                }
                            } else {
                                console.log("pas ok" + data.reason);
                            }
                        })
                        .catch((error) => Palert("Erreur lors de l'envoi des données :" + error));
                }
            }
        );

        /*
        const confirm = window.confirm(
            "Vous vous appretez à sauvegarder. Cela vous ramènera sur votre dashboard."
        );
        if (confirm) {
            // Making the correct data format
            if (evalName == "") {
                Palert("Vous devez indiquer un nom pour l'évaluation");
            } else {
                let evalData = {
                    name: evalName.value,
                    questions: [],
                };

                questions.forEach((question) => {
                    evalData.questions.push(question.eval);
                });

                let formData = {
                    eval: evalData,
                    token: localStorage.getItem("jwt-token"),
                };

                if (evalParam) {
                    formData.id = evalParam;
                } else {
                    formData.id = "none";
                }

                // Sending data
                fetch("https://api.thoth-edu.fr/crea/save", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("jwt-token")}`,
                    },
                    body: JSON.stringify(formData),
                })
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.status == "success") {
                            Palert("Évaluation sauvegardée avec succès");
                            localStorage.setItem("evalPending", "none");
                            if (evalParam) {
                                window.location.href = `https://professeur.thoth-edu.fr/dashboard/controle?e=${evalParam}`;
                            } else {
                                window.location.href = `https://professeur.thoth-edu.fr/dashboard`;
                            }
                        } else {
                            console.log("pas ok" + data.reason);
                        }
                    })
                    .catch((error) => Palert("Erreur lors de l'envoi des données :" + error));
            }
        }
        */
    });

    window.getQuestions = function () {
        return questions;
    };

    window.getLocalStorageSize = function () {
        let size = 0;
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = localStorage.getItem(key);
            size += key.length * 2 + value.length * 2;
        }
        return size;
    };

    window.simulateSave = function () {
        let evalData = {
            name: evalName.value,
            questions: [],
        };

        questions.forEach((question) => {
            evalData.questions.push(question.eval);
        });

        console.log(evalData);
    };

    // Also the logic for the "dashboard" button

    const backToDashboard = document.getElementById("dashboard");
    backToDashboard.addEventListener("click", () => {
        Pconfirm(
            "Attention ! Vous vous apprêtez à quitter sans sauvegarder ! Confirmez-vous ?",
            () => {
                window.location.href = "https://professeur.thoth-edu.fr/dashboard";
            }
        );
    });
}
await page();
