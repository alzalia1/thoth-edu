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
    let accessI = {};
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const accessParam = urlParams.get("a");

    if (!accessParam) {
        window.location.href = `https://professeur.thoth-edu.fr/dashboard`;
    }

    await fetch("https://api.thoth-edu.fr/dashboard/access/get", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt-token")}`,
        },
        body: JSON.stringify({ id: accessParam }),
    })
        .then((response) => response.json())
        .then((data) => (accessI = data))
        .catch((error) => Perror("Error on dashboard/access/get : " + error));

    // ANCHOR - Setting the page
    const username = document.getElementById("username");
    username.textContent = localStorage.getItem("username");

    const randomAC = document.getElementById("ACrand");
    if (accessI.access.random) {
        randomAC.textContent = "Questions aléatoires : Oui";
    } else {
        randomAC.textContent = "Questions aléatoires : Non";
    }

    const ACname = document.getElementById("ACname");
    ACname.textContent = accessI.access.name;
    document.title = `Accès - ${accessI.access.name}`;

    const nb_ans = document.getElementById("ACans");
    nb_ans.textContent = "Nombre total de réponses à cet accès : " + accessI.ans.length.toString();

    const moyenne = document.getElementById("ACmoy");
    moyenne.textContent = "Moyenne : " + accessI.mark.toString();

    const time = document.getElementById("ACtime");
    let startTime = new Date(parseInt(accessI.access.time.start));
    let endTime = new Date(parseInt(accessI.access.time.end));
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
        " ( Dure " +
        durationStr +
        " )";

    const ansDiv = document.getElementById("ansList");
    construct(ansDiv, accessI.ans, { url: "answer", param: "s", sup: `&a=${accessParam}` });

    // ANCHOR - Deleting eval
    const deleteAccess = document.getElementById("delete");
    deleteAccess.addEventListener("click", () => {
        Pconfirm(
            "Vous allez supprimer l'accès. Cette action est IRRÉVERSIBLE, et il sera totalement impossible de récupérer les données, quelles qu'elles soient, de l'accès et des copies.",
            () => {
                Pinput(
                    `Veuillez recopier l'id de cet accès pour confirmer : \n\n"${accessParam}"`,
                    (inputDelete) => {
                        if (inputDelete == accessParam) {
                            fetch("https://api.thoth-edu.fr/dashboard/access/delete", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({ id: accessParam }),
                            })
                                .then((response) => response.json())
                                .then((data) => {
                                    if (data.status == "fail") {
                                        Palert(data.reason);
                                    } else {
                                        window.location.href = `https://professeur.thoth-edu.fr/dashboard`;
                                    }
                                })
                                .catch((error) =>
                                    Perror("Error on dashboard/access/delete : " + error)
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
    name.value = accessI.access.name;
    const random = document.getElementById("NArandom");
    random.checked = accessI.access.random;
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
            fetch("https://api.thoth-edu.fr/dashboard/access/save", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: name.value,
                    id_eval: accessParam,
                    id_access: accessParam,
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
                .catch((error) => Perror("Error on dashboard/access/save  : " + error));
        }
    });

    // ANCHOR - Generating a QR-Code + Displaying ID
    const access_id_h = document.getElementById("access-id");
    access_id_h.textContent = "ID de cet accès : " + accessParam;
    access_id_h.addEventListener("click", () => {
        navigator.clipboard.writeText(accessParam);
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
                generateQRCode(`https://thoth-edu.fr/eval?e=${accessParam}`);
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
