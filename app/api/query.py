from fastapi import APIRouter
from pydantic import BaseModel

from app.services.llm import ask_question as llm_ask

router = APIRouter()


class AskRequest(BaseModel):
    question: str


@router.post("/ask")
def ask_question(request: AskRequest):
    answer = llm_ask(request.question)
    return {"question": request.question, "answer": answer}
