import { Pconfirm, Palert, Pinput } from "../../../shared/scripts/modules/utils.js";

/**
 * ! WARNING : THIS CODE IS A DANGER TO YOUR SANITY. PROCEDE WITH CAUTION.
 */

// == Initialize global variables ==

export let questions = [];

const statPoints = document.getElementById("nbPoints");
const statQuestions = document.getElementById("nbQuestions");
const questionsDiv = document.getElementById("questionsList");
const evalName = document.getElementById("nom_eval");

// == Main question adding logic ==

/**
 * Créée la question
 * @param {string} type - Type de question (traduction/conjugaison)
 * @param {object} question - Contenu de la question, rien si c'est une nouvelle
 */
export function addQuestion(type, question = null) {
    const questionElement = document.createElement("div");
    questionElement.className = "question";
    const create = question == null;

    if (question == null) {
        // New fresh question object
        switch (type) {
            case "traduction":
                question = {
                    elements: {
                        div: questionElement,
                        title: "",
                        preview: "",
                        popup: "",
                        pluriel: false,
                        genre: false,
                        determinant: false,
                    },
                    eval: {
                        type: "traduction",
                        consigne: "",
                        reponse: "",
                        params: {
                            points: 0,
                            determinant: [],
                            pluriel: [],
                            genre: [],
                            sousConsigne: false,
                            accents: false,
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
                        temps: [],
                        pronoms: [],
                    },
                    eval: {
                        type: "conjugaison",
                        consigne: "",
                        reponse: {
                            temps: [],
                            pronoms: [],
                            verbes: [[]],
                        },
                        params: {
                            points: 0,
                            sousConsigne: false,
                            accents: false,
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
                    pluriel: false,
                    genre: false,
                    determinant: false,
                };
                break;

            case "conjugaison":
                question.elements = {
                    div: questionElement,
                    title: "",
                    preview: "",
                    divPreview: "",
                    popup: "",
                    temps: [],
                    pronoms: [],
                };
                break;
        }
    }

    // Common header system
    function entete() {
        const questionNumber = document.createElement("h3");
        questionNumber.textContent = "Question n°" + (questions.length + 1);

        questionElement.appendChild(questionNumber);
        question.elements.title = questionNumber;
    }
    entete();

    function divA() {
        const divA = document.createElement("div");

        // Consigne input
        consigne(divA, question, type);

        divA.append(document.createElement("br"));

        reponse(divA, question, type, create);

        divA.append(document.createElement("br"));

        params(divA, questionElement, question);

        questionElement.appendChild(divA);
    }
    divA();

    function divPreview() {
        let consigne = "";
        if (type == "traduction") {
            consigne = question.eval.consigne;
        } else {
            consigne =
                "Conjuguez le verbe '" +
                question.eval.consigne +
                "' aux temps et personnes suivantes :";
        }
        const divPreview = document.createElement("div");

        const titrePreview = document.createElement("h4");
        titrePreview.textContent = "Aperçu de l'élève";

        const consigneLabel = document.createElement("label");
        consigneLabel.textContent = consigne;

        // Differs depending on type

        switch (type) {
            case "traduction":
                const reponseInput = document.createElement("input");
                reponseInput.type = "text";
                reponseInput.placeholder = "Écrivez votre réponse ici";

                divPreview.append(
                    titrePreview,
                    consigneLabel,
                    document.createElement("br"),
                    reponseInput
                );
                questionElement.appendChild(divPreview);
                question.elements.preview = consigneLabel;
                break;

            case "conjugaison":
                const reponseInput2 = document.createElement("table");

                divPreview.append(titrePreview, consigneLabel, reponseInput2);
                questionElement.appendChild(divPreview);
                question.elements.preview = consigneLabel;
                question.elements.divPreview = divPreview;
                tableauCreate(question);
                break;
        }
    }
    divPreview();

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
                statPointsLaunch();
                updateLocalStorage();
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

        function accents() {
            const accentsLabel = document.createElement("label");
            accentsLabel.textContent = "Accents : ";

            const accentsInput = document.createElement("input");
            accentsInput.type = "checkbox";
            accentsInput.checked =
                questions.length != 0 ? questions[questions.length - 1].eval.params.accents : false;
            accentsInput.addEventListener("input", () => {
                question.eval.params.accents = accentsInput.checked;
                updateLocalStorage();
            });

            if (create) {
                question.eval.params.accents = accentsInput.checked;
            } else {
                accentsInput.checked = question.eval.params.accents;
            }

            divPopup.append(accentsLabel, accentsInput);
        }
        accents();

        divPopup.append(document.createElement("br"));

        if (type == "traduction") {
            // Options specific to traduction
            function pluriel() {
                const plurielLabel = document.createElement("label");
                plurielLabel.textContent = "Pluriel : ";

                const plurielInput = document.createElement("input");
                plurielInput.type = "checkbox";
                plurielInput.checked =
                    questions.length != 0
                        ? questions[questions.length - 1].elements.pluriel
                        : false;

                if (!create) {
                    plurielInput.checked = question.eval.params.pluriel.length != 0;
                }

                // Everything about the tag system
                const motsDiv = document.createElement("div");

                const plurielMotsInput = document.createElement("input");
                plurielMotsInput.type = "text";
                plurielMotsInput.placeholder = "Mots autorisés";
                plurielMotsInput.hidden = !plurielInput.checked;
                plurielMotsInput.addEventListener("keyup", function (e) {
                    if (e.key === " ") {
                        const tag = this.value.trim();
                        question.eval.params.pluriel.push(tag);
                        const tagElement = document.createElement("span");
                        tagElement.classList.add("tag");
                        tagElement.textContent = tag;

                        const deleteButton = document.createElement("button");
                        deleteButton.textContent = "x";
                        deleteButton.classList.add("tagDelete");
                        deleteButton.addEventListener("click", function () {
                            tagElement.remove();
                            question.eval.params.pluriel.splice(
                                question.eval.params.pluriel.findIndex((p) => p === tag),
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

                    question.eval.params.pluriel.forEach((mot) => {
                        const tagElement = document.createElement("span");
                        tagElement.classList.add("tag");
                        tagElement.textContent = mot;

                        const deleteButton = document.createElement("button");
                        deleteButton.textContent = "x";
                        deleteButton.classList.add("tagDelete");
                        deleteButton.addEventListener("click", function () {
                            tagElement.remove();
                            question.eval.params.pluriel.splice(
                                question.eval.params.pluriel.findIndex((p) => p === mot),
                                1
                            );
                            updateLocalStorage();
                        });

                        tagElement.appendChild(deleteButton);
                        motsDiv.insertBefore(tagElement, tempRefNode);
                    });
                    motsDiv.insertBefore(plurielMotsInput, tempRefNode);
                    tempRefNode.remove();
                }

                // Back to plurielInput

                plurielInput.addEventListener("input", () => {
                    plurielMotsInput.hidden = !plurielMotsInput.hidden;
                    question.elements.pluriel = plurielInput.checked;
                    updateLocalStorage();
                });

                motsDiv.append(plurielMotsInput);
                divPopup.append(plurielLabel, plurielInput, motsDiv);
            }
            pluriel();

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
                    if (e.key === " ") {
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

            function determinant() {
                const detLabel = document.createElement("label");
                detLabel.textContent = "Déterminant : ";

                const detInput = document.createElement("input");
                detInput.type = "checkbox";
                detInput.checked =
                    questions.length != 0
                        ? questions[questions.length - 1].elements.determinant
                        : false;

                if (!create) {
                    detInput.checked = question.eval.params.determinant.length != 0;
                }

                // Everything about the tag system
                const motsDiv = document.createElement("div");

                const detMotsInput = document.createElement("input");
                detMotsInput.type = "text";
                detMotsInput.placeholder = "Déterminants autorisés";
                detMotsInput.hidden = !detInput.checked;
                detMotsInput.addEventListener("keyup", function (e) {
                    if (e.key === " ") {
                        const tag = this.value.trim();
                        question.eval.params.determinant.push(tag);
                        const tagElement = document.createElement("span");
                        tagElement.classList.add("tag");
                        tagElement.textContent = tag;

                        const deleteButton = document.createElement("button");
                        deleteButton.textContent = "x";
                        deleteButton.classList.add("tagDelete");
                        deleteButton.addEventListener("click", function () {
                            tagElement.remove();
                            question.eval.params.determinant.splice(
                                question.eval.params.determinant.findIndex((p) => p === tag),
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

                    question.eval.params.determinant.forEach((mot) => {
                        const tagElement = document.createElement("span");
                        tagElement.classList.add("tag");
                        tagElement.textContent = mot;

                        const deleteButton = document.createElement("button");
                        deleteButton.textContent = "x";
                        deleteButton.classList.add("tagDelete");
                        deleteButton.addEventListener("click", function () {
                            tagElement.remove();
                            question.eval.params.determinant.splice(
                                question.eval.params.determinant.findIndex((p) => p === mot),
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
                    question.elements.determinant = detInput.checked;
                    updateLocalStorage();
                });

                motsDiv.append(detMotsInput);
                divPopup.append(detLabel, detInput, motsDiv);
            }
            determinant();
        }

        bigDivPopup.appendChild(divPopup);
        questionElement.appendChild(bigDivPopup);
        question.elements.popup = bigDivPopup;
    }
    divPopup();

    questionsDiv.appendChild(questionElement);
    questions.push(question);
    renameAllQuestions();
    statPointsLaunch();
    updateLocalStorage();
}

export function loadFromID(questionList) {
    questionList.forEach((question) => {
        addQuestion(question.type, { eval: question });
    });
}

export function loadFromPending(questionList) {
    evalName.value = questionList.name;
    questionList.eval.forEach((question) => {
        addQuestion(question.eval.type, question);
    });
}

// == Sub-tools commands ==

/**
 * Renomme toutes les questions lors d'une suppression
 */
function renameAllQuestions() {
    for (let i = 0; i < questions.length; i++) {
        questions[i].elements.title.textContent = "Question n°" + (i + 1);
    }
    statQuestions.textContent = "Nombre de questions : " + questions.length.toString();

    statPointsLaunch();
}

/**
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

/**
 * Updates the local storage with the current questions list
 */
function updateLocalStorage() {
    let evalPending = {
        name: evalName.value,
        eval: questions,
    };
    localStorage.setItem("evalPending", JSON.stringify(evalPending));
}

// == Type specific adding logic ==

function tableauCreate(question) {
    const divPreview = question.elements.divPreview;
    divPreview.innerHTML = "";

    const titrePreview = document.createElement("h4");
    titrePreview.textContent = "Aperçu de l'élève";

    const consigneLabel = document.createElement("label");
    consigneLabel.textContent =
        "Conjuguez le verbe '" + question.eval.consigne + "' aux temps et personnes suivantes :";

    const reponseInput = document.createElement("table");

    divPreview.append(titrePreview, consigneLabel, reponseInput);

    const table = document.createElement("table");

    function header() {
        const thead = document.createElement("thead");
        const theadRow = document.createElement("tr");

        const empty = document.createElement("th");
        theadRow.appendChild(empty);

        for (let i = 0; i < question.eval.reponse.temps.length; i++) {
            const th = document.createElement("th");
            th.textContent = question.eval.reponse.temps[i];
            theadRow.appendChild(th);
        }

        thead.appendChild(theadRow);
        table.appendChild(thead);
    }
    header();

    function body() {
        const tbody = document.createElement("tbody");

        for (let i = 0; i < question.eval.reponse.pronoms.length; i++) {
            const tr = document.createElement("tr");

            const th = document.createElement("th");
            th.textContent = question.eval.reponse.pronoms[i];
            tr.appendChild(th);

            for (let j = 0; j < question.eval.reponse.temps.length; j++) {
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

// == Common but parametric adding logic ==

// For divA

/**
 * Ajoute l'input de la question
 * @param {HTMLDivElement} divA - div où se situe la question
 * @param {object} question - Question actuellement modifiée
 * @param {string} type - Type de la question
 */
function consigne(divA, question, type) {
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

    const consigneLabel = (document.createElement("label").textContent = "Consigne : ");

    const consigneInput = document.createElement("input");
    consigneInput.type = "text";
    consigneInput.placeholder = placeholder;
    consigneInput.value = question.eval.consigne;
    consigneInput.addEventListener("input", () => {
        question.eval.consigne = consigneInput.value;
        question.elements.preview.textContent = consigneInput.value;
        updateLocalStorage();
    });

    divA.append(consigneLabel, consigneInput);
}

/**
 * Ajoute la partie "réponse" de la question
 * @param {HTMLDivElement} divA - div où insérer la partie réponse
 * @param {object} question - objet question
 * @param {string} type - type de la question
 * @param {boolean} create - creation (true) ou update (false)
 */
function reponse(divA, question, type, create) {
    if (type == "traduction") {
        const reponseLabel = (document.createElement("label").textContent = "Réponse : ");

        const reponseInput = document.createElement("input");
        reponseInput.type = "text";
        reponseInput.placeholder = "Réponse attendue";
        reponseInput.value = question.eval.reponse;
        reponseInput.addEventListener("input", () => {
            question.eval.reponse = reponseInput.value;
            updateLocalStorage();
        });

        divA.append(reponseLabel, reponseInput);
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
            question.elements.temps.push(firstInput);
            firstInput.addEventListener("input", () => {
                question.eval.reponse.temps[0] = firstInput.value;
                tableauCreate(question);
                updateLocalStorage();
            });
            first.appendChild(firstInput);
            theadRow.appendChild(first);

            // If it is an update rather than a create, will create every line/column
            if (!create) {
                firstInput.value = question.eval.reponse.temps[0];
                function header() {
                    for (let i = 1; i < question.eval.reponse.temps.length; i++) {
                        const thh = document.createElement("th");
                        const th = document.createElement("input");
                        th.type = "text";
                        th.placeholder = "Temps";
                        th.value = question.eval.reponse.temps[i];
                        th.addEventListener("input", () => {
                            question.eval.reponse.temps[i] = th.value;
                            tableauCreate(question);
                            updateLocalStorage();
                        });
                        thh.appendChild(th);
                        theadRow.appendChild(thh);
                    }
                }
                header();
            } else {
                question.eval.reponse.temps[0] = firstInput.value;
            }

            //* Buttons

            // Delete
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "-";
            deleteButton.disabled = true;
            deleteButton.addEventListener("click", () => {
                // Remove element
                theadRow.removeChild(theadRow.lastChild.previousSibling.previousSibling);
                question.elements.temps.pop();
                question.eval.reponse.temps.pop();

                // Remove lines end
                for (let i = 0; i < question.elements.pronoms.length; i++) {
                    let row = question.elements.pronoms[i].parentElement.parentElement;
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
                // Temps
                const th = document.createElement("th");
                const input = document.createElement("input");
                input.type = "text";
                input.placeholder = "Temps";
                input.addEventListener("input", () => {
                    let index = question.elements.temps.indexOf(input);
                    question.eval.reponse.temps[index] = input.value;
                    question.elements.temps[index] = input;
                    tableauCreate(question);
                    updateLocalStorage();
                });
                th.appendChild(input);
                theadRow.insertBefore(th, addButton);
                question.elements.temps.push(input);
                question.eval.reponse.temps.push(input.value);

                // Verbes
                for (let i = 0; i < question.elements.pronoms.length; i++) {
                    const td = document.createElement("td");
                    const subInput = document.createElement("input");
                    subInput.type = "text";
                    subInput.placeholder = "Verbe conjugué";
                    subInput.addEventListener("input", () => {
                        let j = question.elements.temps.indexOf(input);
                        if (!question.eval.reponse.verbes[i]) question.eval.reponse.verbes[i] = [];
                        question.eval.reponse.verbes[i][j] = subInput.value;
                        tableauCreate(question);
                        updateLocalStorage();
                    });

                    let row = question.elements.pronoms[i].parentElement.parentElement;
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
                    for (let i = 0; i < question.eval.reponse.pronoms.length; i++) {
                        const tr = document.createElement("tr");

                        const thh = document.createElement("th");
                        const th = document.createElement("input");
                        th.placeholder = "Personne";
                        th.type = "text";
                        th.value = question.eval.reponse.pronoms[i];
                        th.addEventListener("input", () => {
                            question.eval.reponse.pronoms[0] = th.value;
                            tableauCreate(question);
                            updateLocalStorage();
                        });
                        thh.append(th);
                        tr.appendChild(thh);

                        for (let j = 0; j < question.eval.reponse.temps.length; j++) {
                            const td = document.createElement("td");
                            const input = document.createElement("input");
                            input.type = "text";
                            input.placeholder = "Verbe conjugué";
                            input.value = question.eval.reponse.verbes[i][j];
                            input.addEventListener("input", () => {
                                question.eval.reponse.verbes[i][j] = input.value;
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
                    question.eval.reponse.pronoms[0] = thInput.value;
                    tableauCreate(question);
                    updateLocalStorage();
                });
                th.appendChild(thInput);
                tRow.appendChild(th);
                question.elements.pronoms.push(thInput);

                // First verb
                const td = document.createElement("td");
                const input = document.createElement("input");
                input.type = "text";
                input.placeholder = "Verbe conjugué";
                input.addEventListener("input", () => {
                    question.eval.reponse.verbes[0][0] = input.value;
                    tableauCreate(question);
                    updateLocalStorage();
                });

                td.appendChild(input);
                tRow.appendChild(td);

                question.eval.reponse.verbes[0][0] = input.value;
                question.eval.reponse.pronoms[0] = thInput.value;
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
                    let index = question.elements.pronoms.indexOf(thInputAdded);
                    question.eval.reponse.pronoms[index] = thInputAdded.value;
                    question.elements.pronoms[index] = thInputAdded;
                    tableauCreate(question);
                    updateLocalStorage();
                });
                question.eval.reponse.pronoms.push(thInputAdded.value);
                question.elements.pronoms.push(thInputAdded);
                th.appendChild(thInputAdded);
                tr.appendChild(th);

                // Verb
                for (let j = 0; j < question.elements.temps.length; j++) {
                    const td = document.createElement("td");
                    const input = document.createElement("input");
                    input.type = "text";
                    input.placeholder = "Verbe conjugué";
                    input.addEventListener("input", () => {
                        let i = question.elements.pronoms.indexOf(thInputAdded);
                        if (!question.eval.reponse.verbes[i]) question.eval.reponse.verbes[i] = [];
                        question.eval.reponse.verbes[i][j] = input.value;
                        tableauCreate(question);
                        updateLocalStorage();
                    });

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
                question.eval.reponse.pronoms.pop();
                question.elements.pronoms.pop();
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

/**
 * Ajoute les deux boutons de paramètre
 * @param {HTMLDivElement} divA - div où insérer l'élément
 * @param {HTMLDivElement} questionElement - div de la question entière
 * @param {object} question - objet question
 */
function params(divA, questionElement, question) {
    const paramsButton = document.createElement("button");
    paramsButton.textContent = "⚙";
    paramsButton.addEventListener("click", () => {
        if (question.elements.popup.style.display == "none") {
            question.elements.popup.style.display = "block";
        } else {
            question.elements.popup.style.display = "none";
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
