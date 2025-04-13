import fitz  # PyMuPDF
import docx

def extract_text_from_pdf(path):
    text = ""
    doc = fitz.open(path)
    for page in doc:
        text += page.get_text()
    return text

def extract_text_from_docx(path):
    doc = docx.Document(path)
    return "\n".join([para.text for para in doc.paragraphs])

def extract_text(path, file_type):
    if file_type == "pdf":
        return extract_text_from_pdf(path)
    elif file_type == "docx":
        return extract_text_from_docx(path)
    elif file_type == "txt":
        with open(path, "r", encoding="utf-8") as f:
            return f.read()
    else:
        raise ValueError("Unsupported file type")
