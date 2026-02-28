import json
from typing import Dict
from generate_summary import generate_summary
from find_important import find_important

class Child:
    def __init__(self, topic, summary) -> None:
        self.topic = topic
        self.summary = summary

class Parent(Child):
    def __init__(self, topic, summary, children=None) -> None:
        super().__init__(topic, summary)
        #self.children : list[Child] | list[Dict] = children or []
        self.children = children or []
    
    def __repr__(self) -> str:
        return super().__repr__()

def handle_chat(user_prompt : str):
    # make a brief summary about the subject and pick out key topics
    parent_total_summary = generate_summary(user_prompt).split('\n')
    parent_topic = parent_total_summary[0].strip().capitalize()
    parent_summary = parent_total_summary[1]

    parent = Parent(parent_topic, parent_summary)

    parent_topics = find_important(parent_summary)[-2:] #DELETE -2

    for topic in parent_topics:
        child_total_summary = generate_summary(topic).split('\n')
        child_topic = child_total_summary[0].strip().capitalize()
        child_summary = child_total_summary[1]

        child = Child(child_topic, child_summary)
        #jjson_child = json.dumps(child.__dict__, indent=2)
        
        parent.children.append(child.__dict__)

    json_parent = json.dumps(parent.__dict__, indent=2)
    return json_parent

