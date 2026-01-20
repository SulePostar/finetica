export function toYMD(date) {
    return date.toISOString().slice(0, 10);
}

export function addDays(date, days) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
}

export function getRangeDays(range) {
    if (range === "90d") return 90;
    if (range === "30d") return 30;
    return 7;
}

export function getRangeDates(range, toDate) {
    const days = getRangeDays(range);
    const to = new Date(toDate);
    const from = addDays(to, -days);
    return { from: toYMD(from), to: toYMD(to) };
}

export function fillMissingDays(rows, from, to) {
    const map = new Map((rows || []).map((r) => [r.date, Number(r.count) || 0]));
    const result = [];

    const start = new Date(from + "T00:00:00");
    const end = new Date(to + "T00:00:00");

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const key = toYMD(d);
        result.push({ date: key, count: map.get(key) ?? 0 });
    }

    return result;
}

export function mapKufDailyStats(apiRows) {
    return (apiRows || []).map((r) => ({
        date: r.day,
        count: Number(r.count) || 0,
    }));
}
