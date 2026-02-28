from os import pardir
from typing import Dict
import unittest

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
        
        parent.children.append(vars(child))

class Test(unittest.TestCase):
    def test_child(self):
        some_node = Child('poop', 'brown very!')
        self.assertEqual(some_node.topic, 'poop')
        self.assertEqual(some_node.summary, 'brown very!')

    def test_parent(self):
        some_node = Child('pee', 'yellow very!')
        some_parent = Parent('poop', 'brown very!', [some_node])
        self.assertEqual(some_parent.topic, 'poop')
        self.assertEqual(some_parent.summary, 'brown very!')
        self.assertEqual(some_parent.children[0].summary, 'yellow very!')

handle_chat('what is photosynthesis')
