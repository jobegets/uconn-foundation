import unittest

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
