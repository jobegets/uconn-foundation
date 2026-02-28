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
    "The user will provide a prompt and you will provide a brief yet simple paragraph of that subject.\n"
    "Guidelines:\n"
    " - Make sure to include key foundational terms that the user should know.\n"
    " - Use only ASCII text\n"
    " - Begin the first line with the subject and the next line will be the entire summary\n"
)

def generate_summary(user_prompt : str) -> str:
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

        return parsed_response

    except Exception as e:
        print(f'Error in generate_summary: ${e}')
        raise Exception(f'Error in generate_summary: ${e}')
