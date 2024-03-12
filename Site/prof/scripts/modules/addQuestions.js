let questions = [];

export function addQuestion(questionsDiv) {
    // ! Create div for question
    const questionElement = document.createElement("div");
    questionElement.className = "question";

    // Create label for question number
    const questionNumber = document.createElement("h3");
    questionNumber.textContent = "Question n°" + (questions.length + 1);
    questionElement.appendChild(questionNumber);

    /**
     * * Create sideA_Up
     */
    const sideA_Up = document.createElement("div");
    sideA_Up.className = "sideA_Up";
    questionElement.appendChild(sideA_Up);

    consigne = () => {
        // Create label "Consigne"
        const labelConsigne = document.createElement("label");
        labelConsigne.textContent = "Consigne :";
        sideA_Up.appendChild(labelConsigne);

        // Create input for consigne
        const inputConsigne = document.createElement("input");
        inputConsigne.placeholder = "Consigne de la question";
        inputConsigne.type = "text";
        inputConsigne.className = "consigne";
        sideA_Up.appendChild(inputConsigne);
    };
    consigne();

    // Create br
    const br = document.createElement("br");
    sideA_Up.appendChild(br);

    reponse = () => {
        // Create label "Réponse"
        const labelReponse = document.createElement("label");
        labelReponse.textContent = "Réponse :";
        sideA_Up.appendChild(labelReponse);

        // Create input for reponse
        const inputReponse = document.createElement("input");
        inputReponse.placeholder = "Réponse à la question";
        inputReponse.type = "text";
        inputReponse.className = "reponse";
        sideA_Up.appendChild(inputReponse);
    };
    reponse();

    /**
     * ! Create sideA_Down
     */
    const sideA_Down = document.createElement("div");
    sideA_Down.className = "sideA_Down";
    questionElement.appendChild(sideA_Down);

    // Create button params
    const buttonParams = document.createElement("button");
    buttonParams.textContent = "Paramètres";
    buttonParams.className = "params";
    sideA_Down.appendChild(buttonParams);

    /**
     * ! Create params
     */
    const paramsDiv = document.createElement("div");
    paramsDiv.className = "params";
    paramsDiv.hidden = true;
    sideA_Down.appendChild(paramsDiv);

    // Create title
    const paramsTitle = document.createElement("h4");
    paramsTitle.textContent = "Paramètres";
    paramsDiv.appendChild(paramsTitle);

    // ! Create paramsNotation div
    notation = () => {
        const paramsNotationDiv = document.createElement("div");
        paramsNotationDiv.className = "paramsNotation";
        paramsDiv.appendChild(paramsNotationDiv);

        // Create subtitle
        const notationTitle = document.createElement("h5");
        notationTitle.textContent = "Paramètres de notation";
        notationTitle.className = "paramsSubTitle";
        paramsNotationDiv.appendChild(notationTitle);
    };
    notation();

    points = () => {
        const pointsLabel = document.createElement("label");
        pointsLabel.textContent = "Points : ";
        paramsNotationDiv.appendChild(pointsLabel);

        const pointsInput = document.createElement("input");
        pointsInput.type = "number";
        pointsInput.className = "points";
        pointsInput.placeholder = "Points de la question";
        pointsInput.min = 0;
        paramsNotationDiv.appendChild(pointsInput);
    };
    points();

    paramsNotationDiv.appendChild(document.createElement("br"));

    accents = () => {
        // Create accents
        const accentsLabel = document.createElement("label");
        accentsLabel.textContent = "Accents";
        paramsNotationDiv.appendChild(accentsLabel);

        const accentsCheckbox = document.createElement("input");
        accentsCheckbox.type = "checkbox";
        accentsCheckbox.className = "accents";
        paramsNotationDiv.appendChild(accentsCheckbox);
    };
    accents();

    // ! Create paramsConsigne div
    const paramsConsigneDiv = document.createElement("div");
    paramsConsigneDiv.className = "paramsConsigne";
    paramsDiv.appendChild(paramsConsigneDiv);

    // Create subtitle
    const consigneTitle = document.createElement("h5");
    consigneTitle.textContent = "Paramètres de consigne";
    consigneTitle.className = "paramsSubTitle";
    paramsConsigneDiv.appendChild(consigneTitle);

    pluriel = () => {
        // Create plural
        const pluralLabel = document.createElement("label");
        pluralLabel.textContent = "Pluriel";
        paramsConsigneDiv.appendChild(pluralLabel);

        const pluralCheckbox = document.createElement("input");
        pluralCheckbox.type = "checkbox";
        pluralCheckbox.className = "pluriel";
        paramsConsigneDiv.appendChild(pluralCheckbox);
    };
    pluriel();

    paramsConsigneDiv.appendChild(document.createElement("br"));

    // Create button save
    const buttonSave = document.createElement("button");
    buttonSave.textContent = "Sauvegarder";
    buttonSave.className = "save";
    sideA_Down.appendChild(buttonSave);

    // Create button delete
    const buttonDelete = document.createElement("button");
    buttonDelete.textContent = "Supprimer";
    buttonDelete.className = "delete";
    sideA_Down.appendChild(buttonDelete);

    questionsDiv.appendChild(questionElement);

    /**
     * ! Create sideB
     */
    const sideB = document.createElement("div");
    sideB.className = "sideB";
    questionElement.appendChild(sideB);

    preview = () => {
        // Create title
        const sideBTitle = document.createElement("h4");
        sideBTitle.textContent = "Prévisuliation";
        sideB.appendChild(sideBTitle);

        // Create previewConsigne
        const previewConsigne = document.createElement("p");
        previewConsigne.className = "previewConsigne";
        sideB.appendChild(previewConsigne);

        // Create previewSubConsigne
        const previewSubConsigne = document.createElement("p");
        previewSubConsigne.className = "previewSubConsigne";
        sideB.appendChild(previewSubConsigne);

        // Create previewReponse
        const previewReponse = document.createElement("input");
        previewReponse.className = "previewReponse";
        previewReponse.type = "text";
        previewReponse.disabled = true;
        previewReponse.placeholder = "Veuillez écrire votre réponse ici";
        sideB.appendChild(previewReponse);
    };
    preview();

    /**
     * ! Event listeners
     */

    eventListener = () => {
        buttonParams.addEventListener("click", () => {
            paramsDiv.hidden = !paramsDiv.hidden;
        });

        buttonDelete.addEventListener("click", () => {
            questionsDiv.removeChild(questionElement);
            questions.splice(
                questions.findIndex((q) => q.id === br),
                1
            );
            renameAllQuestions();
        });

        pluralCheckbox.addEventListener("change", () => {
            if (pluralCheckbox.checked) {
            } else {
            }
        });

        buttonSave.addEventListener("click", () => {
            let question = {
                id: br,
                titre: questionNumber,
                consigne: inputConsigne.value,
                reponse: inputReponse.value,
                params: buttonParams,
            };
            let index = questions.findIndex((q) => q.id === br);
            questions[index] = question;

            // Update preview
            previewConsigne.textContent = inputConsigne.value;

            if (pluralCheckbox.checked) {
                previewSubConsigne.textContent = "Le pluriel est autorisé. ";
            }
        });

        // Add question to array
        let question = {
            id: br,
            titre: questionNumber,
            consigne: inputConsigne.value,
            reponse: inputReponse.value,
            params: buttonParams,
        };
        questions.push(question);
    };
    eventListener();
}

function renameAllQuestions() {
    for (let i = 0; i < questions.length; i++) {
        questions[i].titre.textContent = "Question n°" + (i + 1);
    }
}

function UpdateOnSave() {
    return;
}
