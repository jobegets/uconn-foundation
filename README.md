## Overview

Foundation is an AI-powered structured learning tool designed to break down complex subjects into foundational concepts. Instead of generating flat summaries, Foundation recursively decomposes topics into prerequisite ideas, creating a structured roadmap for deeper understanding.

Built in 20 hours at HackUConn 2026, the project focuses on transforming LLM output into deterministic, structured knowledge graphs suitable for learning applications.



## Problem

Most AI tools generate summaries, but they do not help users understand what they need to know first.

Learners often struggle because:
	•	Concepts build on hidden prerequisites
	•	Summaries lack structural depth
	•	Learning paths are not explicitly mapped

Foundation solves this by converting a topic into a hierarchical roadmap of foundational knowledge.



## How to use?
1. Load a `.env` API Key in `backend/`
2. `yarn run dev` in `frontend/`
3. `fastapi run main.py` in `backend/`
