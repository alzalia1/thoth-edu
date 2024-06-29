/**
 * ! WARNING : THIS CODE IS A DANGER TO YOUR SANITY. PROCEDE WITH CAUTION.
 */

// TODO : Make the code cleaner...
// FIXME : C'EST LA MERDE UN PEU

// SECTION - Initialize global variables

export let questions = [];

const statPoints = document.getElementById("nbPoints");
const statQuestions = document.getElementById("nbQuestions");
const questionsDiv = document.getElementById("questionsList");
const evalName = document.getElementById("nom_eval");
// ùSECTION

// SECTION - Main question adding logic
// SECTION - Add question
/**
 * Créée la question
 * @param {string} type - Type de question (traduction/conjugaison)
 * @param {object} question - Contenu de la question, rien si c'est une nouvelle
 */
export function addQuestion(type, question = null) {
    const questionElement = document.createElement("div");
    questionElement.className = "question";
    const create = question == null;

    // ANCHOR - New fresh question object
    if (question == null) {
        switch (type) {
            case "traduction":
                question = {
                    elements: {
                        div: questionElement,
                        title: "",
                        preview: "",
                        popup: "",
                        plural: false,
                        genre: false,
                        determiners: false,
                    },
                    eval: {
                        type: "traduction",
                        instruction: "",
                        answer: "",
                        params: {
                            points: 0,
                            determiners: [],
                            plural: [],
                            genre: [],
                            sousInstruction: false,
                            accent: false,
                        },
                    },
                };
                break;

            case "conjugaison":
                question = {
                    elements: {
                        div: questionElement,
                        title: "",
                        preview: "",
                        divPreview: "",
                        popup: "",
                        tenses: [],
                        pronouns: [],
                    },
                    eval: {
                        type: "conjugaison",
                        instruction: "",
                        answer: {
                            tenses: [],
                            pronouns: [],
                            verbs: [[]],
                        },
                        params: {
                            points: 0,
                            sousInstruction: false,
                            accent: false,
                        },
                    },
                };
                break;
        }
    } else {
        switch (type) {
            case "traduction":
                question.elements = {
                    div: questionElement,
                    title: "",
                    preview: "",
                    popup: "",
                    plural: false,
                    genre: false,
                    determiners: false,
                };
                break;

            case "conjugaison":
                question.elements = {
                    div: questionElement,
                    title: "",
                    preview: "",
                    divPreview: "",
                    popup: "",
                    tenses: [],
                    pronouns: [],
                };
                break;
        }
    }

    // ANCHOR - Common header system
    function entete() {
        const questionNumber = document.createElement("h3");
        questionNumber.textContent = "Question n°" + (questions.length + 1);

        questionElement.appendChild(questionNumber);
        question.elements.title = questionNumber;
    }
    entete();

    // ANCHOR - Q Creating div
    function divA() {
        const divA = document.createElement("div");

        // Instruction input
        instruction(divA, question, type);

        divA.append(document.createElement("br"));

        answer(divA, question, type, create);

        divA.append(document.createElement("br"));

        params(divA, questionElement, question);

        questionElement.appendChild(divA);
    }
    divA();

    // ANCHOR - Preview div
    function divPreview() {
        let instruction = "";
        if (type == "traduction") {
            instruction = question.eval.instruction;
        } else {
            instruction =
                "Conjuguez le verbe '" +
                question.eval.instruction +
                "' aux temps et personnes suivantes :";
        }
        const divPreview = document.createElement("div");

        const titrePreview = document.createElement("h4");
        titrePreview.textContent = "Aperçu de l'élève";

        const instructionLabel = document.createElement("label");
        instructionLabel.textContent = instruction;

        // Differs depending on type

        switch (type) {
            case "traduction":
                const answerInput = document.createElement("input");
                answerInput.type = "text";
                answerInput.placeholder = "Écrivez votre réponse ici";

                divPreview.append(
                    titrePreview,
                    instructionLabel,
                    document.createElement("br"),
                    answerInput
                );
                questionElement.appendChild(divPreview);
                question.elements.preview = instructionLabel;
                break;

            case "conjugaison":
                const answerInput2 = document.createElement("table");

                divPreview.append(titrePreview, instructionLabel, answerInput2);
                questionElement.appendChild(divPreview);
                question.elements.preview = instructionLabel;
                question.elements.divPreview = divPreview;
                tableauCreate(question);
                break;
        }
    }
    divPreview();

    // ANCHOR - Parametres div
    function divPopup() {
        const bigDivPopup = document.createElement("div");
        bigDivPopup.classList.add("popup");
        const divPopup = document.createElement("div");
        divPopup.classList.add("interieur-popup");
        bigDivPopup.style.display = "none";

        function point() {
            const pointLabel = document.createElement("label");
            pointLabel.textContent = "Points : ";

            const pointInput = document.createElement("input");
            pointInput.type = "number";
            pointInput.min = 0;
            pointInput.value =
                questions.length != 0 ? questions[questions.length - 1].eval.params.points : 1;
            pointInput.addEventListener("input", () => {
                question.eval.params.points = pointInput.value;
                renameAllQuestions();
            });

            if (create) {
                question.eval.params.points = pointInput.value;
            } else {
                pointInput.value = question.eval.params.points;
            }

            divPopup.append(pointLabel, pointInput);
        }
        point();

        divPopup.append(document.createElement("br"));

        function accent() {
            const accentLabel = document.createElement("label");
            accentLabel.textContent = "Accent : ";

            const accentInput = document.createElement("input");
            accentInput.type = "checkbox";
            accentInput.checked =
                questions.length != 0 ? questions[questions.length - 1].eval.params.accent : false;
            accentInput.addEventListener("input", () => {
                question.eval.params.accent = accentInput.checked;
                updateLocalStorage();
            });

            if (create) {
                question.eval.params.accent = accentInput.checked;
            } else {
                accentInput.checked = question.eval.params.accent;
            }

            divPopup.append(accentLabel, accentInput);
        }
        accent();

        divPopup.append(document.createElement("br"));

        if (type == "traduction") {
            // Options specific to traduction
            function plural() {
                const pluralLabel = document.createElement("label");
                pluralLabel.textContent = "Plural : ";

                const pluralInput = document.createElement("input");
                pluralInput.type = "checkbox";
                pluralInput.checked =
                    questions.length != 0 ? questions[questions.length - 1].elements.plural : false;

                if (!create) {
                    pluralInput.checked = question.eval.params.plural.length != 0;
                }

                // Everything about the tag system
                const motsDiv = document.createElement("div");

                const pluralMotsInput = document.createElement("input");
                pluralMotsInput.type = "text";
                pluralMotsInput.placeholder = "Mots autorisés";
                pluralMotsInput.hidden = !pluralInput.checked;
                pluralMotsInput.addEventListener("keyup", function (e) {
                    if (e.key === " " || e.key === "Enter") {
                        const tag = this.value.trim();
                        question.eval.params.plural.push(tag);
                        const tagElement = document.createElement("span");
                        tagElement.classList.add("tag");
                        tagElement.textContent = tag;

                        const deleteButton = document.createElement("button");
                        deleteButton.textContent = "x";
                        deleteButton.classList.add("tagDelete");
                        deleteButton.addEventListener("click", function () {
                            tagElement.remove();
                            question.eval.params.plural.splice(
                                question.eval.params.plural.findIndex((p) => p === tag),
                                1
                            );
                            updateLocalStorage();
                        });

                        tagElement.appendChild(deleteButton);
                        motsDiv.insertBefore(tagElement, this);

                        this.value = "";
                        updateLocalStorage();
                    }
                });

                if (!create) {
                    const tempRefNode = document.createElement("div");
                    motsDiv.appendChild(tempRefNode);

                    question.eval.params.plural.forEach((mot) => {
                        const tagElement = document.createElement("span");
                        tagElement.classList.add("tag");
                        tagElement.textContent = mot;

                        const deleteButton = document.createElement("button");
                        deleteButton.textContent = "x";
                        deleteButton.classList.add("tagDelete");
                        deleteButton.addEventListener("click", function () {
                            tagElement.remove();
                            question.eval.params.plural.splice(
                                question.eval.params.plural.findIndex((p) => p === mot),
                                1
                            );
                            updateLocalStorage();
                        });

                        tagElement.appendChild(deleteButton);
                        motsDiv.insertBefore(tagElement, tempRefNode);
                    });
                    motsDiv.insertBefore(pluralMotsInput, tempRefNode);
                    tempRefNode.remove();
                }

                // Back to pluralInput

                pluralInput.addEventListener("input", () => {
                    pluralMotsInput.hidden = !pluralMotsInput.hidden;
                    question.elements.plural = pluralInput.checked;
                    updateLocalStorage();
                });

                motsDiv.append(pluralMotsInput);
                divPopup.append(pluralLabel, pluralInput, motsDiv);
            }
            plural();

            function genre() {
                const genreLabel = document.createElement("label");
                genreLabel.textContent = "Genre : ";

                const genreInput = document.createElement("input");
                genreInput.type = "checkbox";
                genreInput.checked =
                    questions.length != 0 ? questions[questions.length - 1].elements.genre : false;

                if (!create) {
                    genreInput.checked = question.eval.params.genre.length != 0;
                }

                // Everything about the tag system
                const motsDiv = document.createElement("div");

                const genreMotsInput = document.createElement("input");
                genreMotsInput.type = "text";
                genreMotsInput.placeholder = "Mots autorisés";
                genreMotsInput.hidden = !genreInput.checked;
                genreMotsInput.addEventListener("keyup", function (e) {
                    if (e.key === " " || e.key === "Enter") {
                        const tag = this.value.trim();
                        question.eval.params.genre.push(tag);
                        const tagElement = document.createElement("span");
                        tagElement.classList.add("tag");
                        tagElement.textContent = tag;

                        const deleteButton = document.createElement("button");
                        deleteButton.textContent = "x";
                        deleteButton.classList.add("tagDelete");
                        deleteButton.addEventListener("click", function () {
                            tagElement.remove();
                            question.eval.params.genre.splice(
                                question.eval.params.genre.findIndex((p) => p === tag),
                                1
                            );
                            updateLocalStorage();
                        });

                        tagElement.appendChild(deleteButton);
                        motsDiv.insertBefore(tagElement, this);

                        this.value = "";
                        updateLocalStorage();
                    }
                });

                if (!create) {
                    const tempRefNode = document.createElement("div");
                    motsDiv.appendChild(tempRefNode);

                    question.eval.params.genre.forEach((mot) => {
                        const tagElement = document.createElement("span");
                        tagElement.classList.add("tag");
                        tagElement.textContent = mot;

                        const deleteButton = document.createElement("button");
                        deleteButton.textContent = "x";
                        deleteButton.classList.add("tagDelete");
                        deleteButton.addEventListener("click", function () {
                            tagElement.remove();
                            question.eval.params.genre.splice(
                                question.eval.params.genre.findIndex((p) => p === mot),
                                1
                            );
                            updateLocalStorage();
                        });

                        tagElement.appendChild(deleteButton);
                        motsDiv.insertBefore(tagElement, tempRefNode);
                    });
                    motsDiv.insertBefore(genreMotsInput, tempRefNode);
                    tempRefNode.remove();
                }

                genreInput.addEventListener("input", () => {
                    genreMotsInput.hidden = !genreMotsInput.hidden;
                    question.elements.genre = genreInput.checked;
                    updateLocalStorage();
                });

                motsDiv.append(genreMotsInput);
                divPopup.append(genreLabel, genreInput, motsDiv);
            }
            genre();

            function determiners() {
                const detLabel = document.createElement("label");
                detLabel.textContent = "Déterminant : ";

                const detInput = document.createElement("input");
                detInput.type = "checkbox";
                detInput.checked =
                    questions.length != 0
                        ? questions[questions.length - 1].elements.determiners
                        : false;

                if (!create) {
                    detInput.checked = question.eval.params.determiners.length != 0;
                }

                // Everything about the tag system
                const motsDiv = document.createElement("div");

                const detMotsInput = document.createElement("input");
                detMotsInput.type = "text";
                detMotsInput.placeholder = "Déterminants autorisés";
                detMotsInput.hidden = !detInput.checked;
                detMotsInput.addEventListener("keyup", function (e) {
                    if (e.key === " " || e.key === "Enter") {
                        const tag = this.value.trim();
                        question.eval.params.determiners.push(tag);
                        const tagElement = document.createElement("span");
                        tagElement.classList.add("tag");
                        tagElement.textContent = tag;

                        const deleteButton = document.createElement("button");
                        deleteButton.textContent = "x";
                        deleteButton.classList.add("tagDelete");
                        deleteButton.addEventListener("click", function () {
                            tagElement.remove();
                            question.eval.params.determiners.splice(
                                question.eval.params.determiners.findIndex((p) => p === tag),
                                1
                            );
                            updateLocalStorage();
                        });

                        tagElement.appendChild(deleteButton);
                        motsDiv.insertBefore(tagElement, this);

                        this.value = "";
                        updateLocalStorage();
                    }
                });

                if (!create) {
                    const tempRefNode = document.createElement("div");
                    motsDiv.appendChild(tempRefNode);

                    question.eval.params.determiners.forEach((mot) => {
                        const tagElement = document.createElement("span");
                        tagElement.classList.add("tag");
                        tagElement.textContent = mot;

                        const deleteButton = document.createElement("button");
                        deleteButton.textContent = "x";
                        deleteButton.classList.add("tagDelete");
                        deleteButton.addEventListener("click", function () {
                            tagElement.remove();
                            question.eval.params.determiners.splice(
                                question.eval.params.determiners.findIndex((p) => p === mot),
                                1
                            );
                            updateLocalStorage();
                        });

                        tagElement.appendChild(deleteButton);
                        motsDiv.insertBefore(tagElement, tempRefNode);
                    });
                    motsDiv.insertBefore(detMotsInput, tempRefNode);
                    tempRefNode.remove();
                }

                detInput.addEventListener("input", () => {
                    detMotsInput.hidden = !detMotsInput.hidden;
                    question.elements.determiners = detInput.checked;
                    updateLocalStorage();
                });

                motsDiv.append(detMotsInput);
                divPopup.append(detLabel, detInput, motsDiv);
            }
            determiners();
        }

        bigDivPopup.appendChild(divPopup);
        questionElement.appendChild(bigDivPopup);
        question.elements.popup = bigDivPopup;
    }
    divPopup();

    questionsDiv.appendChild(questionElement);
    questions.push(question);

    // ANCHOR - Launch global functions
    renameAllQuestions();
    statPointsLaunch();
    updateLocalStorage();
}
// ùSECTION

// SECTION - Load from ID
export function loadFromID(questionList) {
    questionList.forEach((question) => {
        addQuestion(question.type, { eval: question });
    });
}
// ùSECTION

// SECTION - Load from pending
export function loadFromPending(questionList) {
    evalName.value = questionList.name;
    questionList.eval.forEach((question) => {
        addQuestion(question.eval.type, question);
    });
}
// ùSECTION
// ùSECTION

// SECTION - Sub-tools commands

/** ANCHOR - Rename all questions
 * Renomme toutes les questions lors d'une suppression
 */
function renameAllQuestions() {
    for (let i = 0; i < questions.length; i++) {
        questions[i].elements.title.textContent =
            "Question n°" + (i + 1) + "  (/" + questions[i].eval.params.points.toString() + ")";
    }
    statQuestions.textContent = "Nombre de questions : " + questions.length.toString();

    statPointsLaunch();
}

/** ANCHOR - Update points stats
 * Mets à jour le compteur global de points
 */
function statPointsLaunch() {
    let nbPoints = 0;
    for (let i = 0; i < questions.length; i++) {
        nbPoints = nbPoints + parseInt(questions[i].eval.params.points);
    }
    statPoints.textContent = "Total des points : " + nbPoints;
    updateLocalStorage();
}

/** ANCHOR - Update local storage
 * Updates the local storage with the current questions list
 */
function updateLocalStorage() {
    let evalPending = {
        name: evalName.value,
        eval: questions,
    };
    localStorage.setItem("evalPending", JSON.stringify(evalPending));
}
// ùSECTION

// SECTION - Type specific adding logic

function tableauCreate(question) {
    const divPreview = question.elements.divPreview;
    divPreview.innerHTML = "";

    const titrePreview = document.createElement("h4");
    titrePreview.textContent = "Aperçu de l'élève";

    const instructionLabel = document.createElement("label");
    instructionLabel.textContent =
        "Conjuguez le verbe '" + question.eval.instruction + "' aux temps et personnes suivantes :";

    const answerInput = document.createElement("table");

    divPreview.append(titrePreview, instructionLabel, answerInput);

    const table = document.createElement("table");

    function header() {
        const thead = document.createElement("thead");
        const theadRow = document.createElement("tr");

        const empty = document.createElement("th");
        theadRow.appendChild(empty);

        for (let i = 0; i < question.eval.answer.tenses.length; i++) {
            const th = document.createElement("th");
            th.textContent = question.eval.answer.tenses[i];
            theadRow.appendChild(th);
        }

        thead.appendChild(theadRow);
        table.appendChild(thead);
    }
    header();

    function body() {
        const tbody = document.createElement("tbody");

        for (let i = 0; i < question.eval.answer.pronouns.length; i++) {
            const tr = document.createElement("tr");

            const th = document.createElement("th");
            th.textContent = question.eval.answer.pronouns[i];
            tr.appendChild(th);

            for (let j = 0; j < question.eval.answer.tenses.length; j++) {
                const td = document.createElement("td");
                const input = document.createElement("input");
                input.type = "text";
                input.placeholder = "Verbe conjugué";
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

// ùSECTION

// SECTION - Common but parametric adding logic

/** ANCHOR - Ajoute l'input de la question
 * @param {HTMLDivElement} divA - div où se situe la question
 * @param {object} question - Question actuellement modifiée
 * @param {string} type - Type de la question
 */
function instruction(divA, question, type) {
    let placeholder = "";
    switch (
        type // Def placeholder according to type
    ) {
        case "traduction":
            placeholder = "Consigne de la question";
            break;

        case "conjugaison":
            placeholder = "Verbe à conjuguer";
            break;
    }

    const instructionLabel = (document.createElement("label").textContent = "Consigne : ");

    const instructionInput = document.createElement("input");
    instructionInput.type = "text";
    instructionInput.placeholder = placeholder;
    instructionInput.value = question.eval.instruction;
    instructionInput.addEventListener("input", () => {
        question.eval.instruction = instructionInput.value;
        question.elements.preview.textContent = instructionInput.value;
        updateLocalStorage();
        tableauCreate(question);
    });

    divA.append(instructionLabel, instructionInput);
}

/** ANCHOR - Ajoute la partie "réponse" de la question
 * @param {HTMLDivElement} divA - div où insérer la partie réponse
 * @param {object} question - objet question
 * @param {string} type - type de la question
 * @param {boolean} create - creation (true) ou update (false)
 */
function answer(divA, question, type, create) {
    if (type == "traduction") {
        const answerLabel = (document.createElement("label").textContent = "Réponse : ");

        const answerInput = document.createElement("input");
        answerInput.type = "text";
        answerInput.placeholder = "Réponse attendue";
        answerInput.value = question.eval.answer;
        answerInput.addEventListener("input", () => {
            question.eval.answer = answerInput.value;
            updateLocalStorage();
        });

        divA.append(answerLabel, answerInput);
    } else {
        // Create base table
        const table = document.createElement("table");

        function header() {
            const thead = document.createElement("thead");
            const theadRow = document.createElement("tr");

            // Empty cell
            const empty = document.createElement("th");
            theadRow.appendChild(empty);

            // First cell
            const first = document.createElement("th");
            const firstInput = document.createElement("input");
            firstInput.type = "text";
            firstInput.placeholder = "Temps";
            question.elements.tenses.push(firstInput);
            firstInput.addEventListener("input", () => {
                question.eval.answer.tenses[0] = firstInput.value;
                tableauCreate(question);
                updateLocalStorage();
            });
            first.appendChild(firstInput);
            theadRow.appendChild(first);

            // If it is an update rather than a create, will create every line/column
            if (!create) {
                firstInput.value = question.eval.answer.tenses[0];
                function header() {
                    for (let i = 1; i < question.eval.answer.tenses.length; i++) {
                        const thh = document.createElement("th");
                        const th = document.createElement("input");
                        th.type = "text";
                        th.placeholder = "Temps";
                        th.value = question.eval.answer.tenses[i];
                        th.addEventListener("input", () => {
                            question.eval.answer.tenses[i] = th.value;
                            tableauCreate(question);
                            updateLocalStorage();
                        });
                        thh.appendChild(th);
                        theadRow.appendChild(thh);
                    }
                }
                header();
            } else {
                question.eval.answer.tenses[0] = firstInput.value;
            }

            //* Buttons

            // Delete
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "-";
            deleteButton.disabled = true;
            deleteButton.addEventListener("click", () => {
                // Remove element
                theadRow.removeChild(theadRow.lastChild.previousSibling.previousSibling);
                question.elements.tenses.pop();
                question.eval.answer.tenses.pop();

                // Remove lines end
                for (let i = 0; i < question.elements.pronouns.length; i++) {
                    let row = question.elements.pronouns[i].parentElement.parentElement;
                    let elements = row.getElementsByTagName("td");
                    let lastElement = elements[elements.length - 1];
                    lastElement.remove();
                }

                if (theadRow.lastChild.previousSibling.previousSibling.previousSibling === empty) {
                    deleteButton.disabled = true;
                } else {
                    deleteButton.disabled = false;
                }
                tableauCreate(question);
                updateLocalStorage();
            });

            // Add
            const addButton = document.createElement("button");
            addButton.textContent = "+";
            addButton.addEventListener("click", () => {
                // Tenses
                const th = document.createElement("th");
                const input = document.createElement("input");
                input.type = "text";
                input.placeholder = "Temps";
                input.addEventListener("input", () => {
                    let index = question.elements.tenses.indexOf(input);
                    question.eval.answer.tenses[index] = input.value;
                    question.elements.tenses[index] = input;
                    tableauCreate(question);
                    updateLocalStorage();
                });
                th.appendChild(input);
                theadRow.insertBefore(th, addButton);
                question.elements.tenses.push(input);
                question.eval.answer.tenses.push(input.value);

                // Verbs
                for (let i = 0; i < question.elements.pronouns.length; i++) {
                    const td = document.createElement("td");
                    const subInput = document.createElement("input");
                    subInput.type = "text";
                    subInput.placeholder = "Verbe conjugué";
                    subInput.addEventListener("input", () => {
                        let j = question.elements.tenses.indexOf(input);
                        if (!question.eval.answer.verbs[i]) question.eval.answer.verbs[i] = [];
                        question.eval.answer.verbs[i][j] = subInput.value;
                        tableauCreate(question);
                        updateLocalStorage();
                    });
                    let j = question.elements.tenses.indexOf(input);
                    if (!question.eval.answer.verbs[i]) question.eval.answer.verbs[i] = [];
                    question.eval.answer.verbs[i][j] = subInput.value;

                    let row = question.elements.pronouns[i].parentElement.parentElement;
                    td.appendChild(subInput);
                    row.appendChild(td);
                }

                if (theadRow.lastChild.previousSibling.previousSibling.previousSibling === empty) {
                    deleteButton.disabled = true;
                } else {
                    deleteButton.disabled = false;
                }
                tableauCreate(question);
                updateLocalStorage();
            });

            theadRow.appendChild(addButton);
            theadRow.appendChild(deleteButton);
            thead.appendChild(theadRow);
            table.appendChild(thead);
        }
        header();

        function body() {
            const tbody = document.createElement("tbody");
            const tRow = document.createElement("tr");

            if (!create) {
                // Difference between creation/updating
                function body() {
                    for (let i = 0; i < question.eval.answer.pronouns.length; i++) {
                        const tr = document.createElement("tr");

                        const thh = document.createElement("th");
                        const th = document.createElement("input");
                        th.placeholder = "Personne";
                        th.type = "text";
                        th.value = question.eval.answer.pronouns[i];
                        th.addEventListener("input", () => {
                            question.eval.answer.pronouns[0] = th.value;
                            tableauCreate(question);
                            updateLocalStorage();
                        });
                        thh.append(th);
                        tr.appendChild(thh);

                        for (let j = 0; j < question.eval.answer.tenses.length; j++) {
                            const td = document.createElement("td");
                            const input = document.createElement("input");
                            input.type = "text";
                            input.placeholder = "Verbe conjugué";
                            input.value = question.eval.answer.verbs[i][j];
                            input.addEventListener("input", () => {
                                question.eval.answer.verbs[i][j] = input.value;
                                tableauCreate(question);
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
            } else {
                // First pronoun
                const th = document.createElement("th");
                const thInput = document.createElement("input");
                thInput.type = "text";
                thInput.placeholder = "Personne";
                thInput.addEventListener("input", () => {
                    question.eval.answer.pronouns[0] = thInput.value;
                    tableauCreate(question);
                    updateLocalStorage();
                });
                th.appendChild(thInput);
                tRow.appendChild(th);
                question.elements.pronouns.push(thInput);

                // First verb
                const td = document.createElement("td");
                const input = document.createElement("input");
                input.type = "text";
                input.placeholder = "Verbe conjugué";
                input.addEventListener("input", () => {
                    question.eval.answer.verbs[0][0] = input.value;
                    tableauCreate(question);
                    updateLocalStorage();
                });

                td.appendChild(input);
                tRow.appendChild(td);

                question.eval.answer.verbs[0][0] = input.value;
                question.eval.answer.pronouns[0] = thInput.value;
                tbody.appendChild(tRow);
            }

            //* Buttons

            // Add
            const tRowButton = document.createElement("tr");
            const addButton = document.createElement("button");
            addButton.textContent = "+";
            addButton.addEventListener("click", () => {
                const tr = document.createElement("tr");

                // Pronoun
                const th = document.createElement("th");
                const thInputAdded = document.createElement("input");
                thInputAdded.type = "text";
                thInputAdded.placeholder = "Personne";
                thInputAdded.addEventListener("input", () => {
                    let index = question.elements.pronouns.indexOf(thInputAdded);
                    question.eval.answer.pronouns[index] = thInputAdded.value;
                    question.elements.pronouns[index] = thInputAdded;
                    tableauCreate(question);
                    updateLocalStorage();
                });
                question.eval.answer.pronouns.push(thInputAdded.value);
                question.elements.pronouns.push(thInputAdded);
                th.appendChild(thInputAdded);
                tr.appendChild(th);

                // Verb
                for (let j = 0; j < question.elements.tenses.length; j++) {
                    const td = document.createElement("td");
                    const input = document.createElement("input");
                    input.type = "text";
                    input.placeholder = "Verbe conjugué";
                    input.addEventListener("input", () => {
                        let i = question.elements.pronouns.indexOf(thInputAdded);
                        if (!question.eval.answer.verbs[i]) question.eval.answer.verbs[i] = [];
                        question.eval.answer.verbs[i][j] = input.value;
                        tableauCreate(question);
                        updateLocalStorage();
                    });
                    let i = question.elements.pronouns.indexOf(thInputAdded);
                    if (!question.eval.answer.verbs[i]) question.eval.answer.verbs[i] = [];
                    question.eval.answer.verbs[i][j] = input.value;

                    td.appendChild(input);
                    tr.appendChild(td);
                }

                tbody.insertBefore(tr, tRowButton);

                if (tbody.lastChild.previousSibling === tRow) {
                    deleteButton.disabled = true;
                } else {
                    deleteButton.disabled = false;
                }
                tableauCreate(question);
                updateLocalStorage();
            });
            tRowButton.appendChild(addButton);

            // Delete
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "-";
            deleteButton.disabled = true;
            deleteButton.addEventListener("click", () => {
                tbody.removeChild(tbody.lastChild.previousSibling); // Don't delete the buttons ! :)
                question.eval.answer.pronouns.pop();
                question.elements.pronouns.pop();
                if (tbody.lastChild.previousSibling === tRow) {
                    deleteButton.disabled = true;
                } else {
                    deleteButton.disabled = false;
                }
                tableauCreate(question);
                updateLocalStorage();
            });
            tRowButton.appendChild(deleteButton);

            tbody.appendChild(tRowButton);
            table.appendChild(tbody);
        }
        body();

        divA.appendChild(table);
    }
}

/** ANCHOR - Ajoute les deux boutons de paramètre
 * @param {HTMLDivElement} divA - div où insérer l'élément
 * @param {HTMLDivElement} questionElement - div de la question entière
 * @param {object} question - objet question
 */
function params(divA, questionElement, question) {
    const paramsButton = document.createElement("button");
    paramsButton.textContent = "⚙";
    paramsButton.addEventListener("click", () => {
        if (question.elements.popup.style.display == "block") {
            question.elements.popup.style.display = "none";
        } else {
            question.elements.popup.style.display = "block";
        }
    });

    window.addEventListener("click", function (event) {
        if (event.target == question.elements.popup) {
            question.elements.popup.style.display = "none";
        }
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "🗑";
    deleteButton.addEventListener("click", () => {
        questionsDiv.removeChild(questionElement);
        questions.splice(
            questions.findIndex((q) => q.elements.div == questionElement),
            1
        );
        renameAllQuestions();
        updateLocalStorage();
    });

    divA.append(paramsButton, deleteButton);
}
