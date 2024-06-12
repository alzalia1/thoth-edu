import { construct } from "./modules/dashConstruct.js";
import {
    Pconfirm,
    Palert,
    Pinput,
    Puser_check,
    Perror,
} from "../../shared/scripts/modules/utils.js";

// ANCHOR - System to check and refresh user's token !
await Puser_check();

// SECTION - Load page content
async function page() {
    // ANCHOR - Getting eval infos
    let accesI = {};
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const accesParam = urlParams.get("a");

    await fetch("https://api.thoth-edu.fr/dashboard/acces/get", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt-token")}`,
        },
        body: JSON.stringify({ id: accesParam }),
    })
        .then((response) => response.json())
        .then((data) => (accesI = data))
        .catch((error) => Perror("Error on dashboard/acces/get : " + error));

    /*
    accesI = {
        access: {
            name: "TG2",
            id_eval: "ahbVai1",
            id_access: "atkrk668",
            random: true,
            time: {
                start: -23890247841000,
                end: -23890147541000,
            },
        },
        note: 13,
        reps: [
            { name: "Jeremy A.", id: "45Uia8", note: 18 },
            { name: "Clarina H.", id: "4520a8", note: 20 },
            { name: "Jean-Jacques R.", id: "uAUia8", note: 15.2 },
        ],
    };
    */

    // ANCHOR - Setting the page
    const username = document.getElementById("username");
    username.textContent = localStorage.getItem("username");

    const randomAC = document.getElementById("ACrand");
    if (accesI.access.random) {
        randomAC.textContent = "Questions aléatoires : Oui";
    } else {
        randomAC.textContent = "Questions aléatoires : Non";
    }

    const ACname = document.getElementById("ACname");
    ACname.textContent = accesI.access.name;

    const nb_reps = document.getElementById("ACreps");
    nb_reps.textContent = "Nombre total de réponses à cet accès : " + accesI.reps.length.toString();

    const moyenne = document.getElementById("ACmoy");
    moyenne.textContent = "Moyenne : " + accesI.note.toString();

    const time = document.getElementById("ACtime");
    let startTime = new Date(parseInt(accesI.access.time.start));
    let endTime = new Date(parseInt(accesI.access.time.end));
    let durationMs = endTime - startTime;
    console.log(startTime, endTime);

    let seconds = Math.floor((durationMs % 60000) / 1000);
    let minutes = Math.floor((durationMs % 3600000) / 60000);
    let hours = Math.floor(durationMs / 3600000);

    let durationStr = "";
    if (hours > 0) {
        durationStr += hours + "h ";
    }
    if (minutes > 0) {
        durationStr += minutes + "m ";
    }
    if (seconds > 0) {
        durationStr += seconds + "s ";
    }
    time.textContent =
        "Débute le " +
        startTime.toLocaleString() +
        " - Se termine le " +
        endTime.toLocaleString() +
        " ( " +
        durationStr +
        " )";

    const repDiv = document.getElementById("repList");
    construct(repDiv, accesI.reps, { url: "copie", param: "c" });

    // ANCHOR - Deleting eval
    const deleteAcces = document.getElementById("delete");
    deleteAcces.addEventListener("click", () => {
        Pconfirm(
            "Vous allez supprimer l'acces. Cette action est IRRÉVERSIBLE, et il sera totalement impossible de récupérer les données, quelles qu'elles soient, de l'accès et des copies.",
            () => {
                Pinput(
                    `Veuillez recopier l'id de cet accès pour confirmer : \n\n${accesParam}`,
                    (inputDelete) => {
                        if (inputDelete == accesParam) {
                            fetch("https://api.thoth-edu.fr/dashboard/acces/delete", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({ id: accesParam }),
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
                                    Perror("Error on dashboard/acces/delete : " + error)
                                );
                        } else {
                            Palert("Vous avez mal recopié l'id. Veuillez recommencer");
                        }
                    }
                );
            }
        );
    });

    // ANCHOR - Editing an access

    const name = document.getElementById("NAname");
    name.value = accesI.access.name;
    const random = document.getElementById("NArandom");
    random.checked = accesI.access.random;
    const start = document.getElementById("NAstart");
    start.value =
        startTime.getFullYear() +
        "-" +
        (startTime.getMonth() + 1).toString().padStart(2, "0") +
        "-" +
        startTime.getDate().toString().padStart(2, "0") +
        "T" +
        startTime.getHours().toString().padStart(2, "0") +
        ":" +
        startTime.getMinutes().toString().padStart(2, "0");
    const end = document.getElementById("NAend");
    end.value =
        endTime.getFullYear() +
        "-" +
        (endTime.getMonth() + 1).toString().padStart(2, "0") +
        "-" +
        endTime.getDate().toString().padStart(2, "0") +
        "T" +
        endTime.getHours().toString().padStart(2, "0") +
        ":" +
        endTime.getMinutes().toString().padStart(2, "0");
    const error = document.getElementById("NAerror");
    error.textContent = "";
    error.style.whiteSpace = "pre-line";
    let isError = false;

    const createAccess = document.getElementById("editAccess");
    const editAccessDivBig = document.getElementById("editAccessBig");
    createAccess.addEventListener("click", () => {
        if (editAccessDivBig.style.display == "block") {
            editAccessDivBig.style.display = "none";
        } else {
            editAccessDivBig.style.display = "block";
        }
    });

    window.addEventListener("click", function (event) {
        if (event.target == editAccessDivBig) {
            editAccessDivBig.style.display = "none";
        }
    });

    const editAccess = document.getElementById("saveNewAccess");
    editAccess.addEventListener("click", () => {
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
            fetch("https://api.thoth-edu.fr/dashboard/acces/save", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: name.value,
                    id_eval: accesParam,
                    id_access: accesParam,
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
                .catch((error) => Perror("Error on dashboard/acces/save  : " + error));
        }
    });

    // ANCHOR - Generating a QR-Code + Displaying ID
    const access_id_h = document.getElementById("access-id");
    access_id_h.textContent = "ID de cet accès : " + accesParam;
    access_id_h.addEventListener("click", () => {
        navigator.clipboard.writeText(accesParam);
    });

    let isGenerated = false;
    function generateQRCode(url) {
        const qrcode = new QRCode("QRSmall", {
            width: 500,
            height: 500,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.M,
        });

        qrcode.makeCode(url);
        isGenerated = true;
    }

    const createQRCode = document.getElementById("qr-code");
    const qrCodeBig = document.getElementById("QRBig");
    const qrCodeSmall = document.getElementById("QRSmall");
    createQRCode.addEventListener("click", () => {
        if (qrCodeBig.style.display == "block") {
            qrCodeBig.style.display = "none";
        } else {
            qrCodeBig.style.display = "block";
            if (!isGenerated) {
                qrCodeSmall.style.width = "500px";
                generateQRCode(`https://thoth-edu.fr/eval?e=${accesParam}`);
            }
        }
    });

    window.addEventListener("click", function (event) {
        if (event.target == qrCodeBig) {
            qrCodeBig.style.display = "none";
        }
    });
}
await page();
// ùSECTION
