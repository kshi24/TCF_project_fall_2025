from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

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
    #need to pass in transactions here

class ChatResponse(BaseModel):
    response: str

#extra model needed here for transaction history being passed in

@app.get("/")
async def root():
    return {"message": "Chat API running smoothly"}

@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    message = request.message
    #placeholder, still gotta hook up the rag here
    chat_response = f"Echo: {message}"
    return ChatResponse(response=chat_response)

