"""Add a named import to an existing `import { ... } from "<mod>"` block.

Written because I broke four files doing this by hand with a regex that
appended after a trailing comma or a newline, producing `x,\n, y}`. Splicing
into source text is not a one-liner; the comma has to go where the LAST NAME
is, not where the closing brace is.
"""
import re


def add_named_import(src: str, name: str, module: str) -> str:
    """Return src with `name` added to the import from `module`, if absent."""
    pattern = re.compile(
        r'import\s*\{(?P<names>[^}]*)\}\s*from\s*["\']' + re.escape(module) + r'["\'];'
    )
    m = pattern.search(src)
    if not m:
        raise ValueError(f"no import from {module!r}")

    raw = m.group("names")
    names = [n.strip() for n in raw.split(",") if n.strip()]
    if name in names:
        return src

    names.append(name)
    multiline = "\n" in raw

    if multiline:
        indent = "  "
        body = "\n" + ",\n".join(indent + n for n in names) + ",\n"
    else:
        body = " " + ", ".join(names) + " "

    return src[: m.start()] + f'import {{{body}}} from "{module}";' + src[m.end() :]


if __name__ == "__main__":
    import sys
    from pathlib import Path

    path, name, module = sys.argv[1], sys.argv[2], sys.argv[3]
    p = Path(path)
    p.write_text(add_named_import(p.read_text(), name, module))
    print(f"{path}: + {name}")
