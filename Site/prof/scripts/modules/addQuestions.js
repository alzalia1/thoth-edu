export let questions = [];

/**
 *
 * TODO : Les sous-consignes..
 */

export function addTrad(questionsDiv) {
    const questionElement = document.createElement("div");
    questionElement.className = "question";

    let question = {
        elements: {
            div: questionElement,
            title: "",
            preview: "",
            popup: "",
            pluriel: false,
            genre: false,
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

    function entete() {
        const questionNumber = document.createElement("h3");
        questionNumber.textContent = "Question n°" + (questions.length + 1);

        questionElement.appendChild(questionNumber);
        question.elements.title = questionNumber;
    }
    entete();

    function divA() {
        const divA = document.createElement("div");

        function consigne() {
            const consigneLabel = (document.createElement("label").textContent = "Consigne : ");

            const consigneInput = document.createElement("input");
            consigneInput.type = "text";
            consigneInput.placeholder = "Consigne de la question";
            consigneInput.addEventListener("input", () => {
                question.eval.consigne = consigneInput.value;
                question.elements.preview.textContent = consigneInput.value;
            });

            divA.append(consigneLabel, consigneInput);
        }
        consigne();

        divA.append(document.createElement("br"));

        function reponse() {
            const reponseLabel = (document.createElement("label").textContent = "Réponse : ");

            const reponseInput = document.createElement("input");
            reponseInput.type = "text";
            reponseInput.placeholder = "Réponse attendue";
            reponseInput.addEventListener("input", () => {
                question.eval.reponse = reponseInput.value;
            });

            divA.append(reponseLabel, reponseInput);
        }
        reponse();

        divA.append(document.createElement("br"));

        function params() {
            const paramsButton = document.createElement("button");
            paramsButton.addEventListener("click", () => {
                question.elements.popup.hidden = !question.elements.popup.hidden;
            });

            const deleteButton = document.createElement("button");
            deleteButton.addEventListener("click", () => {
                questionsDiv.removeChild(questionElement);
                questions.splice(
                    questions.findIndex((q) => q.elements.div == questionElement),
                    1
                );
                renameAllQuestions();
            });

            divA.append(paramsButton, deleteButton);
        }
        params();

        questionElement.appendChild(divA);
    }
    divA();

    function divPreview() {
        const divPreview = document.createElement("div");

        const titrePreview = document.createElement("h4");
        titrePreview.textContent = "Aperçu de l'élève";

        const consigneLabel = document.createElement("label");
        consigneLabel.textContent = question.eval.consigne;

        const reponseInput = document.createElement("input");
        reponseInput.type = "text";
        reponseInput.placeholder = "Écrivez votre réponse ici";

        divPreview.append(titrePreview, consigneLabel, reponseInput);
        questionElement.appendChild(divPreview);
        question.elements.preview = consigneLabel;
    }
    divPreview();

    function divPopup() {
        const divPopup = document.createElement("div");
        divPopup.hidden = true;

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
            });

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
            });

            divPopup.append(accentsLabel, accentsInput);
        }
        accents();

        divPopup.append(document.createElement("br"));

        function pluriel() {
            const plurielLabel = document.createElement("label");
            plurielLabel.textContent = "Pluriel : ";

            const plurielInput = document.createElement("input");
            plurielInput.type = "checkbox";
            plurielInput.checked =
                questions.length != 0 ? questions[questions.length - 1].elements.pluriel : false;

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
                    });

                    tagElement.appendChild(deleteButton);
                    motsDiv.insertBefore(tagElement, this);

                    this.value = "";
                }
            });

            // Back to plurielInput

            plurielInput.addEventListener("input", () => {
                plurielMotsInput.hidden = !plurielMotsInput.hidden;
                question.elements.pluriel = plurielInput.checked;
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
                    });

                    tagElement.appendChild(deleteButton);
                    motsDiv.insertBefore(tagElement, this);

                    this.value = "";
                }
            });

            genreInput.addEventListener("input", () => {
                genreMotsInput.hidden = !genreMotsInput.hidden;
                question.elements.genre = genreInput.checked;
            });

            motsDiv.append(genreMotsInput);
            divPopup.append(genreLabel, genreInput, motsDiv);
        }
        genre();

        questionElement.appendChild(divPopup);
        question.elements.popup = divPopup;
    }
    divPopup();

    questionsDiv.appendChild(questionElement);
    questions.push(question);
}

export function addConjug(questionsDiv) {
    const questionElement = document.createElement("div");
    questionElement.className = "question";

    let question = {
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

    function entete() {
        const questionNumber = document.createElement("h3");
        questionNumber.textContent = "Question n°" + (questions.length + 1);

        questionElement.appendChild(questionNumber);
        question.elements.title = questionNumber;
    }
    entete();

    function divA() {
        const divA = document.createElement("div");

        function consigne() {
            const consigneLabel = (document.createElement("label").textContent = "Verbe : ");

            const consigneInput = document.createElement("input");
            consigneInput.type = "text";
            consigneInput.placeholder = "Verbe à conjuguer";
            consigneInput.addEventListener("input", () => {
                question.eval.consigne = consigneInput.value;
                question.elements.preview.textContent = consigneInput.value;
                tableauCreate(question);
            });

            divA.append(consigneLabel, consigneInput);
        }
        consigne();

        divA.append(document.createElement("br"));

        function tableau() {
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
                question.eval.reponse.temps.push(firstInput.value);
                firstInput.addEventListener("input", () => {
                    question.eval.reponse.temps[0] = firstInput.value;
                    question.elements.temps[0] = firstInput;
                    tableauCreate(question);
                });
                first.appendChild(firstInput);
                theadRow.appendChild(first);

                //* Buttons

                // Delete
                const deleteButton = document.createElement("button");
                deleteButton.textContent = "-";
                deleteButton.disabled = true;
                deleteButton.addEventListener("click", () => {
                    // Remove element
                    theadRow.removeChild(theadRow.lastChild.previousSibling.previousSibling);
                    question.elements.temps.pop();

                    // Remove lines end
                    for (let i = 0; i < question.elements.pronoms.length; i++) {
                        let row = question.elements.pronoms[i].parentElement.parentElement;
                        let elements = row.getElementsByTagName("td");
                        let lastElement = elements[elements.length - 1];
                        lastElement.remove();
                    }

                    if (
                        theadRow.lastChild.previousSibling.previousSibling.previousSibling === empty
                    ) {
                        deleteButton.disabled = true;
                    } else {
                        deleteButton.disabled = false;
                    }
                    tableauCreate(question);
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
                            if (!question.eval.reponse.verbes[i])
                                question.eval.reponse.verbes[i] = [];
                            question.eval.reponse.verbes[i][j] = subInput.value;
                            tableauCreate(question);
                        });

                        let row = question.elements.pronoms[i].parentElement.parentElement;
                        td.appendChild(subInput);
                        row.appendChild(td);
                    }

                    if (
                        theadRow.lastChild.previousSibling.previousSibling.previousSibling === empty
                    ) {
                        deleteButton.disabled = true;
                    } else {
                        deleteButton.disabled = false;
                    }
                    tableauCreate(question);
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

                // First pronoun
                const th = document.createElement("th");
                const thInput = document.createElement("input");
                thInput.type = "text";
                thInput.placeholder = "Personne";
                thInput.addEventListener("input", () => {
                    question.eval.reponse.pronoms[0] = thInput.value;
                    question.elements.pronoms[0] = thInput;
                    tableauCreate(question);
                });
                th.appendChild(thInput);
                tRow.appendChild(th);
                question.eval.reponse.pronoms.push(thInput.value);
                question.elements.pronoms.push(thInput);

                // First verb
                const td = document.createElement("td");
                const input = document.createElement("input");
                input.type = "text";
                input.placeholder = "Verbe conjugué";
                question.eval.reponse.verbes[0].push(input.value);
                input.addEventListener("input", () => {
                    question.eval.reponse.verbes[0][0] = input.value;
                    tableauCreate(question);
                });

                td.appendChild(input);
                tRow.appendChild(td);
                tbody.appendChild(tRow);

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
                            if (!question.eval.reponse.verbes[i])
                                question.eval.reponse.verbes[i] = [];
                            question.eval.reponse.verbes[i][j] = input.value;
                            tableauCreate(question);
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
                });
                tRowButton.appendChild(deleteButton);

                tbody.appendChild(tRowButton);
                table.appendChild(tbody);
            }
            body();

            divA.appendChild(table);
        }
        tableau();

        function params() {
            const paramsButton = document.createElement("button");
            paramsButton.addEventListener("click", () => {
                question.elements.popup.hidden = !question.elements.popup.hidden;
            });

            const deleteButton = document.createElement("button");
            deleteButton.addEventListener("click", () => {
                questionsDiv.removeChild(questionElement);
                questions.splice(
                    questions.findIndex((q) => q.elements.div == questionElement),
                    1
                );
                renameAllQuestions();
            });

            divA.append(paramsButton, deleteButton);
        }
        params();

        questionElement.appendChild(divA);
    }
    divA();

    function divPreview() {
        const divPreview = document.createElement("div");

        const titrePreview = document.createElement("h4");
        titrePreview.textContent = "Aperçu de l'élève";

        const consigneLabel = document.createElement("label");
        consigneLabel.textContent =
            "Conjuguez le verbe '" +
            question.eval.consigne +
            "' aux temps et personnes suivantes :";

        const reponseInput = document.createElement("table");

        divPreview.append(titrePreview, consigneLabel, reponseInput);
        questionElement.appendChild(divPreview);
        question.elements.preview = consigneLabel;
        question.elements.divPreview = divPreview;
        tableauCreate(question);
    }
    divPreview();

    function divPopup() {
        const divPopup = document.createElement("div");
        divPopup.hidden = true;

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
            });

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
            });

            divPopup.append(accentsLabel, accentsInput);
        }
        accents();

        questionElement.appendChild(divPopup);
        question.elements.popup = divPopup;
    }
    divPopup();

    questionsDiv.appendChild(questionElement);
    questions.push(question);
}

function renameAllQuestions() {
    for (let i = 0; i < questions.length; i++) {
        questions[i].elements.title.textContent = "Question n°" + (i + 1);
    }
}

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
