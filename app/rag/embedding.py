from langchain_openai import OpenAIEmbeddings

model = OpenAIEmbeddings()


def get_embeddings(chunks: list[str]) -> list[list[float]]:
    embeddings = model.embed_documents(chunks)
    return embeddings
