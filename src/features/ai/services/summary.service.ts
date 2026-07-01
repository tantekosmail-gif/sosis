export async function generateSummary(payload: any) {
  const res = await fetch("/api/ai/summary", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(payload),
  });

  return res.json();
}