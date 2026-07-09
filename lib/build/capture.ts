// Quick capture: work out what the user just dumped into the box.
//
// The dashboard box takes anything — a URL, a thought, a task. Guessing right
// most of the time is worth more than a correct-but-tedious "what kind of
// thing is this?" prompt, so this classifies, and the UI shows what it decided
// with a one-click way to change its mind.

export type CaptureKind = "reference" | "task";

export interface Capture {
  kind: CaptureKind;
  /** For a reference: the url. */
  url?: string;
  /** Display title: the host+path for links, the raw text otherwise. */
  title: string;
  /** Anything the user typed alongside a pasted URL becomes the note. */
  note: string;
}

const URL_RE = /\bhttps?:\/\/[^\s<>"']+/i;

// Bare domains people actually paste: pin.it/x, alibaba.com, example.co.uk.
// Capturing the TLD and the path separately so both can be interrogated —
// a naive "word dot word" pattern happily classifies "Call the framer.Then
// order doors" and "see notes.txt" as links.
const BARE_RE = /(^|[\s(])((?:[A-Za-z0-9-]+\.)+([A-Za-z]{2,24}))(\/[^\s<>"']*)?/;

/**
 * A bare token is only a link if its suffix is plausibly a TLD. The list is
 * short on purpose — anything outside it needs an explicit scheme or a path,
 * because guessing wrong turns a note into a broken link.
 */
const TLDS = new Set([
  "com", "net", "org", "io", "co", "dev", "ai", "app", "xyz", "me", "tv",
  "info", "biz", "pro", "edu", "gov", "shop", "store", "design", "house", "build",
  "us", "uk", "ca", "de", "fr", "es", "it", "nl", "au", "cn", "jp", "in", "eu", "ie", "nz",
]);

function normalize(raw: string): string {
  return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
}

/** Find a bare domain worth treating as a link, or null. */
function matchBareDomain(text: string): string | null {
  const m = text.match(BARE_RE);
  if (!m) return null;

  const [, lead, domain, tld, path] = m;

  // An email address is not a link to a page.
  const at = m.index !== undefined ? text[m.index + lead.length - 1] : undefined;
  if (at === "@" || /\S@$/.test(text.slice(0, (m.index ?? 0) + lead.length))) return null;

  // "framer.Then" — a sentence, not a host. Real TLDs are written lowercase.
  if (tld !== tld.toLowerCase()) return null;

  // "notes.txt", "v2.final" — a suffix, not a TLD. A path redeems it
  // ("pin.it/7I3cG2eXx"), because nobody writes prose with a slash-path.
  if (!TLDS.has(tld) && !path) return null;

  return domain + (path || "");
}

/** Strip scheme, www. and a trailing slash — what a human would call the link. */
export function prettyUrl(url: string): string {
  return url
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .replace(/\/+$/, "");
}

export function classify(input: string): Capture | null {
  const text = input.trim();
  if (!text) return null;

  const explicit = text.match(URL_RE);
  const match = explicit?.[0] ?? matchBareDomain(text);

  if (match) {
    const url = normalize(match);
    // Whatever the user typed around the link is the note.
    const note = text
      .replace(match, "")
      .replace(/\s{2,}/g, " ")
      .trim()
      .replace(/^[-–—:,]\s*/, "");
    return { kind: "reference", url, title: prettyUrl(url), note };
  }

  return { kind: "task", title: text, note: "" };
}
