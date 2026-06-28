export function safeNumber(value: any): number {
  if (value === null || value === undefined || isNaN(value)) {
    return 0;
  }

  return Number(value);
}