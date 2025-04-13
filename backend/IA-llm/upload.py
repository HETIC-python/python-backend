import os
import PyPDF2
import re
import json

def convert_pdf_to_text(file_name):
    file_path = file_name
    if file_path:
        with open(file_path, 'rb') as pdf_file:
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            num_pages = len(pdf_reader.pages)
            text = ''
            for page_num in range(num_pages):
                page = pdf_reader.pages[page_num]
                if page.extract_text():
                    text += page.extract_text() + " "
            
            text = re.sub(r'\s+', ' ', text).strip()
            
            sentences = re.split(r'(?<=[.!?]) +', text)
            chunks = []
            current_chunk = ""
            for sentence in sentences:
                if len(current_chunk) + len(sentence) + 1 < 1000: 
                    current_chunk += (sentence + " ").strip()
                else:
                    chunks.append(current_chunk)
                    current_chunk = sentence + " "
            if current_chunk: 
                chunks.append(current_chunk)
            with open("rag_data.txt", "a", encoding="utf-8") as vault_file:
                for chunk in chunks:
                    vault_file.write(chunk.strip() + "\n")
            print(f"PDF content appended to rag_data.txt with each chunk on a separate line.")

def upload_txtfile(file_name):
    file_path = file_name 
    if file_path:
        with open(file_path, 'r', encoding="utf-8") as txt_file:
            text = txt_file.read()
            
            text = re.sub(r'\s+', ' ', text).strip()
            
            sentences = re.split(r'(?<=[.!?]) +', text) 
            chunks = []
            current_chunk = ""
            for sentence in sentences:
                if len(current_chunk) + len(sentence) + 1 < 1000: 
                    current_chunk += (sentence + " ").strip()
                else:
                    chunks.append(current_chunk)
                    current_chunk = sentence + " "
            if current_chunk: 
                chunks.append(current_chunk)
            with open("rag_data.txt", "a", encoding="utf-8") as vault_file:
                for chunk in chunks:
                    vault_file.write(chunk.strip() + "\n")
            print(f"Text file content appended to rag_data.txt with each chunk on a separate line.")

def upload_jsonfile(file_name):
    file_path = file_name 
    if file_path:
        with open(file_path, 'r', encoding="utf-8") as json_file:
            data = json.load(json_file)
            
            text = json.dumps(data, ensure_ascii=False)
            
            text = re.sub(r'\s+', ' ', text).strip()
            
            sentences = re.split(r'(?<=[.!?]) +', text) 
            chunks = []
            current_chunk = ""
            for sentence in sentences:
                if len(current_chunk) + len(sentence) + 1 < 1000: 
                    current_chunk += (sentence + " ").strip()
                else:
                    chunks.append(current_chunk)
                    current_chunk = sentence + " "
            if current_chunk: 
                chunks.append(current_chunk)
            with open("rag_data.txt", "a", encoding="utf-8") as vault_file:
                for chunk in chunks:
                    vault_file.write(chunk.strip() + "\n") 
            print(f"JSON file content appended to rag_data.txt with each chunk on a separate line.")
