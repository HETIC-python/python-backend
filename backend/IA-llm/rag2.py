import torch
import ollama
import os
from flask import Flask, request, jsonify
import argparse

# ANSI escape codes for colors
PINK = '\033[95m'
CYAN = '\033[96m'
YELLOW = '\033[93m'
NEON_GREEN = '\033[92m'
RESET_COLOR = '\033[0m'
TEMPERATURE = 2

# Initialize Flask app
app = Flask(__name__)

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

# Function to get relevant context from the vault based on user input
def get_relevant_context(rewritten_input, vault_embeddings, vault_content, top_k=3):
    if vault_embeddings.nelement() == 0:
        return []
    input_embedding = ollama.embeddings(model=args.model, prompt=rewritten_input)["embedding"]
    cos_scores = torch.cosine_similarity(torch.tensor(input_embedding).unsqueeze(0), vault_embeddings)
    top_k = min(top_k, len(cos_scores))
    top_indices = torch.topk(cos_scores, k=top_k)[1].tolist()
    relevant_context = [vault_content[idx].strip() for idx in top_indices]
    return relevant_context

# API endpoint for chat
@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_input = data.get("user_input", "")
    conversation_history = data.get("conversation_history", [])
    system_message = "You are a helpful assistant that is an expert at extracting the most useful information from a given text"

    # Get relevant context from the vault
    relevant_context = get_relevant_context(user_input, vault_embeddings_tensor, vault_content, top_k=3)
    context_str = "\n".join(relevant_context) if relevant_context else ""

    # Prepare the user's input by concatenating it with the relevant context
    user_input_with_context = context_str + "\n\n" + user_input if relevant_context else user_input

    # Append the user's input to the conversation history
    conversation_history.append({"role": "user", "content": user_input_with_context})

    # Send the completion request to the Ollama model
    response = ollama.chat(model=args.model, messages=conversation_history, temperature=TEMPERATURE)
    
    # Append the model's response to the conversation history
    conversation_history.append({"role": "assistant", "content": response["message"]})
    
    return jsonify({"response": response["message"], "conversation_history": conversation_history})

# Run the server
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=6000)  # Run the Flask server
