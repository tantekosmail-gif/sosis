// Titles/channel names from some APIs (e.g. YouTube) come pre-HTML-escaped
// (e.g. "&amp;" instead of "&"), so decode common entities before rendering as plain text.
const HTML_ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&apos;": "'",
  "&#x27;": "'",
};

// Terima null/undefined (mis. item trending yang keyword-nya null dari API)
// dan kembalikan string kosong — pemanggil boleh langsung .trim()/.toLowerCase()
// tanpa guard.
export function decodeHtmlEntities(text: string | null | undefined): string {
  if (!text) return "";
  return text
    .replace(/&amp;|&lt;|&gt;|&quot;|&#39;|&apos;|&#x27;/g, (entity) => HTML_ENTITIES[entity])
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)));
}
