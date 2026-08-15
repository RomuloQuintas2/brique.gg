export function toLocalISODate(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function getDateRange(period: string, customStart: string, customEnd: string) {
  const now = new Date();
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  if (period === "7d") {
    return {
      start: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6),
      end: endOfToday,
    };
  }
  if (period === "30d") {
    return {
      start: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29),
      end: endOfToday,
    };
  }
  if (period === "custom") {
    return {
      start: customStart ? new Date(`${customStart}T00:00:00`) : new Date(now.getFullYear(), 0, 1),
      end: customEnd ? new Date(`${customEnd}T23:59:59`) : endOfToday,
    };
  }
  // "ano" — desde 1 de janeiro
  return { start: new Date(now.getFullYear(), 0, 1), end: endOfToday };
}
