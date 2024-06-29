export let answers = [];
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const evalParam = urlParams.get("e");

export function construct(questionsDiv, questions, newContent = null) {
    const questionElement = document.createElement("div");
    questionElement.className = "question";
    console.log(questions);

    questions.forEach((question) => {
        if (question.type == "traduction") {
            let answer = {};
            if (newContent != null) {
                answer = newContent.eval.find((el) => el.id == question.id);
            } else {
                answer = {
                    id: question.id,
                    reponse: "",
                };
            }

            const divPreview = document.createElement("div");

            const titrePreview = document.createElement("h4");
            titrePreview.textContent = "Question n°" + (answers.length + 1).toString();

            const consigneLabel = document.createElement("label");
            consigneLabel.textContent = question.consigne;

            const reponseInput = document.createElement("input");
            reponseInput.type = "text";
            reponseInput.placeholder = "Écrivez votre réponse ici";
            reponseInput.addEventListener("input", () => {
                answer.reponse = reponseInput.value;
                updateLocalStorage();
            });

            divPreview.append(
                titrePreview,
                consigneLabel,
                document.createElement("br"),
                reponseInput
            );
            questionElement.appendChild(divPreview);
            answers.push(answer);
        } else if (question.type == "conjugaison") {
            let answer = {};
            if (newContent != null) {
                answer = newContent.eval.find((el) => el.id == question.id);
            } else {
                answer = {
                    id: question.id,
                    reponse: [[]],
                };
            }

            const divPreview = document.createElement("div");
            divPreview.innerHTML = "";

            const titrePreview = document.createElement("h4");
            titrePreview.textContent = "Question n°" + (answers.length + 1).toString();

            const consigneLabel = document.createElement("label");
            consigneLabel.textContent =
                "Conjuguez le verbe '" + question.consigne + "' aux temps et personnes suivantes :";

            const reponseInput = document.createElement("table");

            divPreview.append(titrePreview, consigneLabel, reponseInput);

            const table = document.createElement("table");

            function header() {
                const thead = document.createElement("thead");
                const theadRow = document.createElement("tr");

                const empty = document.createElement("th");
                theadRow.appendChild(empty);

                for (let i = 0; i < question.reponse.temps.length; i++) {
                    const th = document.createElement("th");
                    th.textContent = question.reponse.temps[i];
                    theadRow.appendChild(th);
                }

                thead.appendChild(theadRow);
                table.appendChild(thead);
            }
            header();

            function body() {
                const tbody = document.createElement("tbody");

                for (let i = 0; i < question.reponse.pronoms.length; i++) {
                    if (!answer.reponse[i]) {
                        answer.reponse.push([]);
                    }
                    const tr = document.createElement("tr");

                    const th = document.createElement("th");
                    th.textContent = question.reponse.pronoms[i];
                    tr.appendChild(th);

                    for (let j = 0; j < question.reponse.temps.length; j++) {
                        if (!answer.reponse[i][j]) {
                            answer.reponse[i].push([]);
                        }
                        const td = document.createElement("td");
                        const input = document.createElement("input");
                        input.type = "text";
                        input.placeholder = "Verbe conjugué";
                        input.addEventListener("input", () => {
                            answer.reponse[i][j] = input.value;
                            updateLocalStorage();
                        });
                        td.appendChild(input);
                        tr.appendChild(td);
                    }

                    tbody.appendChild(tr);
                }

                table.appendChild(tbody);
            }
            body();

            answers.push(answer);
            divPreview.appendChild(table);
            questionElement.appendChild(divPreview);
        }
    });

    questionsDiv.append(questionElement);
    updateLocalStorage();
}

function updateLocalStorage() {
    let evalPending = {
        id: evalParam,
        eval: answers,
    };
    localStorage.setItem("evalPending", JSON.stringify(evalPending));
}
