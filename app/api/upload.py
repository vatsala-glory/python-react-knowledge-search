from io import BytesIO

from fastapi import APIRouter, UploadFile, File
from pypdf import PdfReader

from app.rag.splitter import split_text
from db.vectorstore import add_documents, get_all_documents, delete_documents

router = APIRouter()

doc_counter = 0


@router.post("/upload-document")
async def upload_document(file: UploadFile = File(...)):
    global doc_counter
    content = await file.read()
    filename = file.filename or ""
    
    if filename.lower().endswith(".pdf"):
        reader = PdfReader(BytesIO(content))
        text_content = ""
        for page in reader.pages:
            text_content += page.extract_text() or ""
    else:
        try:
            text_content = content.decode("utf-8")
        except UnicodeDecodeError:
            text_content = content.decode("latin-1")
    
    chunks = split_text(text_content)
    doc_counter += 1
    add_documents(chunks, doc_id=doc_counter, filename=filename)
    
    return {
        "message": "Document uploaded successfully",
        "document_id": doc_counter,
        "num_chunks": len(chunks),
    }


@router.get("/documents")
def get_documents():
    return {"documents": get_all_documents()}

@router.delete("/delete-document/{document_id}")
def delete_document(document_id: int):
    delete_documents(document_id)
    return {"message": "Document deleted successfully"}