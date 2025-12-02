from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from sentence_transformers import SentenceTransformer
from transformers import pipeline
import numpy as np
import os


app = FastAPI(title="Chat API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    transaction_list: Transactions

class ChatResponse(BaseModel):
    response: str

class Transactions(BaseModel):
    history: List[str]


@app.get("/")
async def root():
    return {"message": "Chat API running smoothly"}

@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    #placeholder, still gotta hook up the rag here
    chat_response = llmcall(request.message, request.transaction_list)
    return ChatResponse(response=chat_response)

async def llmcall(query, transaction_data):
    generator = pipeline("text2text-generation", model="google/flan-t5-small")

    prompt = f"""Answer the question based on the context below. If the answer is not contained within the text, say "I don't know".
    Context: {transaction_data}
    Question: {query}
    Answer:"""

    print("Generating answer...")
    response = generator(prompt, max_length=150)
    return response[0]['generated_text']