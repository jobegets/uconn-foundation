import os
from dotenv import load_dotenv
from openai import OpenAI
from openai.types.chat import ChatCompletion

load_dotenv()

CONTEXT : str = (
    "You are an AI assistant tasked with generating structured study roadmaps.\n"
    "When a user asks to learn a specific subject you will will:\n"
    "1. Generate a brief definition of the subject\n"
    "2. Pick out key terms that are foundational to that subject\n"
    "For example if a user wants to learn evaporation. It should generate a summary of what evaporation is and pick out key terms from that summary such as phase change and states of matter.\n"
)

client = OpenAI(
        base_url="https://api.groq.com/openai/v1",
        api_key=os.environ.get("GROQ_API_KEY")
    )

def handle_chat(user_prompt : str):
    message = []
    message.append({"role": "system", "content": CONTEXT})
    message.append({"role": "user", "content": user_prompt})

    #user history?
    #message.append({"role": "assistant", "content": user_prompt})

    try:
        response : ChatCompletion = client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=message,
            #tools=TOOLS,
            #tool_choice="auto",
            max_completion_tokens=500,
            temperature=0.4,
        )

        parsed_response = response.choices[0].message.content

        
    except Exception as e:
        print(f'Error trying to access LLM: ${e}')



handle_chat('hello chatgpt!')
