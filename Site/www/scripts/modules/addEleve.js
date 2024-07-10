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
                    answer: "",
                };
            }

            const divPreview = document.createElement("div");

            const titrePreview = document.createElement("h4");
            titrePreview.textContent = "Question n°" + (answers.length + 1).toString();

            const instructionLabel = document.createElement("label");
            instructionLabel.textContent = question.instruction;

            const answerInput = document.createElement("input");
            answerInput.type = "text";
            answerInput.placeholder = "Écrivez votre réponse ici";
            answerInput.addEventListener("input", () => {
                answer.answer = answerInput.value;
                updateLocalStorage();
            });

            divPreview.append(
                titrePreview,
                instructionLabel,
                document.createElement("br"),
                answerInput
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
                    answer: [[]],
                };
            }

            const divPreview = document.createElement("div");
            divPreview.innerHTML = "";

            const titrePreview = document.createElement("h4");
            titrePreview.textContent = "Question n°" + (answers.length + 1).toString();

            const instructionLabel = document.createElement("label");
            instructionLabel.textContent =
                "Conjuguez le verbe '" +
                question.instruction +
                "' aux temps et personnes suivantes :";

            const answerInput = document.createElement("table");

            divPreview.append(titrePreview, instructionLabel, answerInput);

            const table = document.createElement("table");

            function header() {
                const thead = document.createElement("thead");
                const theadRow = document.createElement("tr");

                const empty = document.createElement("th");
                theadRow.appendChild(empty);

                for (let i = 0; i < question.answer.tenses.length; i++) {
                    const th = document.createElement("th");
                    th.textContent = question.answer.tenses[i];
                    theadRow.appendChild(th);
                }

                thead.appendChild(theadRow);
                table.appendChild(thead);
            }
            header();

            function body() {
                const tbody = document.createElement("tbody");

                for (let i = 0; i < question.answer.pronouns.length; i++) {
                    if (!answer.answer[i]) {
                        answer.answer.push([]);
                    }
                    const tr = document.createElement("tr");

                    const th = document.createElement("th");
                    th.textContent = question.answer.pronouns[i];
                    tr.appendChild(th);

                    for (let j = 0; j < question.answer.tenses.length; j++) {
                        if (!answer.answer[i][j]) {
                            answer.answer[i].push([]);
                        }
                        const td = document.createElement("td");
                        const input = document.createElement("input");
                        input.type = "text";
                        input.placeholder = "Verbe conjugué";
                        input.addEventListener("input", () => {
                            answer.answer[i][j] = input.value;
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
