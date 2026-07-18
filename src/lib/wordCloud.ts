// Kata sambung/fungsi bahasa Indonesia (+ beberapa Inggris umum) yang tidak
// informatif untuk word cloud — tanpa ini, kata seperti "yang"/"akan"/"dalam"
// mendominasi cloud padahal tidak menunjukkan topik apa pun.
const STOPWORDS = new Set([
  "yang", "akan", "dalam", "dengan", "untuk", "pada", "adalah", "telah", "sudah",
  "saat", "agar", "jika", "maka", "bahwa", "para", "namun", "hingga", "sejak",
  "antara", "sementara", "meski", "walau", "walaupun", "seperti", "banyak",
  "lebih", "sangat", "masih", "hanya", "saja", "bisa", "dapat", "harus", "kami",
  "kita", "mereka", "anda", "saya", "dia", "yaitu", "yakni", "terhadap",
  "sebuah", "seorang", "beberapa", "setiap", "semua", "sendiri", "kembali",
  "mengatakan", "menurut", "terkait", "baru", "juga", "oleh", "karena", "tidak",
  "tersebut", "dari", "tetapi", "tanpa", "tetap", "tentang", "tengah", "atas",
  "bawah", "lain", "lainnya", "kata", "salah", "satu", "dua", "tiga", "kali",
  "buah", "orang", "sebagai", "merupakan", "melalui", "sampai", "serta",
  "maupun", "atau", "akibat", "sehingga", "diri", "diketahui", "sebelum",
  "sesudah", "ketika", "bagi", "guna", "usai", "kian", "sejumlah", "berbagai",
  "terus", "berlaku", "menjelang", "semakin", "makin", "cukup", "kembalikan",
  "tengok", "yakin", "jelas", "sekitar", "kurang",
  "the", "and", "for", "with", "that", "this", "from", "have", "has", "will",
  "are", "was", "were", "been", "being", "into", "than", "then", "they",
  "their", "them", "about", "after", "before", "during", "over", "under",
]);

export function buildWordCloud(texts: string[], maxWords = 50): { keyword: string; total: number }[] {
  const wordMap = new Map<string, number>();

  texts.forEach((text) => {
    String(text || "")
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .forEach((word) => {
        if (word.length < 4) return;
        if (STOPWORDS.has(word)) return;
        if (/^\d+$/.test(word)) return;
        wordMap.set(word, (wordMap.get(word) || 0) + 1);
      });
  });

  return Array.from(wordMap.entries())
    .map(([keyword, total]) => ({ keyword, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, maxWords);
}
