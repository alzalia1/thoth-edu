import { Palert, Perror } from "/shared/scripts/modules/utils.js";

// ANCHOR - Global variables
let questions = [];
const questionsMainDiv = document.getElementById("questionsList");
const evalNameInput = document.getElementById("evalName");
evalNameInput.addEventListener("input", () => {
    updateManager("paramsEdit");
});
const pointsTotalStat = document.getElementById("nbPoints");
const questionsNumberStat = document.getElementById("nbQuestions");

// SECTION - Adding a question
export function addQuestion(type, q = null) {
    // ANCHOR - Creating the question var
    if (q === null) {
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
                        tenses: [""],
                        pronouns: [""],
                        verbs: [[""]],
                    },
                    params: {
                        points: 1.0,
                        accent: false,
                    },
                };
                break;
        }
    }

    // ANCHOR - Index of the question
    const index = questions.length + 1;

    // ANCHOR - Creating the base div
    const mainDiv = document.createElement("div");
    mainDiv.classList.add("mainDiv");
    mainDiv.id = index.toString();

    // ANCHOR - Creating the three section divs
    const questDiv = document.createElement("div");
    const paramsDiv = document.createElement("div");
    const prevDiv = document.createElement("div");

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
                questInstructionInputTrad.value = q.instruction;
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
                questInstructionInputConjug.value = q.instruction;
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
                questAnswerInputTrad.value = q.answer;
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

                for (let j = 0; j < q.answer.tenses.length; j++) {
                    const tense = q.answer.tenses[j];
                    const questTenseCellConjug = questAnswerFirstRowConjug.insertCell();
                    const questTenseInputConjug = document.createElement("input");
                    questTenseInputConjug.value = tense;
                    questTenseInputConjug.placeholder = "Temps";
                    questTenseInputConjug.addEventListener("input", () => {
                        q.answer.tenses[j] = questTenseInputConjug.value;
                        updateManager("questInput", mainDiv, q);
                    });
                    questTenseCellConjug.appendChild(questTenseInputConjug);
                }

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

                // ANCHOR - Second(s)

                for (let i = 0; i < q.answer.pronouns.length; i++) {
                    const pronoun = q.answer.pronouns[i];

                    const questAnswerRowConjug = questAnswerTableConjug.insertRow();

                    const questPronounCellConjug = questAnswerRowConjug.insertCell();
                    if (pronoun === null) {
                        q.answer.pronouns.push("");
                        pronoun = "";
                    }
                    const questPronounInputConjug = document.createElement("input");
                    questPronounInputConjug.value = pronoun;
                    questPronounInputConjug.placeholder = "Pronom";
                    questPronounInputConjug.addEventListener("input", () => {
                        q.answer.pronouns[i] = questPronounInputConjug.value;
                        updateManager("questInput", mainDiv, q);
                    });
                    questPronounCellConjug.appendChild(questPronounInputConjug);

                    for (let j = 0; j < q.answer.tenses.length; j++) {
                        const verb = q.answer.verbs[i][j];

                        const questVerbCellConjug = questAnswerRowConjug.insertCell();
                        if (verb === null) {
                            q.answer.verbs[i].push("");
                            verb = "";
                        }
                        const questVerbInputConjug = document.createElement("input");
                        questVerbInputConjug.value = verb;
                        questVerbInputConjug.placeholder = "Verbe conjugué";
                        questVerbInputConjug.addEventListener("input", () => {
                            q.answer.verbs[0][0] = questVerbInputConjug.value;
                            updateManager("questInput", mainDiv, q);
                        });
                        questVerbCellConjug.appendChild(questVerbInputConjug);
                    }
                }

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
            updateManager("deletion", mainDiv, q);
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

            updateManager("pointsChange", mainDiv, q);
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
        paramsAccentInput.checked = q.params.accent;
        paramsAccentInput.type = "checkbox";
        paramsAccentInput.addEventListener("input", () => {
            q.params.accent = paramsAccentInput.checked;
            updateManager("paramsEdit", mainDiv, q);
        });
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
                paramsPluralInputCheckbox.checked = q.params.plural.length > 0 ? true : false;
                paramsPluralInputCheckbox.addEventListener("input", () => {
                    if (paramsPluralInputCheckbox.checked) {
                        paramsPluralSubDiv.hidden = false;
                        let tags = paramsPluralAcceptedSpan.querySelectorAll(".tag");

                        tags.forEach((tag) => {
                            q.params.plural.push(tag.textContent);
                        });
                        updateManager("paramsEdit", mainDiv, q);
                    } else {
                        paramsPluralSubDiv.hidden = true;
                        q.params.plural = [];
                        updateManager("paramsEdit", mainDiv, q);
                    }
                });

                paramsPluralSubDiv.hidden = !paramsPluralInputCheckbox.checked;

                paramsPluralInputList.placeholder = "Pluriels autorisés";
                paramsPluralInputList.type = "text";
                paramsPluralInputList.addEventListener("keyup", function (e) {
                    if (e.key === " " || e.key === "Enter") {
                        const tagElement = document.createElement("span");
                        tagElement.classList.add("tag");

                        const tag = paramsPluralInputList.value.trim();
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
                            updateManager("paramsEdit", mainDiv, q);
                        });

                        tagElement.appendChild(deleteButton);
                        paramsPluralAcceptedSpan.append(tagElement);

                        paramsPluralInputList.value = "";
                        updateManager("paramsEdit", mainDiv, q);
                    }
                });

                q.params.plural.forEach((tag) => {
                    const tagElement = document.createElement("span");
                    tagElement.classList.add("tag");
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
                        updateManager("paramsEdit", mainDiv, q);
                    });

                    tagElement.appendChild(deleteButton);
                    paramsPluralAcceptedSpan.append(tagElement);
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
                paramsDeterminerInputCheckbox.checked =
                    q.params.determiner.length > 0 ? true : false;
                paramsDeterminerInputCheckbox.addEventListener("input", () => {
                    if (paramsDeterminerInputCheckbox.checked) {
                        paramsDeterminerSubDiv.hidden = false;
                        let tags = paramsDeterminerAcceptedSpan.querySelectorAll(".tag");

                        tags.forEach((tag) => {
                            q.params.determiner.push(tag.textContent);
                        });
                        updateManager("paramsEdit", mainDiv, q);
                    } else {
                        paramsDeterminerSubDiv.hidden = true;
                        q.params.determiner = [];
                        updateManager("paramsEdit", mainDiv, q);
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
                            updateManager("paramsEdit", mainDiv, q);
                        });

                        tagElement.appendChild(deleteButton);
                        paramsDeterminerAcceptedSpan.append(tagElement);

                        this.value = "";
                        updateManager("paramsEdit", mainDiv, q);
                    }
                });

                q.params.determiner.forEach((tag) => {
                    const tagElement = document.createElement("span");
                    tagElement.classList.add("tag");
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
                        updateManager("paramsEdit", mainDiv, q);
                    });

                    tagElement.appendChild(deleteButton);
                    paramsDeterminerAcceptedSpan.append(tagElement);
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
                paramsGenreInputCheckbox.checked = q.params.genre.length > 0 ? true : false;
                paramsGenreInputCheckbox.addEventListener("input", () => {
                    if (paramsGenreInputCheckbox.checked) {
                        paramsGenreSubDiv.hidden = false;
                        let tags = paramsGenreAcceptedSpan.querySelectorAll(".tag");

                        tags.forEach((tag) => {
                            q.params.genre.push(tag.textContent);
                        });
                        updateManager("paramsEdit", mainDiv, q);
                    } else {
                        paramsGenreSubDiv.hidden = true;
                        q.params.genre = [];
                        updateManager("paramsEdit", mainDiv, q);
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
                            updateManager("paramsEdit", mainDiv, q);
                        });

                        tagElement.appendChild(deleteButton);
                        paramsGenreAcceptedSpan.append(tagElement);

                        this.value = "";
                        updateManager("paramsEdit", mainDiv, q);
                    }
                });

                q.params.genre.forEach((tag) => {
                    const tagElement = document.createElement("span");
                    tagElement.classList.add("tag");
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
                        updateManager("paramsEdit", mainDiv, q);
                    });

                    tagElement.appendChild(deleteButton);
                    paramsGenreAcceptedSpan.append(tagElement);
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

    // SECTION - Creating the preview div
    function previewDiv() {
        prevDiv.classList.add("prev");
    } // ùSECTION
    previewDiv();

    // ANCHOR - Assembling everything together
    mainDiv.append(questDiv, paramsDiv, prevDiv);

    questions.push(q);
    questionsMainDiv.append(mainDiv);

    updateManager("main", mainDiv, q);
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
            updateQuestionPoints(q);
            updateQuestionsNumber();
            updateStats();
            break;
        case "deletion":
            updatePending();
            updateQuestionsNumber();
            updateStats();
            break;
        case "pointsChange":
            updateQuestionPoints(q);
            updateStats();
            updatePending();
            break;
        case "paramsEdit":
            updatePending();
            break;
        case "previewCreation":
            updatePreview(mainDiv, q);
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

// ANCHOR - Update global stats
function updateStats() {
    questionsNumberStat.textContent = questions.length.toString();
    pointsTotalStat.textContent = questions.reduce((acc, q) => acc + q.params.points, 0).toString();
}

// ANCHOR - Update questions numbers
function updateQuestionsNumber() {
    const questionsDivs = questionsMainDiv.querySelectorAll(".mainDiv");
    for (let i = 0; i < questionsDivs.length; i++) {
        const currentQuestDiv = questionsDivs[i];

        currentQuestDiv.id = (i + 1).toString();
        const numberSpan = currentQuestDiv.querySelector(".questNb");
        numberSpan.textContent = (i + 1).toString();
    }
}

// ANCHOR - Update a question points
function updateQuestionPoints(q) {
    let index = questions.indexOf(q) + 1;
    const questDiv = document.getElementById(index.toString());
    const pointsSpan = questDiv.querySelector(".questPts");
    pointsSpan.textContent = q.params.points.toString();
}

// SECTION - Update a preview
function updatePreview(mainDiv, q) {
    const prevDiv = mainDiv.querySelector(".prev");
    prevDiv.innerHTML = "";
    switch (q.type) {
        case "traduction":
            const prevInstructionTrad = document.createElement("p");
            prevInstructionTrad.textContent = q.instruction;

            const prevAnswerInputTrad = document.createElement("input");
            prevAnswerInputTrad.type = "text";
            prevAnswerInputTrad.placeholder = "Indiquez votre réponse ici";

            prevDiv.append(prevInstructionTrad, prevAnswerInputTrad);
            break;
        case "conjugaison":
            const prevInstructionConjug = document.createElement("p");
            prevInstructionConjug.textContent = `Conjuguez le verbe '${q.instruction}' aux temps et personnes suivants :`;

            const prevAnswerTableConjug = document.createElement("table");
            prevAnswerTableConjug.classList.add("questAns");

            // ANCHOR - Tenses row
            const prevAnswerFirstRowConjug = prevAnswerTableConjug.insertRow();

            prevAnswerFirstRowConjug.insertCell(); // Empty corner cell

            q.answer.tenses.forEach((tense) => {
                const prevTenseCellConjug = prevAnswerFirstRowConjug.insertCell();
                prevTenseCellConjug.textContent = tense;
            });

            // ANCHOR - Other rows

            for (let i = 0; i < q.answer.pronouns.length; i++) {
                const pronoun = q.answer.pronouns[i];

                const prevPronounRowConjug = prevAnswerTableConjug.insertRow();
                const prevPronounCellConjug = prevPronounRowConjug.insertCell();
                prevPronounCellConjug.textContent = pronoun;

                for (let j = 0; j < q.answer.tenses.length; j++) {
                    const prevVerbCellConjug = prevPronounRowConjug.insertCell();
                    const prevVerbInputConjug = document.createElement("input");
                    prevVerbInputConjug.type = "text";
                    prevVerbInputConjug.placeholder = "Verbe conjugué";
                    prevVerbCellConjug.append(prevVerbInputConjug);
                }
            }

            prevDiv.append(prevInstructionConjug, prevAnswerTableConjug);

            break;
    }
} // ùSECTION

// ANCHOR Loading function

export function loadFromPending() {
    let evalPending = JSON.parse(localStorage.getItem("evalPending"));
    evalNameInput.value = evalPending.name;
    evalPending.questions.forEach((q) => {
        addQuestion(q.type, q);
    });
}

export function loadFromID(code) {
    fetch("https://api.thoth-edu.fr/crea/get", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: code }),
    })
        .then((response) => response.json())
        .then((data) => {
            evalNameInput.value = data.eval.name;
            data.eval.questions.forEach((q) => {
                addQuestion(q.type, q);
            });
        })
        .catch((error) => Perror("Error on crea/get : " + error));
}
