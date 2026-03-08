from langchain_openai import ChatOpenAI

from app.rag.retriever import retrieve_similar_chunks

llm = ChatOpenAI()


def ask_question(query: str) -> str:
    chunks = retrieve_similar_chunks(query)
    context = "\n\n".join(chunks)
    
    prompt = f"""Use the following context to answer the question. If you cannot find the answer in the context, say "I don't have enough information to answer this question."

Context:
{context}

Question: {query}

Answer:"""
    
    response = llm.invoke(prompt)
    return response.content
