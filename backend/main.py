from fastapi import FastAPI
from llm.main_llm import handle_chat
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    'http://localhost:5173',
    'https://uconn-foundation.vercel.app/'
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/studymap")
def read_root(prompt: str):
    return handle_chat(prompt)
