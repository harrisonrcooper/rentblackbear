"""Split BuildClient.jsx into one file per section.

Every section becomes app/admin/build/sections/<Name>.jsx. A helper used by a
single section moves with it; a helper used by two or more (or by the shell)
moves to sections/_common.jsx. Imports are computed from what each emitted file
actually references, so nothing is imported that isn't used.
"""
import re, sys, os
from pathlib import Path

ROOT = Path("/Users/harrisoncooper/Desktop/rentblackbear")
SRC = ROOT / "app/admin/build/BuildClient.jsx"
OUT = ROOT / "app/admin/build/sections"

src = SRC.read_text()

# ── 1. Slice off the header (imports + file comment) ──────────────────
first_decl = re.search(r"^(?:const|function|export default function) ", src, re.M)
header = src[: first_decl.start()]
body = src[first_decl.start():]


def decls(text):
    """Yield (name, kind, code) for every top-level declaration."""
    i = 0
    while i < len(text):
        m = re.compile(r"^(export default function|export function|function|const) ([A-Za-z_$][\w$]*)", re.M).search(text, i)
        if not m:
            return
        name = m.group(2)
        kind = m.group(1)
        start = m.start()

        if "function" in kind:
            p = text.index("(", m.end() - len(name))
            depth = 0
            for j in range(p, len(text)):
                if text[j] == "(":
                    depth += 1
                elif text[j] == ")":
                    depth -= 1
                    if depth == 0:
                        break
            b = text.index("{", j)
            depth = 0
            for k in range(b, len(text)):
                if text[k] == "{":
                    depth += 1
                elif text[k] == "}":
                    depth -= 1
                    if depth == 0:
                        end = k + 1
                        break
        else:  # const NAME = ...;  (may span lines / contain braces)
            eq = text.index("=", m.end())
            depth = 0
            end = None
            for k in range(eq, len(text)):
                c = text[k]
                if c in "([{":
                    depth += 1
                elif c in ")]}":
                    depth -= 1
                elif c == ";" and depth == 0:
                    end = k + 1
                    break
            if end is None:
                end = len(text)
        yield name, kind, text[start:end]
        i = end


units = [u for u in decls(body) if u[0] not in {"ACCENT", "ACCENT_SOFT", "SERIF"}]
by_name = {n: c for n, _, c in units}
order = [n for n, _, _ in units]
kinds = {n: k for n, k, _ in units}

SHELL = "BuildClient"
sections = [n for n in order if re.fullmatch(r"[A-Z][A-Za-z]*Section", n)]

IDENT = re.compile(r"\b[A-Za-z_$][\w$]*\b")


def refs(name):
    code = by_name[name]
    # strip the declaration's own name so it isn't a self-reference
    return {t for t in IDENT.findall(code)} - {name}


def closure(root, boundaries):
    """Symbols `root` needs, never walking through another root."""
    seen, stack = set(), [root]
    while stack:
        cur = stack.pop()
        for r in refs(cur):
            if r not in by_name or r in seen or r == root:
                continue
            seen.add(r)
            if r not in boundaries:      # do not traverse INTO another root
                stack.append(r)
    return seen


# Which roots need each local symbol?
roots = sections + [SHELL]
boundaries = set(roots)
need = {n: set() for n in by_name}
for r in roots:
    for dep in closure(r, boundaries):
        if dep in boundaries:
            continue                     # a root needing a root is an import, not ownership
        need[dep].add(r)

# Shared by two or more roots -> _common. Wanted by exactly one -> that file.
common = {n for n in by_name if n not in roots and len(need[n]) > 1}
shell_only = sorted(
    [n for n in by_name if n not in roots and need[n] == {SHELL}], key=order.index)
owned = {}
for s in sections:
    owned[s] = sorted(
        [n for n in by_name if n not in roots and n not in common and need[n] == {s}],
        key=order.index,
    )
orphans = [n for n in by_name if n not in roots and not need[n]]


# ── 2. What can be imported, and from where ──────────────────────────
UI = ["COLORS", "FONT", "STYLES", "inputStyle", "btn", "Icon", "ICON", "fmtUsd", "fmtCompact",
      "ACCENT", "ACCENT_SOFT", "SERIF", "Card", "Field", "txt", "MoneyInput", "DelBtn", "Check",
      "AddBtn", "ProgressRing", "StatTile", "SectionHead", "Chip", "StatStrip", "fmtBuildDate",
      "daysFromToday", "AutoTextarea", "SelectPill", "textareaStyle", "optionsFrom",
      "WISH_TIERS", "SELECTION_STATUSES", "CHANGE_ORDER_KINDS", "CHANGE_ORDER_STATUSES",
      "LIEN_WAIVERS", "INSPECTION_STATUSES", "QUESTION_STATUSES"]
HOOKS = ["useState", "useMemo", "useCallback", "useEffect", "useRef", "useTransition"]
EXTERNAL = {
    "genId": ('import { genId } from "../../budget/lib/calc";', None),
    "useIsMobile": ('import { useIsMobile } from "../../budget/lib/responsive";', None),
    "DetailDrawer": ('import DetailDrawer from "../DetailDrawer";', None),
    "tasksFor": ('import { tasksFor } from "@/lib/build/tasks";', None),
}
ROOMS_LIB = ["addMustHave", "checklistFor", "editMustHave", "removeMustHave", "roomProgress", "toggleMustHave"]


def emit(path, comment, names, extra_exports=()):
    code = "\n\n".join(by_name[n] for n in names)
    used = set(IDENT.findall(code))

    lines = ['"use client";', "", comment, ""]
    hooks = [h for h in HOOKS if h in used]
    if hooks:
        lines.append(f'import {{ {", ".join(hooks)} }} from "react";')
        lines.append("")
    ui = [u for u in UI if u in used]
    if ui:
        joined = ", ".join(ui)
        lines.append(f'import {{ {joined} }} from "../ui";')
    for sym, (imp, _) in EXTERNAL.items():
        if sym in used:
            lines.append(imp)
    rooms = [r for r in ROOMS_LIB if r in used]
    if rooms:
        lines.append(f'import {{ {", ".join(rooms)} }} from "@/lib/build/rooms";')
    commons = sorted(n for n in common if n in used)
    if commons and path.name != "_common.jsx":
        lines.append(f'import {{ {", ".join(commons)} }} from "./_common";')
    lines.append("")

    for n in names:
        c = by_name[n]
        if n in extra_exports or (path.name == "_common.jsx"):
            c = re.sub(r"^(function|const) ", r"export \1 ", c, count=1)
        elif re.fullmatch(r"[A-Z][A-Za-z]*Section", n):
            c = re.sub(r"^function ", "export default function ", c, count=1)
        lines.append(c)
        lines.append("")
    path.write_text("\n".join(lines))


OUT.mkdir(exist_ok=True)

# _common.jsx first
common_sorted = sorted(common, key=order.index)
emit(OUT / "_common.jsx",
     "// Helpers shared by more than one section, or by the shell.\n// A helper used by exactly one section lives in that section's file instead.",
     common_sorted)

RENAME = {"DecisionsSection": "OpenQuestions"}   # avoid clashing with the new Decisions log
made = {}
for s in sections:
    base = RENAME.get(s, s[: -len("Section")])
    fname = f"{base}.jsx"
    if (OUT / fname).exists() and base in ("Materials", "Decisions", "Quotes", "Schedule", "Trips"):
        fname = f"{base}Legacy.jsx"
    made[s] = fname
    emit(OUT / fname, f"// {base} section.", owned[s] + [s])

# ── 3. Rewrite the shell ─────────────────────────────────────────────
EXISTING = {
    "materials": ("MaterialsSection", "./sections/Materials"),
    "decisionlog": ("DecisionsSection2", "./sections/Decisions"),
    "quotes": ("QuotesSection", "./sections/Quotes"),
    "schedule": ("ScheduleSection", "./sections/Schedule"),
    "trips": ("TripsSection", "./sections/Trips"),
}

shell_code = "\n\n".join(by_name[n] for n in shell_only + [SHELL])
used = set(IDENT.findall(shell_code))

hdr = header.rstrip() + "\n"
# Drop the old ui import line; rebuild it from what the shell still uses.
hdr = re.sub(r"import \{[^}]*\} from \"\./ui\";\n", "", hdr, flags=re.S)
already = set(re.findall(r"[A-Za-z_$][\w$]*", " ".join(re.findall(r"import \{([^}]*)\}", hdr))))
ui_used = [u for u in UI if u in used and u not in already]
imports = []
if ui_used:
    imports.append(f'import {{ {", ".join(ui_used)} }} from "./ui";')
commons_used = sorted(n for n in common if n in used)
if commons_used:
    imports.append(f'import {{ {", ".join(commons_used)} }} from "./sections/_common";')
for s in sections:
    base = made[s][:-4]
    imports.append(f'import {s} from "./sections/{base}";')
hdr = hdr + "\n".join(imports) + "\n"

shell = hdr + "\n" + shell_code + "\n"
SRC.write_text(shell)

print("common (shared by 2+):", ", ".join(common_sorted) or "(none)")
print("shell-only kept in BuildClient:", ", ".join(shell_only) or "(none)")
print("orphans (unused):", ", ".join(orphans) or "(none)")
for s in sections:
    print(f"  {s:24} -> sections/{made[s]:22} (+{len(owned[s])} private helpers)")
