function cloneAnswerBlock(){
    const output = document.querySelector("#gpt-output"); // sert à récupérer l'élément où on veut ajouter le template
    const template = document.querySelector("#chat-template"); // sert à récupérer le template
    const clone = template.cloneNode(true); // sert à copier le template
    clone.id = ""; // sert à enlever l'id du template (reinitialise id = chat-template)
    output.appendChild(clone); // sert à ajouter le clone au bon endroit
    clone.classList.remove("hidden"); // sert à enlever la classe hidden du clone
    return clone.querySelector(".message"); // sert à retourner l'élément où on veut ajouter le texte
}

function addToLog(message){
    const answerBlock = cloneAnswerBlock(); // sert à récupérer l'élément où on veut ajouter le texte
    answerBlock.innerText = message; // sert à ajouter le texte
    return answerBlock;
}

function getChatHistory(){
    const messageBlocks = document.querySelectorAll(".message:not(#chat-template .message)"); // sert à récupérer tous les éléments avec la classe message a part celui avec l'id chat-template
    return Array.from(messageBlocks).map(block => block.innerHTML); // sert à retourner un tableau avec le contenu de chaque élément
}  

async function fetchPromptResponse(){ // sert à envoyer une requête POST à l'API
    await fetch("/prompt", { 
        method: "POST",
        headers: {
            "Content-Type": "application/json" // sert à dire que le contenu est en JSON
        },
        body: JSON.stringify({"message" : getChatHistory()}) // sert à envoyer le contenu de la conversation
    })
}


document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#prompt-form"); // sert à récupérer le formulaire
    const spinnerIco = document.querySelector("#spinner-icon"); // sert à récupérer l'icone de chargement
    const selndIcon = document.querySelector("#send-icon"); // sert à récupérer l'icone d'envoi

    form.addEventListener("submit", async (event) => {
        event.preventDefault(); // sert à empêcher le formulaire de se soumettre
        spinnerIco.classList.remove("hidden"); // sert à enlever la classe hidden de l'icone de chargement
        selndIcon.classList.add("hidden"); // sert à ajouter la classe hidden de l'icone d'envoi

        const prompt = form.elements.prompt.value; // sert à récupérer la valeur de l'input avec le nom prompt
        addToLog(prompt); // sert à ajouter le prompt à la conversation
    });
});