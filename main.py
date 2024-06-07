from flask import Flask, request, jsonify, render_template, Response
import openai
import os
from dotenv import load_dotenv


load_dotenv() #permet de charger les variables d'environnement du fichier .env

openai.api_key = os.getenv("CLES_CHATGPT") #sert à récupérer la clé API dans le fichier .env

main = Flask (__name__)

@main.route("/")
def home():
    return render_template("index.html")



@main.route("/prompt", methods=["POST"]) #route qui permet de récupérer les données du formulaire
def prompt():
    message = request.json("message") #récupère le message du formulaire sous forme de JSON
    conversation = build_coversation_dict(message) #crée un dictionnaire de conversation
    
    return Response(event_stream(conversation), minetype='text/event-stream') #renvoie un flux d'événements et minetype sert à spécifier le type de contenu de la réponse



def build_coversation_dict(message: list) -> list[dict]: #fonction qui permet de construire un dictionnaire de conversation
    return [
        {"role": "user" if i % 2 == 0 else "assistant", "content": message } #si i est pair, le rôle est "user", sinon le rôle est "assistant"
        for i, message in enumerate(message)
            ]
    

def event_stream(conversation: list[dict]) -> str: #fonction qui permet de générer un flux d'événements
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=conversation,
        stream=True
    )
    
    for event in response:
        text = event.choices[0].delta.get('content', '') #récupère le contenu de l'événement
        if len(text): #si le texte n'est pas vide
            yield text #renvoie le contenu de l'événement


if __name__ == "__main__":
    main.run(debug=True, host="localhost", port=5000)
    # conversation=build_coversation_dict(message=["Bonjour, Comment ça va ?", "Je vais bien, merci ! Et vous ?"]) #test de la fonction build_conversation_dict
    # for event in event_stream(conversation): 
    #     print(event)