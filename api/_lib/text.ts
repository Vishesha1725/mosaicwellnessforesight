export function cleanText(s: string) {
  return (s || "")
    .replace(/\uFFFD/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}
