# B6a draft — Memory formulas cheat block

To be appended to `content/4736/cheat-sheet.md` as a new `##` block (one `##` heading, no H3/H4 inside, per `SCHEMA.md:466-468`).

---

## Memory formulas — quick reference

**Bit splits.** Given page size `P = 2^k`, virtual address `V` bits, physical address `Phys` bits:
- `offset_bits = k`
- `vpage_bits = V − k`
- `frame_bits = Phys − k`
- `#pages = 2^(V − k)`
- `#frames = 2^(Phys − k)`
- Linear PT entries = `2^(V − k)` (one per virtual page)

**Address translation.** Given `VP → frame`:
- `offset = VA mod P`
- `PA = frame × P + offset`
- Formula form: `Y = x + (a − A)` where `x = VA`, `A = page base`, `a = frame base`

**EAT (effective access time) with TLB.** Given TLB lookup `t_T`, memory access `t_M`, PT walk = one extra `t_M`:
- `EAT = hit × (t_T + t_M) + (1 − hit) × (t_T + 2·t_M)`

**Overhead / optimal page size.** Given process size `s`, PT entry size `e`, page size `p`:
- `Overhead(p) = s·e/p + p/2`
- Minimize: `p* = √(2se)` → `Overhead(p*) = √(2se) = p*`
- Classic: `s = 1 MB, e = 8 B → p* = 4 KB`

**Buddy system.**
- Allocated block size = next power of 2 ≥ `max(request, min_block)`
- Internal fragmentation = block − request (worst case ≈ 50% at `request = 2^k + 1`)
- Coalesce: merge two buddies only when both are wholly free (no busy descendants)

**Banker's algorithm.**
- `Need = Max − Has`
- `Available = Total − Σ Has`
- Safe if some ordering of processes satisfies `Need[i] ≤ Available` at every step (releasing `Has[i]` after each)

**Deadlock detection (matrix).**
- `A[j] = E[j] − Σ_i C[i][j]` (available = existing − allocated)
- Process `i` is satisfiable iff `R[i] ≤ A` (component-wise)
- On mark: `A ← A + C[i]` (its held resources return)
- Terminates: all marked → safe; none satisfiable → remaining processes deadlocked
