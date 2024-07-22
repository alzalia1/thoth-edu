import {
    Pconfirm,
    Palert,
    Pinput,
    Puser_check,
    Perror,
} from "../../shared/scripts/modules/utils.js";

// ANCHOR - System to check and refresh user's token !
await Puser_check();

async function page() {
    let username = localStorage.getItem("username");
    // ANCHOR - Deleting eval
    const deleteAccess = document.getElementById("delete");
    deleteAccess.addEventListener("click", () => {
        Pconfirm(
            "Vous allez supprimer votre compte. <b>CETTE ACTION EST IRRÉVERSIBLE</b>. La totalité de toutes vos données seront immédiatement et définitivement supprimées - nous n'avons AUCUNE FAÇON de les récupérer ensuite. <br /> <b>Êtes-vous sûr de vouloir faire ça ?</b>",
            () => {
                Pinput(
                    `Veuillez recopier votre pseudonyme pour valider cette procédure : \n\n"${username}"`,
                    (inputDelete) => {
                        if (inputDelete == username) {
                            fetch("https://api.thoth-edu.fr/user/delete", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({ token: localStorage.getItem("jwt-token") }),
                            })
                                .then((response) => response.json())
                                .then((data) => {
                                    if (data.status == "fail") {
                                        Palert(data.reason);
                                    } else {
                                        localStorage.clear();
                                        window.location.href = `https://thoth-edu.fr/`;
                                    }
                                })
                                .catch((error) =>
                                    Perror("Error on dashboard/user/delete : " + error)
                                );
                        } else {
                            Palert("Vous avez mal recopié votre pseudonyme. Veuillez recommencer");
                        }
                    }
                );
            }
        );
    });
}
await page();
