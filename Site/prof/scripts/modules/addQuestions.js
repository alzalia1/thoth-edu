import { Palert, Perror } from "../../../shared/scripts/modules/utils.js";

// TODO - Preview
// TODO - Saving
// TODO - Stats and renaming at deletion
// TODO - Loading/reloading

// ANCHOR - Global variables
let questions = [];
const questionsMainDiv = document.getElementById("questionsList");
const evalNameInput = document.getElementById("evalName");
evalNameInput.addEventListener("input", () => {
    updateManager("paramsEdit");
});

// SECTION - Adding a question
export function addQuestion(type, q = null) {
    // ANCHOR - Creating the question var
    switch (type) {
        case "traduction":
            q = {
                type: "traduction",
                instruction: "",
                answer: "",
                params: {
                    points: 1.0,
                    accent: false,
                    plural: [],
                    genre: [],
                    determiner: [],
                },
            };
            break;
        case "conjugaison":
            q = {
                type: "conjugaison",
                instruction: "",
                answer: {
                    tenses: [],
                    pronouns: [],
                    verbs: [[]],
                },
                params: {
                    points: 1.0,
                    accent: false,
                },
            };
            break;
    }

    // ANCHOR - Index of the question
    const index = questions.length + 1;

    // ANCHOR - Creating the base div
    const mainDiv = document.createElement("div");
    mainDiv.id = index.toString(); // NOTE - Change this id at deletion !

    // ANCHOR - Creating the three section divs
    const questDiv = document.createElement("div");
    const paramsDiv = document.createElement("div");

    // SECTION - Creating the question div
    function questionDiv() {
        // ANCHOR - Base division
        questDiv.classList.add("quest");

        // ANCHOR - Title
        const questMainTitle = document.createElement("h2");
        questMainTitle.innerHTML = `Question n°<span class="questNb">${index.toString()}</span> (/<span class="questPts">${q.params.points.toString()}</span>)`;

        // ANCHOR - Instruction
        const questInstructionDiv = document.createElement("div");
        const questInstructionLabel = document.createElement("label");
        switch (type) {
            case "traduction":
                questInstructionLabel.textContent = "Consigne : ";

                const questInstructionInputTrad = document.createElement("textarea");
                questInstructionInputTrad.placeholder = "Écrivez ici la consigne de la question";
                questInstructionInputTrad.classList.add("questIns");
                questInstructionInputTrad.addEventListener("input", () => {
                    q.instruction = questInstructionInputTrad.value;
                    updateManager("questInput", mainDiv, q);
                });
                questInstructionDiv.append(questInstructionLabel, questInstructionInputTrad);
                break;
            case "conjugaison":
                questInstructionLabel.textContent = "Verbe à conjuguer : ";

                const questInstructionInputConjug = document.createElement("input");
                questInstructionInputConjug.placeholder = "Écrivez ici le verbe à conjuguer";
                questInstructionInputConjug.type = "text";
                questInstructionInputConjug.classList.add("questIns");
                questInstructionInputConjug.addEventListener("input", () => {
                    q.instruction = questInstructionInputConjug.value;
                    updateManager("questInput", mainDiv, q);
                });
                questInstructionDiv.append(questInstructionLabel, questInstructionInputConjug);
                break;
        }

        // SECTION - Answer
        const questAnswerDiv = document.createElement("div");
        switch (type) {
            case "traduction": // ANCHOR - Traduction
                const questAnswerInputTrad = document.createElement("input");
                questAnswerInputTrad.placeholder = "Entrez la réponse ici";
                questAnswerInputTrad.classList.add("questAns");
                questAnswerInputTrad.addEventListener("input", () => {
                    q.answer = questAnswerInputTrad.value;
                    updateManager("questInput", mainDiv, q);
                });

                questAnswerDiv.append(questAnswerInputTrad);
                break;
            case "conjugaison": // ANCHOR - C main table
                const questAnswerTableConjug = document.createElement("table");
                questAnswerTableConjug.classList.add("questAns");

                // ANCHOR - C first row
                const questAnswerFirstRowConjug = questAnswerTableConjug.insertRow();

                questAnswerFirstRowConjug.insertCell(); // Empty corner cell

                const questFirstTenseCellConjug = questAnswerFirstRowConjug.insertCell();
                const questFirstTenseInputConjug = document.createElement("input");
                questFirstTenseInputConjug.placeholder = "Temps";
                q.answer.tenses.push("");
                questFirstTenseInputConjug.addEventListener("input", () => {
                    q.answer.tenses[0] = questFirstTenseInputConjug.value;
                    updateManager("questInput", mainDiv, q);
                });
                questFirstTenseCellConjug.appendChild(questFirstTenseInputConjug);

                // ANCHOR - C line buttons
                const questLineButtonCellConjug = questAnswerFirstRowConjug.insertCell();
                const questLineButtonSpanConjug = document.createElement("span");
                questLineButtonSpanConjug.classList.add("linBut");

                const questLineDeleteButtonConjug = document.createElement("button");
                questLineDeleteButtonConjug.textContent = "-";
                questLineDeleteButtonConjug.disabled = true;
                questLineDeleteButtonConjug.addEventListener("click", () => {
                    for (let i = 0; i < questAnswerTableConjug.rows.length - 1; i++) {
                        const row = questAnswerTableConjug.rows[i];

                        // if (row.cells.length <= 2) {
                        //     // Exit in case it is the last column
                        //     return;
                        // }

                        if (i == 0) {
                            row.deleteCell(row.cells.length - 2);

                            if (row.cells.length <= 3) {
                                // Disabled if it was the before last column
                                questLineDeleteButtonConjug.disabled = true;
                            }

                            q.answer.tenses.pop();
                        } else {
                            row.deleteCell(row.cells.length - 1);
                            q.answer.verbs[i - 1].pop();
                        }
                    }
                    updateManager("questInput", mainDiv, q);
                });

                const questLineAddButtonConjug = document.createElement("button");
                questLineAddButtonConjug.textContent = "+";
                questLineAddButtonConjug.addEventListener("click", () => {
                    for (let i = 0; i < questAnswerTableConjug.rows.length - 1; i++) {
                        const row = questAnswerTableConjug.rows[i];

                        if (i == 0) {
                            const newCell = row.insertCell(row.cells.length - 1);
                            const newCellInput = document.createElement("input");

                            q.answer.tenses.push("");
                            let elementIndex = q.answer.tenses.length - 1;

                            newCellInput.placeholder = "Temps";
                            newCellInput.addEventListener("input", () => {
                                q.answer.tenses[elementIndex] = newCellInput.value;
                                updateManager("questInput", mainDiv, q);
                            });

                            if (row.cells.length >= 4) {
                                questLineDeleteButtonConjug.disabled = false;
                            }

                            newCell.append(newCellInput);
                        } else {
                            const newCell = row.insertCell();
                            const newCellInput = document.createElement("input");

                            q.answer.verbs[i - 1].push("");
                            let elementIndex = q.answer.verbs[i - 1].length - 1;

                            newCellInput.placeholder = "Verbe conjugué";
                            newCellInput.addEventListener("input", () => {
                                q.answer.verbs[i - 1][elementIndex] = newCellInput.value;
                                updateManager("questInput", mainDiv, q);
                            });

                            newCell.append(newCellInput);
                        }
                    }
                    updateManager("questInput", mainDiv, q);
                });

                questLineButtonSpanConjug.append(
                    questLineAddButtonConjug,
                    questLineDeleteButtonConjug
                );
                questLineButtonCellConjug.append(questLineButtonSpanConjug);

                // ANCHOR - Second row

                const questAnswerSecondRowConjug = questAnswerTableConjug.insertRow();

                const questFirstPronounCellConjug = questAnswerSecondRowConjug.insertCell();
                q.answer.pronouns.push("");
                const questFirstPronounInputConjug = document.createElement("input");
                questFirstPronounInputConjug.placeholder = "Pronom";
                questFirstPronounInputConjug.addEventListener("input", () => {
                    q.answer.pronouns[0] = questFirstPronounInputConjug.value;
                    updateManager("questInput", mainDiv, q);
                });
                questFirstPronounCellConjug.appendChild(questFirstPronounInputConjug);

                const questFirstVerbCellConjug = questAnswerSecondRowConjug.insertCell();
                q.answer.verbs[0].push("");
                const questFirstVerbInputConjug = document.createElement("input");
                questFirstVerbInputConjug.placeholder = "Verbe conjugué";
                questFirstVerbInputConjug.addEventListener("input", () => {
                    q.answer.verbs[0][0] = questFirstVerbInputConjug.value;
                    updateManager("questInput", mainDiv, q);
                });
                questFirstVerbCellConjug.appendChild(questFirstVerbInputConjug);

                // ANCHOR - Third row (buttons)

                const questAnswerThirdRowConjug = questAnswerTableConjug.insertRow();

                const questColumnButtonCellConjug = questAnswerThirdRowConjug.insertCell();
                const questColumnButtonSpanConjug = document.createElement("span");
                questColumnButtonSpanConjug.classList.add("colBut");

                const questColumnDeleteButtonConjug = document.createElement("button");
                questColumnDeleteButtonConjug.textContent = "-";
                questColumnDeleteButtonConjug.disabled = true;
                questColumnDeleteButtonConjug.addEventListener("click", () => {
                    if (questAnswerTableConjug.rows.length <= 3) {
                        // Exit in cas that was the before last row
                        return;
                    }

                    questAnswerTableConjug.deleteRow(questAnswerTableConjug.rows.length - 2);

                    if (questAnswerTableConjug.rows.length <= 3) {
                        questColumnDeleteButtonConjug.disabled = true;
                    }

                    q.answer.pronouns.pop();
                    q.answer.verbs.pop();

                    updateManager("questInput", mainDiv, q);
                });

                const questColumnAddButtonConjug = document.createElement("button");
                questColumnAddButtonConjug.textContent = "+";
                questColumnAddButtonConjug.addEventListener("click", () => {
                    const newRow = questAnswerTableConjug.insertRow(
                        questAnswerTableConjug.rows.length - 1
                    );
                    q.answer.verbs.push([]);

                    for (let i = 0; i < q.answer.tenses.length + 1; i++) {
                        const newCell = newRow.insertCell();

                        if (i == 0) {
                            const newInput = document.createElement("input");

                            newInput.placeholder = "Pronom";
                            q.answer.pronouns.push("");
                            newInput.addEventListener("input", () => {
                                q.answer.pronouns[newRow.rowIndex - 1] = newInput.value;
                                updateManager("questInput", mainDiv, q);
                            });

                            newCell.append(newInput);

                            if (newRow.rowIndex >= 2) {
                                questColumnDeleteButtonConjug.disabled = false;
                            }
                        } else {
                            const newInput = document.createElement("input");

                            newInput.placeholder = "Verbe conjugué";
                            q.answer.verbs[newRow.rowIndex - 1].push("");
                            newInput.addEventListener("input", () => {
                                q.answer.verbs[newRow.rowIndex - 1][newCell.cellIndex - 1] =
                                    newInput.value;
                                updateManager("questInput", mainDiv, q);
                            });

                            newCell.append(newInput);
                        }
                    }
                    updateManager("questInput", mainDiv, q);
                });

                questColumnButtonSpanConjug.append(
                    questColumnAddButtonConjug,
                    questColumnDeleteButtonConjug
                );
                questColumnButtonCellConjug.append(questColumnButtonSpanConjug);

                questAnswerDiv.append(questAnswerTableConjug);
                break;

            // NOTE - Il faut mtn faire la première cellule, puis la troisième ligne avec les boutons
        } // ùSECTION

        // ANCHOR - Lower buttons

        const questLowerButtonsDiv = document.createElement("div");

        const questParamsButton = document.createElement("button");
        questParamsButton.textContent = "⚙ Paramètres";
        questParamsButton.addEventListener("click", () => {
            const paramsDiv = mainDiv.querySelector(".params");
            paramsDiv.style.display = "block";
        });

        const questDeleteButton = document.createElement("button");
        questDeleteButton.textContent = "🗑 Supprimer";
        questDeleteButton.addEventListener("click", () => {
            const delIndex = questions.indexOf(q);
            if (delIndex !== -1) {
                questions.splice(delIndex, 1);
            } else {
                Perror("Question non trouvée");
            }
            mainDiv.remove();
            updateManager("deletion");
        });

        questLowerButtonsDiv.append(questParamsButton, questDeleteButton);

        questDiv.append(questMainTitle, questInstructionDiv, questAnswerDiv, questLowerButtonsDiv);
    }
    questionDiv(); // ùSECTION

    // SECTION - Creating the parameters div
    function parametersDiv() {
        // ANCHOR - Main divs
        paramsDiv.classList.add("params", "popup");

        const paramsInsideDiv = document.createElement("div");
        paramsInsideDiv.classList.add("interieur-popup");

        // ANCHOR - Points
        const paramsPointsDiv = document.createElement("div");
        const paramsPointsLabel = document.createElement("label");
        paramsPointsLabel.textContent = "Points : ";
        const paramsPointsErrorLabel = document.createElement("label");
        paramsPointsErrorLabel.textContent = "Attention, cette question ne sera pas notée !";
        paramsPointsErrorLabel.hidden = true;
        const paramsPointsInput = document.createElement("input");
        paramsPointsInput.type = "number";
        paramsPointsInput.value = q.params.points;
        paramsPointsInput.min = 0;
        paramsPointsInput.addEventListener("input", () => {
            if (paramsPointsInput.value == 0) {
                paramsPointsErrorLabel.hidden = false;
            } else {
                paramsPointsErrorLabel.hidden = true;
            }
            q.params.points = parseFloat(paramsPointsInput.value);

            updateManager("pointsChange");
        });
        paramsPointsDiv.append(
            paramsPointsLabel,
            paramsPointsInput,
            document.createElement("br"),
            paramsPointsErrorLabel
        );

        // ANCHOR - Accent
        const paramsAccentDiv = document.createElement("div");
        const paramsAccentLabel = document.createElement("label");
        paramsAccentLabel.textContent = "Accents : ";
        const paramsAccentInput = document.createElement("input");
        paramsAccentInput.type = "checkbox";
        paramsAccentInput.addEventListener("input", () => {
            q.params.accent = paramsAccentInput.checked;
            updateManager("paramsEdit");
        }); // NOTE - Make the code here
        paramsAccentDiv.append(paramsAccentLabel, paramsAccentInput);

        // SECTION -  Additional question-specific parameter
        const paramsAdditionalParamsDiv = document.createElement("div");
        switch (type) {
            case "conjugaison":
                break;
            case "traduction":
                // SECTION - Traduction
                // ANCHOR - Plural
                const paramsPluralDiv = document.createElement("div");
                const paramsPluralSubDiv = document.createElement("div");
                const paramsPluralLabel = document.createElement("label");
                const paramsPluralInputCheckbox = document.createElement("input");
                const paramsPluralInputList = document.createElement("input");
                const paramsPluralAcceptedSpan = document.createElement("span");

                paramsPluralLabel.textContent = "Pluriel : ";

                paramsPluralInputCheckbox.type = "checkbox";
                paramsPluralInputCheckbox.addEventListener("input", () => {
                    if (paramsPluralInputCheckbox.checked) {
                        paramsPluralSubDiv.hidden = false;
                        let tags = paramsPluralAcceptedSpan.querySelectorAll(".tag");

                        tags.forEach((tag) => {
                            q.params.plural.push(tag.textContent);
                        });
                        updateManager("paramsEdit");
                    } else {
                        paramsPluralSubDiv.hidden = true;
                        q.params.plural = [];
                        updateManager("paramsEdit");
                    }
                });

                paramsPluralSubDiv.hidden = !paramsPluralInputCheckbox.checked;

                paramsPluralInputList.placeholder = "Pluriels autorisés";
                paramsPluralInputList.type = "text";
                paramsPluralInputList.addEventListener("keyup", function (e) {
                    if (e.key === " " || e.key === "Enter") {
                        const tagElement = document.createElement("span");
                        tagElement.classList.add("tag");

                        const tag = this.value.trim();
                        q.params.plural.push(tag);

                        tagElement.textContent = tag;

                        const deleteButton = document.createElement("button");
                        deleteButton.textContent = "x";
                        deleteButton.classList.add("tagDelete");
                        deleteButton.addEventListener("click", function () {
                            tagElement.remove();
                            q.params.plural.splice(
                                q.params.plural.findIndex((p) => p === tag),
                                1
                            );
                            updateManager("paramsEdit");
                        });

                        tagElement.appendChild(deleteButton);
                        paramsPluralAcceptedSpan.append(tagElement);

                        this.value = "";
                        updateManager("paramsEdit");
                    }
                });

                paramsPluralSubDiv.append(paramsPluralAcceptedSpan, paramsPluralInputList);
                paramsPluralDiv.append(
                    paramsPluralLabel,
                    paramsPluralInputCheckbox,
                    paramsPluralSubDiv
                );

                // ANCHOR - Determiner
                const paramsDeterminerDiv = document.createElement("div");
                const paramsDeterminerSubDiv = document.createElement("div");
                const paramsDeterminerLabel = document.createElement("label");
                const paramsDeterminerInputCheckbox = document.createElement("input");
                const paramsDeterminerInputList = document.createElement("input");
                const paramsDeterminerAcceptedSpan = document.createElement("span");

                paramsDeterminerLabel.textContent = "Déterminants : ";

                paramsDeterminerInputCheckbox.type = "checkbox";
                paramsDeterminerInputCheckbox.addEventListener("input", () => {
                    if (paramsDeterminerInputCheckbox.checked) {
                        paramsDeterminerSubDiv.hidden = false;
                        let tags = paramsDeterminerAcceptedSpan.querySelectorAll(".tag");

                        tags.forEach((tag) => {
                            q.params.determiner.push(tag.textContent);
                        });
                        updateManager("paramsEdit");
                    } else {
                        paramsDeterminerSubDiv.hidden = true;
                        q.params.determiner = [];
                        updateManager("paramsEdit");
                    }
                });

                paramsDeterminerSubDiv.hidden = !paramsDeterminerInputCheckbox.checked;

                paramsDeterminerInputList.placeholder = "Pluriels autorisés";
                paramsDeterminerInputList.type = "text";
                paramsDeterminerInputList.addEventListener("keyup", function (e) {
                    if (e.key === " " || e.key === "Enter") {
                        const tagElement = document.createElement("span");
                        tagElement.classList.add("tag");

                        const tag = this.value.trim();
                        q.params.determiner.push(tag);

                        tagElement.textContent = tag;

                        const deleteButton = document.createElement("button");
                        deleteButton.textContent = "x";
                        deleteButton.classList.add("tagDelete");
                        deleteButton.addEventListener("click", function () {
                            tagElement.remove();
                            q.params.determiner.splice(
                                q.params.determiner.findIndex((p) => p === tag),
                                1
                            );
                            updateManager("paramsEdit");
                        });

                        tagElement.appendChild(deleteButton);
                        paramsDeterminerAcceptedSpan.append(tagElement);

                        this.value = "";
                        updateManager("paramsEdit");
                    }
                });
                // NOTE - Make so that is displays a warning message if plural/genre
                paramsDeterminerSubDiv.append(
                    paramsDeterminerAcceptedSpan,
                    paramsDeterminerInputList
                );
                paramsDeterminerDiv.append(
                    paramsDeterminerLabel,
                    paramsDeterminerInputCheckbox,
                    paramsDeterminerSubDiv
                );

                // ANCHOR - Genre
                const paramsGenreDiv = document.createElement("div");
                const paramsGenreSubDiv = document.createElement("div");
                const paramsGenreLabel = document.createElement("label");
                const paramsGenreInputCheckbox = document.createElement("input");
                const paramsGenreInputList = document.createElement("input");
                const paramsGenreAcceptedSpan = document.createElement("span");

                paramsGenreLabel.textContent = "Genre : ";

                paramsGenreInputCheckbox.type = "checkbox";
                paramsGenreInputCheckbox.addEventListener("input", () => {
                    if (paramsGenreInputCheckbox.checked) {
                        paramsGenreSubDiv.hidden = false;
                        let tags = paramsGenreAcceptedSpan.querySelectorAll(".tag");

                        tags.forEach((tag) => {
                            q.params.genre.push(tag.textContent);
                        });
                        updateManager("paramsEdit");
                    } else {
                        paramsGenreSubDiv.hidden = true;
                        q.params.genre = [];
                        updateManager("paramsEdit");
                    }
                });

                paramsGenreSubDiv.hidden = !paramsGenreInputCheckbox.checked;

                paramsGenreInputList.placeholder = "Pluriels autorisés";
                paramsGenreInputList.type = "text";
                paramsGenreInputList.addEventListener("keyup", function (e) {
                    if (e.key === " " || e.key === "Enter") {
                        const tagElement = document.createElement("span");
                        tagElement.classList.add("tag");

                        const tag = this.value.trim();
                        q.params.genre.push(tag);

                        tagElement.textContent = tag;

                        const deleteButton = document.createElement("button");
                        deleteButton.textContent = "x";
                        deleteButton.classList.add("tagDelete");
                        deleteButton.addEventListener("click", function () {
                            tagElement.remove();
                            q.params.genre.splice(
                                q.params.genre.findIndex((p) => p === tag),
                                1
                            );
                            updateManager("paramsEdit");
                        });

                        tagElement.appendChild(deleteButton);
                        paramsGenreAcceptedSpan.append(tagElement);

                        this.value = "";
                        updateManager("paramsEdit");
                    }
                });

                paramsGenreSubDiv.append(paramsGenreAcceptedSpan, paramsGenreInputList);
                paramsGenreDiv.append(
                    paramsGenreLabel,
                    paramsGenreInputCheckbox,
                    paramsGenreSubDiv
                );

                paramsAdditionalParamsDiv.append(
                    paramsPluralDiv,
                    paramsDeterminerDiv,
                    paramsGenreDiv
                );
                break; // ùSECTION
        } // ùSECTION

        paramsInsideDiv.append(paramsPointsDiv, paramsAccentDiv, paramsAdditionalParamsDiv);
        paramsDiv.append(paramsInsideDiv);

        // Way to remove the popup

        window.addEventListener("click", function (event) {
            if (event.target == paramsDiv) {
                paramsDiv.style.display = "none";
            }
        });
    }
    parametersDiv(); // ùSECTION

    // NOTE - Preview

    // ANCHOR - Assembling everything together
    mainDiv.append(questDiv, paramsDiv);

    questions.push(q);
    questionsMainDiv.append(mainDiv);

    updateManager("main");
}
// ùSECTION

// SECTION - Utility functions

// ANCHOR - Main update manager
function updateManager(updateType, mainDiv, q) {
    switch (updateType) {
        case "questInput":
            updatePending();
            updatePreview(mainDiv, q);
            break;
        case "main":
            updatePending();
            break;
        case "paramsEdit":
        case "deletion":
            updatePending();
            break;
        case "pointsChange":
            updatePending();
            break;
    }
}

// ANCHOR - Update pending
function updatePending() {
    let evalForm = {
        name: evalNameInput.value,
        questions: questions,
    };
    localStorage.setItem("evalPending", JSON.stringify(evalForm));
}
//

// ANCHOR - Update a preview
function updatePreview(mainDiv, q) {
    // NOTE - Make the function
    const prevDiv = mainDiv.querySelector(".prev");
    switch (q.type) {
        case "traduction":
            break;
        case "conjugaison":
            break;
    }
}
