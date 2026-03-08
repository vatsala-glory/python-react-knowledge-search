from db.vectorstore import vector_db


def retrieve_similar_chunks(query: str, k: int = 4) -> list[str]:
    docs = vector_db.similarity_search(query, k=k)
    return [doc.page_content for doc in docs]
