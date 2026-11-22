const pad = (n: number): string => String(n).padStart(2, '0');

/** Today's date in the browser's local time, as yyyy-mm-dd. */
export const todayIso = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

/** Smaller of two yyyy-mm-dd dates. */
export const minIso = (a: string, b: string): string => (a < b ? a : b);