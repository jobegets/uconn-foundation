import os
from dotenv import load_dotenv
from openai import OpenAI
from openai.types.chat import ChatCompletion

load_dotenv()

client = OpenAI(
        base_url="https://api.groq.com/openai/v1",
        api_key=os.environ.get("GROQ_API_KEY")
    )

CONTEXT : str = (
    "You are part of an AI assistant tasked with generating structured study roadmaps.\n"
    "You will be given a summary of a topic. Your task is to identify and extract the foundational topics necessary to understand that subject\n"
    "Your response should return important foundational topics in this format:\n"
    "- One topic per line\n"
    "- No explanations\n"
    "- No numbering\n"
    "- Maximum 8 topics\n"
    "- NO ADDITIONAL TEXT\n"
    "\n"
    "For example, if the summary is about evaporation, a response would be\n"
    "phase change\n"
    "states of matter\n"
)

def find_important(user_prompt : str):
    message = []
    message.append({"role": "system", "content": CONTEXT})
    message.append({"role": "user", "content": user_prompt})

    try:
        response : ChatCompletion = client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=message,
            max_completion_tokens=500,
            temperature=0.4,
        )

        parsed_response = str(response.choices[0].message.content)
        topics = parsed_response.split('\n')

        return topics

    except Exception as e:
        raise Exception(f'Error in find_important: ${e}')
