from flask import Blueprint, request, jsonify
import torch
import ollama
from openai import OpenAI
import boto3
import os

from service.s3_service import list_files_in_s3,get_txt_file_from_s3

rag_bp = Blueprint('rag', __name__)

# Configuration de l'API Ollama
ollama_model = "llama3"
client = OpenAI(
    base_url='http://localhost:11434/v1',
    api_key=ollama_model
)

# Fonction utilitaire pour récupérer les contenus du S3
def load_vault_from_s3():
    files = list_files_in_s3("uploads/")
    vault_content = []
    for file in files:
        tmp_file_path = get_txt_file_from_s3(file)
        if tmp_file_path is not None :
            with open(tmp_file_path, "r", encoding="utf-8") as f:
                vault_content += f.readlines()
            os.remove(tmp_file_path)
    return vault_content

# Fonction pour récupérer les contextes les plus pertinents
def get_relevant_context(prompt, vault_embeddings, vault_content, top_k=3):
    if vault_embeddings.nelement() == 0:
        return []
    input_embedding = ollama.embeddings(model=ollama_model, prompt=prompt)["embedding"]
    cos_scores = torch.cosine_similarity(torch.tensor(input_embedding).unsqueeze(0), vault_embeddings)
    top_indices = torch.topk(cos_scores, k=min(top_k, len(cos_scores)))[1].tolist()
    return [vault_content[idx].strip() for idx in top_indices]

@rag_bp.route('/rag/chat', methods=['POST'])
def rag_chat():
    data = request.json
    question = data.get("question", "")
    msg = data.get("messages", [])
    

    if not question:
        for msg in messages:
            if msg["role"] == "user":
                question = msg["content"]
                break
        if not question :
            return jsonify({"error": "Question is required"}), 400

    # Charger documents depuis S3
    vault_content = load_vault_from_s3()

    # Générer les embeddings
    vault_embeddings = []
    for line in vault_content:
        response = ollama.embeddings(model=ollama_model, prompt=line)
        vault_embeddings.append(response["embedding"])
    vault_embeddings_tensor = torch.tensor(vault_embeddings)

    # Obtenir contexte pertinent
    relevant_context = get_relevant_context(question, vault_embeddings_tensor, vault_content)
    context_str = "\n".join(relevant_context)
    user_input_with_context = context_str + "\n\n" + question if relevant_context else question

    # Lancer le chat avec ollama
    messages = [
        {"role": "system", "content": "You are a helpful assistant that helps answer based on documents."},
        {"role": "user", "content": user_input_with_context}
    ]

    response = client.chat.completions.create(
        model=ollama_model,
        messages=messages,
        temperature=0.8
    )
    answer = response.choices[0].message.content
    if len(answer)==0 :
        answer = "Désolé, nous n'avons pas compris votre demande"
    if len(msg)==0 :
        return jsonify({"answer": answer, "context_used": relevant_context})
    else :
        return response;
