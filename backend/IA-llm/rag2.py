import torch
import ollama
import os
from flask import Flask, request, jsonify
import argparse
from flask_cors import CORS
import requests

# ANSI escape codes for colors
PINK = '\033[95m'
CYAN = '\033[96m'
YELLOW = '\033[93m'
NEON_GREEN = '\033[92m'
RESET_COLOR = '\033[0m'
TEMPERATURE = 2

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for Open WebUI compatibility

# Parse command-line arguments
parser = argparse.ArgumentParser(description="Ollama Chat")
parser.add_argument("--model", default="llama3.2", help="Ollama model to use (default: llama3)")
args = parser.parse_args()

# Load the vault content
vault_content = []
if os.path.exists("rag_data.txt"):
    with open("rag_data.txt", "r", encoding='utf-8') as vault_file:
        vault_content = vault_file.readlines()

# Generate embeddings for the vault content using Ollama
vault_embeddings = []
for content in vault_content:
    response = ollama.embeddings(model=args.model, prompt=content)
    vault_embeddings.append(response["embedding"])

# Convert to tensor
vault_embeddings_tensor = torch.tensor(vault_embeddings)

def get_relevant_context(rewritten_input, vault_embeddings, vault_content, top_k=3):
    if vault_embeddings.nelement() == 0:
        return []
    
    input_embedding = ollama.embeddings(model=args.model, prompt=rewritten_input).get("embedding")
    
    if not input_embedding:
        print("Error: Empty input embedding.")
        return []
    
    cos_scores = torch.cosine_similarity(torch.tensor(input_embedding).unsqueeze(0), vault_embeddings)
    top_k = min(top_k, len(cos_scores))
    top_indices = torch.topk(cos_scores, k=top_k)[1].tolist()
    relevant_context = [vault_content[idx].strip() for idx in top_indices]
    return relevant_context

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_input = data.get("user_input", "")
    conversation_history = data.get("conversation_history", [])
    system_message = "You are a helpful assistant that is an expert at extracting the most useful information from a given text"

    relevant_context = get_relevant_context(user_input, vault_embeddings_tensor, vault_content, top_k=3)
    context_str = "\n".join(relevant_context) if relevant_context else ""

    user_input_with_context = context_str + "\n\n" + user_input if relevant_context else user_input

    conversation_history.append({"role": "user", "content": user_input_with_context})

    response = ollama.chat(model=args.model, messages=conversation_history, options={'temperature': TEMPERATURE})
    assistant_message = response["message"]["content"]
    conversation_history.append({"role": "assistant", "content": assistant_message})

    return jsonify({"response": assistant_message, "conversation_history": conversation_history})

# OpenAI-compatible endpoints
@app.route('/v1/chat/completions', methods=['POST'])
def openai_chat():
    data = request.json
    
    # Convert OpenAI format to our format
    messages = data["messages"]
    user_message = next((msg["content"] for msg in reversed(messages) if msg["role"] == "user"), "")
    
    # Call existing chat endpoint
    chat_response = requests.post(
        "http://localhost:4040/chat",
        json={
            "user_input": user_message,
            "conversation_history": messages
        }
    )
    
    return jsonify({
        "choices": [{
            "message": {
                "role": "assistant",
                "content": chat_response.json()["response"]
            }
        }],
        "usage": {
            "prompt_tokens": 0,
            "completion_tokens": 0,
            "total_tokens": 0
        }
    })

@app.route('/v1/models', methods=['GET'])
def list_models():
    return jsonify({
        "data": [{
            "id": args.model,
            "object": "model",
            "created": 1686935002,
            "owned_by": "ollama"
        }]
    })

@app.route('/v1/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=4040)
