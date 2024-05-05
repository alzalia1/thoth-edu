import { Pconfirm, Palert, Pinput } from "../../../shared/scripts/modules/utils.js";

export let answers = [];

export function construct(questionsDiv, questions) {
    const questionElement = document.createElement("div");
    questionElement.className = "question";

    questions.forEach((question) => {
        if (question.type == "traduction") {
            let answer = {
                id: question.id,
                reponse: "",
            };
            const divPreview = document.createElement("div");

            const titrePreview = document.createElement("h4");
            titrePreview.textContent = "Question n°" + (answers.length + 1).toString();

            const consigneLabel = document.createElement("label");
            consigneLabel.textContent = question.eval.consigne;

            const reponseInput = document.createElement("input");
            reponseInput.type = "text";
            reponseInput.placeholder = "Écrivez votre réponse ici";
            reponseInput.addEventListener("input", () => {
                answer.reponse = reponseInput.value;
            });

            divPreview.append(titrePreview, consigneLabel, reponseInput);
            questionElement.appendChild(divPreview);
            answers.append(answer);
        } else if (question.type == "conjugaison") {
            let answer = {
                id: question.id,
                reponse: [[]],
            };

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
                        });
                        td.appendChild(input);
                        tr.appendChild(td);
                    }

                    tbody.appendChild(tr);
                }

                table.appendChild(tbody);
            }
            body();

            divPreview.appendChild(table);
        }
    });

    questionsDiv.append(questionElement);
}
