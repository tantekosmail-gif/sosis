export function buildWordCloud(texts: string[], maxWords = 50): { keyword: string; total: number }[] {
  const wordMap = new Map<string, number>();

  texts.forEach((text) => {
    String(text || "")
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .forEach((word) => {
        if (word.length < 4) return;
        wordMap.set(word, (wordMap.get(word) || 0) + 1);
      });
  });

  return Array.from(wordMap.entries())
    .map(([keyword, total]) => ({ keyword, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, maxWords);
}
