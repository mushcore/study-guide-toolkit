---
paths:
  - "generated/flashcards/**"
---
# Flashcard Quality Gate

Before saving any flashcard file, self-check every card against these criteria:
1. Answer is 1-15 words (hard limit)
2. Question has exactly one valid answer
3. No enumeration or list-recall questions
4. Source reference present
5. Bloom's level tagged
6. No card duplicates content from another card in the same file

If any card fails, fix it before saving. Report the fix count in the file header.
