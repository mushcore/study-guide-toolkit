# COMP4870 AI/SLM Exam Study Materials

## File Overview

**research-ai.md** (36 KB, 765 lines)
Comprehensive exam study guide for the 13-mark AI/SLM/Semantic Kernel/MCP/MAF topic

## Content Structure

1. **Topic Summaries** (8 topics, 3-5 sentences each)
   - Semantic Kernel, Ollama, MAF, MCP, Chat Completion, Plugins, Tools, Skills

2. **Key Concepts with Definitions** (14 core concepts)
   - Kernel, ChatHistory, PromptTemplate, AIAgent, AIFunction, AIPlugin, Planner, IChatCompletionService, MCP Server/Client/Tool/Resource

3. **Code Patterns** (VERBATIM from source materials)
   - Ollama setup and SDK integration
   - GitHub Models authentication and endpoint setup
   - MAF agent creation and tool registration
   - Prompt templates and plugin loading
   - NuGet package commands
   - Configuration file examples

4. **Architecture Diagrams** (Described, text format)
   - Kernel → ChatHistory flow
   - MAF agent stack
   - MCP transport types comparison
   - Ollama interaction pattern

5. **20 Flashcards** (SuperMemo 20 Rules, atomic, cloze, source-tagged)
   - Recognition-focused (not deep theory)
   - Each card tagged with source document
   - MCQ-style for exam recognition

6. **Exam Traps & Tricks** (High-leverage mistake prevention)
   - SK vs. MAF differences
   - stdio vs. SSE transport confusion
   - Endpoint URL pitfalls (GitHub vs. Ollama)
   - Local vs. cloud SLM tradeoffs
   - Fake method names (common MCQ distractors)
   - Package naming confusion
   - API key authentication patterns

7. **8 Practice MCQ Questions** (Mirroring exam style)
   - 5 choices (a-e), single correct answer
   - Full explanations and source citations
   - Coverage: MAF, Ollama, endpoints, authentication, SK, SLM

8. **Quick Reference Table**
   - Key classes, methods, examples side-by-side
   - MCP transports comparison

9. **Recommended Study Sequence** (5 days, ~7 hours total)
   - Breakdowns by topic
   - Spaced practice scheduling
   - Time estimates per section

## Study Strategy (55-60% Pass Target)

**Exam Weight**: 13 marks out of ~100  
**Minimum for 55%**: ~7 marks from this topic  

### Prioritize (Heavy ROI):
- [ ] Exact method names: `AsAIAgent()`, `RunAsync()`, `AIFunctionFactory.Create()`
- [ ] Endpoint URLs: GitHub vs. Ollama
- [ ] Package names: `Microsoft.Agents.AI.OpenAI`, `OllamaSharp`
- [ ] Trap differences: SK vs. MAF, local vs. cloud
- [ ] Code patterns: agent creation, tool registration

### De-prioritize (Low ROI):
- Deep transformer theory
- Advanced MCP server implementation
- Multi-agent coordination algorithms
- Fine-tuning details

## Source Materials

All content extracted verbatim from:
1. `CSharp_Meets_AI.pptx` (slides)
2. `SLM.pptx` (slides)
3. `AI-Models_MAF_SCRIPT.docx` (detailed demos, code patterns)
4. `SLM.docx` (Ollama, OpenAI SDK, MAF patterns)

**No training data padding—only course material.**

## Usage Tips

1. **First pass**: Read Topic Summaries + Key Concepts (1 hour)
2. **Memory**: Use flashcards (10 min/day, 5 days)
3. **Recognition**: Practice MCQ questions under time pressure (1 hour)
4. **Deep dives**: Reference Code Patterns section when stuck
5. **Before exam**: Review Exam Traps & Tricks (30 min)

## Key Distinctions to Memorize

| Framework | Primary Use | Key Entry Point | Package |
|-----------|------------|-----------------|---------|
| **Semantic Kernel** | Prompt orchestration, plugin composition | `KernelBuilder.Build()` | `Microsoft.SemanticKernel` |
| **MAF** | Multi-turn agent, tool calling, reasoning | `ChatClient.AsAIAgent()` | `Microsoft.Agents.AI.OpenAI` |
| **Ollama** | Local SLM inference (offline) | `OllamaApiClient` | `OllamaSharp` |
| **GitHub Models** | Cloud-hosted models via GitHub | `new ChatClient(...)` with endpoint | `OpenAI` SDK + config |

## Confidence Checklist

Before exam, verify you can answer:

- [ ] What does `AIFunctionFactory.Create()` do?
- [ ] What's the difference between stdio and SSE (MCP)?
- [ ] What endpoint does Ollama listen on?
- [ ] How do you create an MAF agent with tools?
- [ ] What attribute decorates a Semantic Kernel function?
- [ ] Why use Ollama vs. GitHub Models?
- [ ] What method maintains multi-turn state in MAF?
- [ ] How do you substitute variables in skprompt.txt?

If you can answer all 8, you're ready for the exam.

---

**Last Updated**: April 2026  
**Prepared for**: COMP4870 Final Exam  
**Target Score**: 55-60% overall, 7-8 marks from this topic (87.5%)
