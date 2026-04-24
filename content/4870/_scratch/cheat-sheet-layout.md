# Cheat sheet layout — physical handwriting plan

**Sheet specs:** 8.5" × 11", both sides, landscape orientation, 4 columns total (2 per side).

**Total budget:** ~165 lines if using small handwriting (~4mm). ~120 lines if normal (~5mm).

---

## Layout — what goes where

```
┌─────────────────────── SIDE 1 (FRONT) ─ Code-heavy ────────────────────────┐
│                                                                            │
│  COLUMN 1 (Left)                  │  COLUMN 2 (Right)                      │
│  ─────────────────                │  ─────────────────                     │
│                                   │                                        │
│  §1 ML.NET PIPELINE     12m       │  §2 AI WIRING + ENDPOINTS      13m     │
│      ~12 lines                    │      ~10 lines                         │
│   • full chain                    │   • OpenAIClient + ApiKeyCredential    │
│   • [LoadColumn(N)]               │   • AddOpenAIChatCompletion            │
│   • [ColumnName("Score")]         │   • AddKernel                          │
│   • magic strings                 │   • Endpoint table (3 backends)        │
│                                   │                                        │
│  §4 CACHE + REDIS        8m       │  §3 MAF (2 shapes)        13m share    │
│      ~12 lines                    │      ~9 lines                          │
│   • AddStackExchangeRedisCache    │   • new ChatClientAgent(...)           │
│   • GetOrSetAsync<T> sig          │   • client.AsAIAgent(name, instr)      │
│   • Absolute vs Sliding           │   • CreateSessionAsync                 │
│   • AbortOnConnectFail            │   • RunAsync / RunStreamingAsync       │
│                                   │                                        │
│  §5 gRPC                 7m       │  §6 ASPIRE APPHOST         5m          │
│      ~14 lines                    │      ~10 lines                         │
│   • unary override sig            │   • DistributedApplication             │
│   • streaming override sig        │   • AddProject<>("name")               │
│   • AddGrpc + MapGrpcService<T>   │   • WithReference / WaitFor            │
│   • client AddGrpcClient          │   • AddServiceDefaults (in service!)   │
│   • .csproj GrpcServices          │   • /health vs /alive                  │
│                                   │                                        │
│  TOTAL: ~38 lines                 │  TOTAL: ~29 lines                      │
└────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────── SIDE 2 (BACK) ─ Mixed code + recall ────────────────┐
│                                                                            │
│  COLUMN 3 (Left)                  │  COLUMN 4 (Right) — recall-heavy       │
│  ─────────────────                │  ─────────────────                     │
│                                   │                                        │
│  §7 FILE-BASED APPS      8m       │  HIGH-YIELD RECALL ROWS                │
│      ~6 lines                     │      ~40 lines                         │
│   • #:package Name@Ver            │                                        │
│   • #:property Key=Val            │  Pick ~30-40 rows from the master      │
│   • #:sdk Microsoft.NET.Sdk.Web   │  recall table (cheat-sheet.md          │
│   • #:project ./path.csproj       │  "High-probability MCQ recall"         │
│   • dotnet run file.cs -- args    │  section). Prioritize:                 │
│                                   │                                        │
│  §8 LOCALIZATION         4m       │   1. ML.NET magic strings + return    │
│      ~17 lines                    │      types you tend to confuse         │
│   • AddLocalization               │   2. AI URLs + credential class        │
│   • Configure<RequestLocOpts>     │   3. Cache port + interfaces           │
│   • AddViewLocalization           │   4. gRPC: HTTP/2, AddGrpc method      │
│   • AddDataAnnotationsLocaliz...  │   5. Aspire WithReference vs WaitFor   │
│   • UseRequestLocalization (!)    │   6. Loc: UseRequestLocalization       │
│                                   │   7. PDF: ms.Position = 0              │
│  §9 TDD MOQ              6m       │   8. Excel: 1-based + MIME             │
│      ~14 lines                    │   9. MCP facts (4 rows)                │
│   • [Fact] / [Theory]             │  10. SLM/LLM/MAF acronyms              │
│   • Setup/.Object/Verify          │                                        │
│   • It.IsAny<T>() / Times.Once    │  Plus ~8 "WHY this fails" rows:       │
│                                   │   • R²=0.89 = variance, NOT %         │
│  §10 TAG HELPER          3m       │   • RMSE in label units                │
│      ~12 lines                    │   • Memory cache stale on LB           │
│   • TagHelper + [HtmlTarget…]     │   • PDF empty download                 │
│   • ProcessAsync(ctx, output)     │   • Localization silent no-op          │
│   • output.TagName/Attrs/Content  │   • override missing → UNIMPL          │
│   • _ViewImports @addTagHelper    │   • [ColumnName("Pred")] silent fail   │
│   • PascalCase ↔ kebab-case       │   • SETEX is seconds (not ms)          │
│                                   │                                        │
│  TOTAL: ~49 lines                 │  TOTAL: ~48 lines                      │
└────────────────────────────────────────────────────────────────────────────┘

GRAND TOTAL: ~164 lines
```

---

## Where the shorthand legend goes

Reserve a small box (~3 lines) in any corner — most natural is the very top-left of Side 1:

```
┌─────────────────────────────────┐
│ Shorthand:                      │
│   bldr=builder · bs=builder.Svc │
│   mlc=mlContext · td=trainData  │
│   opts=options · ctx=Context    │
└─────────────────────────────────┘
```

---

## What's NOT on the sheet (memorize instead)

| Skipped | Why |
|---|---|
| §11 QuickGrid markup (2m) | Pattern is short — `<QuickGrid>` `<PropertyColumn>` `<Paginator>`, recallable |
| §12 Reporting full code (2m) | Only the 3 gotchas (1-based Cell, ms.Position=0, @: directive) appear in recall rows |
| ML.NET evaluate code | Compressed to one row in recall: `Regression.Evaluate(preds, "Label", "Score") → RegressionMetrics` |
| ML.NET Save/Load code | Compressed to one row: `Save(model, schema, path)` / `Load(path, out schema)` |
| AutoML CLI command | One row: `mlnet regression --dataset --label-col --train-time` |
| MAF Shape 1 (constructor) | Shape 2 (`.AsAIAgent`) is shorter — write only that |
| All Aspire resource types beyond SQL+Redis | Course only demoed those two |
| Razor `<cache>` Tag Helper attributes | Mention `vary-by-user/route/query`, that's it |
| Redis CLI commands beyond SETEX | One row: `SETEX key seconds val` |
| All midterm Razor/MVC/EF/Identity/JWT/SignalR/Azure facts | Out of scope on final |

---

## Mark coverage from this layout

| Source | Marks covered |
|---|---|
| Side 1 code blocks (4 blocks) | ~38 marks of direct lookup |
| Side 2 code blocks (4 blocks) | ~21 marks of direct lookup |
| Side 2 recall rows | ~25 marks of direct lookup |
| **Total cheat-sheet coverage** | **~84% of the 70 MCQ+match marks** |
| **Coding question (10m) — depends on what's asked** | 0-10 |

**Realistic score with cheat sheet only:** 50-65/80 = **62-81%**.
**With 30 min flashcard review beforehand:** 60-70/80 = **75-87%**.

---

## Pre-flight checklist (5 min before writing in pen)

1. **Pencil-sketch column dividers** — vertical line down the middle of each side
2. **Pencil-sketch section boundaries** — count lines for each block first
3. **Verify the longest block fits** in its column (Localization at 17 lines is the biggest)
4. **Reserve recall row space** — Column 4 needs ~48 lines free
5. **Add the shorthand legend** in Side 1 top-left FIRST (so you don't forget)
6. **Confirm orientation** — landscape, both sides oriented same way (so you don't have to rotate the sheet)

---

## Failure modes to avoid

- **Running out of room on Side 2 Column 4** — recall rows expand fast; budget conservatively
- **Inconsistent abbreviations** — pick `mlc` OR `mc` for `mlContext`, not both
- **No legend** — Style B abbreviations are useless without it
- **Writing too large** — 5mm handwriting limits you to ~120 lines, not 165. Test your handwriting size on a blank sheet first.
- **Putting code on both sides of the page in one column** — flipping back-and-forth wastes seconds per question
