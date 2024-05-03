import { addQuestion, questions, load } from "./modules/addQuestions.js";

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
            alert("Votre demande n'est pas autorisée ! Veuillez vous connecter avant.");
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
    if (!(evalParam == null)) {
        // Loads questions if passed parameter
        fetch("https://api.thoth-edu.fr/crea/get", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("jwt-token")}`,
            },
            body: JSON.stringify({ id: evalParam }),
        })
            .then((response) => response.json())
            .then((data) => load(data.eval.questions))
            .catch((error) => alert("Erreur lors de l'envoi des données :" + error));
    } else if (
        localStorage.getItem("evalPending") &&
        localStorage.getItem("evalPending") != "none"
    ) {
        const reload = window.confirm(
            "Une ancienne évaluation mal enregistrée a été détectée. Voulez-vous la recharger ?"
        );
        if (reload) {
            load(JSON.parse(localStorage.getItem("evalPending")));
        }
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
        const confirm = window.confirm(
            "Vous vous appretez à sauvegarder. Cela vous ramènera sur votre dashboard."
        );
        if (confirm) {
            // Making the correct data format
            const evalName = document.getElementById("nom_eval").value;
            if (evalName == "") {
                alert("Vous devez indiquer un nom pour l'évaluation");
            } else {
                let evalData = {
                    name: evalName,
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
                            alert("Évaluation sauvegardée avec succès");
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
                    .catch((error) => alert("Erreur lors de l'envoi des données :" + error));
            }
        }
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
        const evalName = document.getElementById("nom_eval").value;
        let evalData = {
            name: evalName,
            questions: [],
        };

        questions.forEach((question) => {
            evalData.questions.push(question.eval);
        });

        console.log(evalData);
    };
}
await page();
