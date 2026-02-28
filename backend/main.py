from fastapi import FastAPI
from llm.main_llm import handle_chat

app = FastAPI()

@app.get("/")
def root():
    return 'poop'
#poop?

@app.get("/studymap")
def read_root(prompt: str):
    return handle_chat(prompt)
