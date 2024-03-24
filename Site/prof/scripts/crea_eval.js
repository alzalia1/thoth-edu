import { addTrad, addConjug, questions } from "./modules/addQuestions.js";

addEventListener("DOMContentLoaded", () => {
    const questionsDiv = document.getElementById("questionsList");

    addTrad(questionsDiv);

    const addQuestionButton = document.getElementById("addQuestion");
    addQuestionButton.addEventListener("click", () => {
        addConjug(questionsDiv);
    });
});

window.getQuestions = function () {
    return questions;
};
