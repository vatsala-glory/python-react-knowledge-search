from langchain_chroma import Chroma

from app.rag.embedding import model as embedding_model

vector_db = Chroma(
    collection_name="documents",
    embedding_function=embedding_model,
    persist_directory="./chroma_db",
)


def add_documents(chunks: list[str], doc_id: int, filename: str):
    metadatas = [{"doc_id": doc_id, "filename": filename} for _ in chunks]
    vector_db.add_texts(texts=chunks, metadatas=metadatas)


def get_all_documents() -> list[dict]:
    results = vector_db.get()
    docs = {}
    for metadata in results.get("metadatas", []):
        if metadata:
            doc_id = metadata.get("doc_id")
            if doc_id not in docs:
                docs[doc_id] = {"id": doc_id, "filename": metadata.get("filename")}
    return list(docs.values())
