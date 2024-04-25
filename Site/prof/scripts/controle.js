import { construct } from "./modules/dashConstruct.js";

// Check if user is allowed !
fetch("https://api.thoth-edu.fr/user/check", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt-token")}`,
    },
    body: JSON.stringify({}),
})
    .then((response) => response.json())
    .then((data) => {
        if (data.status == "success") {
            page();
        } else {
            throw Error("Connexion non autorisée");
        }
    })
    .catch((error) => {
        window.stop();
        alert("Vous n'êtes pas censé être ici ! Veuillez vous connecter avant.");
        console.log(error);
        window.location.href = `https://professeur.thoth-edu.fr/`;
    });

function page() {
    // Getting eval info
    let evalI = {};
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const evalParam = urlParams.get("e");

    fetch("https://api.thoth-edu.fr/dashboard/eval/get", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt-token")}`,
        },
        body: JSON.stringify({ id: evalParam }),
    })
        .then((response) => response.json())
        .then((data) => (evalI = data))
        .catch((error) => alert("Erreur lors de l'envoi des données : " + error));

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
    // Setting the page
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

    // Creating access
    const createAccess = document.getElementById("create_access");
    const newAccessDiv = document.getElementById("newAccess");
    createAccess.addEventListener("click", () => {
        newAccessDiv.hidden = !newAccessDiv.hidden;
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
                    random: random.value,
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
                        alert("Oh non ! Quelque chose a mal fonctionné : ", data.reason);
                    }
                })
                .catch((error) => alert("Erreur lors de l'envoi des données :", error));
        }
    });

    // Deleting eval
    const deleteEval = document.getElementById("delete");
    deleteEval.addEventListener("click", () => {
        const confirmed = window.confirm(
            "Vous allez supprimer l'évaluation. Cette action est IRRÉVERSIBLE, et il sera totalement impossible de récupérer les données, quelles qu'elles soient, de l'évaluation, des accès et des copies."
        );
        if (confirmed) {
            const inputDelete = prompt(
                `Veuillez recopier l'id de cette évaluation pour confirmer : \n\n${evalParam}`
            );
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
                            alert("Il y a eu un problème : ", data.reason);
                        } else {
                            window.location.href = `https://professeur.thoth-edu.fr`;
                        }
                    })
                    .catch((error) => alert("Erreur lors de l'envoi des données :", error));
            } else {
                alert("Vous avez mal recopié l'id. Veuillez recommencer");
            }
        }
    });

    // Editing eval
    const editEval = document.getElementById("edit");
    editEval.addEventListener("click", () => {
        window.location.href = `https://professeur.thoth-edu.fr/crea_eval?eval=${evalParam}`;
    });
}
