import { addQuestion } from "./modules/addQuestions.js";

addEventListener("DOMContentLoaded", () => {
    const questionsDiv = document.getElementById("questionsList");

    addQuestion(questionsDiv);

    const addQuestionButton = document.getElementById("addQuestion");
    addQuestionButton.addEventListener("click", () => {
        addQuestion(questionsDiv);
    });
});
