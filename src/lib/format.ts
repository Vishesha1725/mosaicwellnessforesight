const isNum = (n: number | null | undefined) => typeof n === "number" && Number.isFinite(n);

export function fmtInt(n: number | null | undefined): string {
  if (!isNum(n)) return "--";
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Math.round(n));
}

export function fmt1(n: number | null | undefined): string {
  if (!isNum(n)) return "--";
  return new Intl.NumberFormat("en-IN", { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(n);
}

export function fmt2(n: number | null | undefined): string {
  if (!isNum(n)) return "--";
  return new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
}

export function fmtINR(n: number | null | undefined): string {
  if (!isNum(n)) return "--";
  return `INR ${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Math.round(n))}`;
}
