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
    "The user will provide a prompt and you will teach the user as if it were their first time seeing this topic\n"
    "Guidelines:\n"
    " - Begin the first line with the subject and the next line will be the entire summary\n"
    " - Make sure to include essential foundational terms that the user should know.\n"
    " - Explain the bare minimum and include bare minimum terms\n"
    " - Minimize the definition as much as possible\n"
    " - Have 1-6 sentences\n"
    " - Minimize the amount of term generated\n"
    " - Use only ASCII text\n"
    " - Do NOT include formulas and symbols\n"
)

def generate_summary(user_prompt : str, prior_parent=None) -> str:
    message = []
    message.append({"role": "system", "content": CONTEXT})
    message.append({"role": "user", "content": user_prompt})

    # maintain context, parent term
    if(prior_parent): 
        message.append({"role": "assistant", "content": f'This is in relation to {prior_parent}'})

    try:
        response : ChatCompletion = client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=message,
            max_completion_tokens=500,
            temperature=0.9,
        )

        parsed_response = str(response.choices[0].message.content)

        return parsed_response

    except Exception as e:
        raise Exception(f'Error in generate_summary: ${e}')
