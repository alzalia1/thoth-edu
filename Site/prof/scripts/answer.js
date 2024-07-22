import {
    Puser_check,
    Perror,
    Pconfirm,
    Palert,
    Pinput,
} from "../../shared/scripts/modules/utils.js";

// ANCHOR - Main global vars
let answers = [];
const questionsDiv = document.getElementById("questionsList");
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const studentParam = urlParams.get("s");
const accessParam = urlParams.get("a");

if (!studentParam || !accessParam) {
    window.location.href = `https://professeur.thoth-edu.fr/dashboard`;
}
// System to check and refresh user's token
await Puser_check();

// SECTION - Get answer info
await fetch("https://api.thoth-edu.fr/dashboard/ans/get", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({ id_ans: studentParam, id_access: accessParam }),
})
    .then((response) => response.json())
    .then((data) => (answers = data.ans))
    .catch((error) => Perror("Error on dashboard/ans/get : " + error));
// ùSECTION

// SECTION - Create page
async function page() {
    // ANCHOR - Set the global stats
    const studentName = document.getElementById("studentName");
    studentName.textContent = studentParam;
    document.title = `Copie de ${studentParam}`;

    const pointsGot = document.getElementById("ptsGot");
    pointsGot.textContent = answers.reduce((acc, ans) => acc + ans.points.got, 0).toString();

    const pointsMax = document.getElementById("ptsMax");
    pointsMax.textContent = answers.reduce((acc, ans) => acc + ans.points.max, 0).toString();

    // ANCHOR - Add the answers
    answers.forEach((answer) => {
        addQuestion(answer);
    });

    // ANCHOR - Deleting answer
    const deleteAnswer = document.getElementById("delete");
    deleteAnswer.addEventListener("click", () => {
        Pconfirm(
            "Vous allez supprimer la copie. Cette action est IRRÉVERSIBLE, et il sera totalement impossible de récupérer les données de la copie.",
            () => {
                Pinput(
                    `Veuillez recopier l'id de cette copie pour confirmer : \n\n"${studentParam}"`,
                    (inputDelete) => {
                        if (inputDelete == studentParam) {
                            fetch("https://api.thoth-edu.fr/dashboard/ans/delete", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    id_ans: studentParam,
                                    id_access: accessParam,
                                }),
                            })
                                .then((response) => response.json())
                                .then((data) => {
                                    if (data.status == "fail") {
                                        Palert(data.reason);
                                    } else {
                                        window.location.href = `https://professeur.thoth-edu.fr/dash/access?a=${accessParam}`;
                                    }
                                })
                                .catch((error) =>
                                    Perror("Error on dashboard/ans/delete : " + error)
                                );
                        } else {
                            Palert("Vous avez mal recopié l'id. Veuillez recommencer");
                        }
                    }
                );
            }
        );
    });
} // ùSECTION
await page();

// SECTION - Adding question
function addQuestion(q) {
    const index = questionsDiv.querySelectorAll(".quest").length + 1;
    // ANCHOR - Quest div
    const questDiv = document.createElement("div");
    questDiv.classList.add("quest");
    questDiv.id = index.toString;

    // ANCHOR - Title
    const questTitle = document.createElement("h1");
    questTitle.textContent = `Question n°${index.toString()} (${q.points.got}/${q.points.max})`;
    questDiv.append(questTitle);

    // SECTION - Question's body
    switch (q.type) {
        case "traduction": // ANCHOR - Traduction
            const instructionTrad = document.createElement("p");
            instructionTrad.textContent = q.instruction;

            const answerGivenTrad = document.createElement("p");
            answerGivenTrad.textContent = "Réponse de l'élève : " + q.answer.ans;

            const answerExpectedTrad = document.createElement("p");
            answerExpectedTrad.textContent = "Réponse attendue : " + q.answer.correction;

            questDiv.append(instructionTrad, answerGivenTrad, answerExpectedTrad);
            break;
        case "conjugaison": // SECTION - Conjugaison
            const instructionConjug = document.createElement("p");
            instructionConjug.textContent = `Conjuguez le verbe '${q.instruction}' aux temps et personnes suivants :`;

            const answerTableConjug = document.createElement("table");
            answerTableConjug.classList.add("questAns");

            // ANCHOR - Tenses row
            const answerFirstRowConjug = answerTableConjug.insertRow();

            const answerFirstCellConjug = answerFirstRowConjug.insertCell(); // Empty corner cell
            answerFirstCellConjug.innerHTML = `<b>élève</b></br><i>correction</i>`;

            q.answer.correction.tenses.forEach((tense) => {
                const tenseCellConjug = answerFirstRowConjug.insertCell();
                tenseCellConjug.textContent = tense;
            });

            // ANCHOR - Other rows

            for (let i = 0; i < q.answer.correction.pronouns.length; i++) {
                const pronoun = q.answer.correction.pronouns[i];

                const pronounRowConjug = answerTableConjug.insertRow();
                const pronounCellConjug = pronounRowConjug.insertCell();
                pronounCellConjug.textContent = pronoun;

                for (let j = 0; j < q.answer.correction.tenses.length; j++) {
                    const verbCellConjug = pronounRowConjug.insertCell();
                    const verbInputConjug = document.createElement("p");
                    verbInputConjug.innerHTML = `<b>${q.answer.student.verbs[i][j]}</b></br><i>${q.answer.correction.verbs[i][j]}</i>`;

                    verbCellConjug.append(verbInputConjug);
                }
            }

            questDiv.append(instructionConjug, answerTableConjug);

            break; // ùSECTION
    } // ùSECTION

    questionsDiv.append(questDiv);
} // ùSECTION
