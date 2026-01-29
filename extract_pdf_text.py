import PyPDF2
import os

pdf_path = r'c:\Users\USER\Documents\GitHub\cv_omar\public\cv_english.pdf'

def extract_text():
    if not os.path.exists(pdf_path):
        print(f"File not found: {pdf_path}")
        return

    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        print(text)

if __name__ == "__main__":
    extract_text()
