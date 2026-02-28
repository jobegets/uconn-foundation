from openai import OpenAI

CONTEXT : str = (
    "You are an AI assistant tasked with generating structured study roadmaps.\n"
    "When a user asks to learn a specific subject you will will:\n"
    "1. Generate a brief definition of the subject\n"
    "2. Pick out key terms that are foundational to that subject\n"
    "For example if a user wants to learn evaporation. It should generate a summary of what evaporation is and pick out key terms from that summary such as phase change and states of matter.\n"
)

def handle_chat(user_prompt):
    message = []
    message.append({"role": "system", "content": CONTEXT})
    message.append({"role": "user", "content": user_message})

