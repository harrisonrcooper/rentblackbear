import { describe, it, expect } from "vitest";

import { classify, prettyUrl } from "../capture";

describe("classify", () => {
  it("returns null for empty input", () => {
    expect(classify("")).toBeNull();
    expect(classify("   ")).toBeNull();
  });

  it("treats plain text as a task", () => {
    expect(classify("call the framer")).toEqual({ kind: "task", title: "call the framer", note: "" });
  });

  it("recognizes an explicit https url", () => {
    const c = classify("https://www.aquafire.com/products/aquafire-pro")!;
    expect(c.kind).toBe("reference");
    expect(c.url).toBe("https://www.aquafire.com/products/aquafire-pro");
    expect(c.title).toBe("aquafire.com/products/aquafire-pro");
  });

  it("recognizes a bare domain and adds the scheme", () => {
    const c = classify("lightcanhelpyou.com")!;
    expect(c.kind).toBe("reference");
    expect(c.url).toBe("https://lightcanhelpyou.com");
  });

  it("recognizes a bare domain with a path", () => {
    const c = classify("pin.it/7I3cG2eXx")!;
    expect(c.kind).toBe("reference");
    expect(c.url).toBe("https://pin.it/7I3cG2eXx");
  });

  it("keeps the surrounding text as the note", () => {
    const c = classify("love the arch shape https://pin.it/abc123")!;
    expect(c.kind).toBe("reference");
    expect(c.url).toBe("https://pin.it/abc123");
    expect(c.note).toBe("love the arch shape");
  });

  it("strips a leading dash or colon from the note", () => {
    expect(classify("https://x.com/y — check this")!.note).toBe("check this");
    expect(classify("https://x.com/y: check this")!.note).toBe("check this");
  });

  // A naive "word dot word" pattern classifies every one of these as a link.
  it.each([
    ["a sentence with no space after the period", "Call the framer.Then order doors"],
    ["a name followed by a capitalized word", "Ask Kasin.He knows the hinge spec"],
    ["a filename", "see notes.txt"],
    ["a version label", "v2.final plan"],
    ["a decimal", "budget is 1.2m"],
    ["a multiplier", "quote was 4.5x too high"],
    ["plain prose", "ask Kasin about hinges"],
  ])("does not mistake %s for a link", (_label, input) => {
    expect(classify(input)!.kind).toBe("task");
    expect(classify(input)!.title).toBe(input);
  });

  it("does not treat an email address as a link", () => {
    expect(classify("email kasin@sjumbo.com about the carcass")!.kind).toBe("task");
  });

  it("still accepts a bare domain whose suffix is a real TLD", () => {
    expect(classify("check alibaba.com for tubs")!.url).toBe("https://alibaba.com");
    expect(classify("zehnderamerica.com")!.url).toBe("https://zehnderamerica.com");
  });

  it("accepts an unusual suffix when it carries a path", () => {
    // 'pin.it/x' is a link; 'notes.txt' is not. The path is what distinguishes them.
    expect(classify("pin.it/7I3cG2eXx")!.url).toBe("https://pin.it/7I3cG2eXx");
  });

  it("prefers an explicit url over a bare domain in the same string", () => {
    const c = classify("compare alibaba.com with https://sjumbo.com/cabinets")!;
    expect(c.url).toBe("https://sjumbo.com/cabinets");
  });
});

describe("prettyUrl", () => {
  it("drops scheme, www and trailing slash", () => {
    expect(prettyUrl("https://www.example.com/")).toBe("example.com");
    expect(prettyUrl("http://zehnderamerica.com/products/")).toBe("zehnderamerica.com/products");
  });
});
