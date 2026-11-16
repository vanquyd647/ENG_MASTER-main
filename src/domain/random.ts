export const shuffle = <T,>(items: readonly T[], random = Math.random): T[] => {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index--) { const target = Math.floor(random() * (index + 1)); [result[index], result[target]] = [result[target], result[index]]; }
  return result;
};
export const normalizeAnswer = (answer: string) => answer.normalize("NFKC").trim().toLowerCase().replace(/[’‘]/g, "'").replace(/[‐‑–—]/g, "-").replace(/\s+/g, " ");
