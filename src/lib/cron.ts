// Numeric five-field Cronie-style subset, evaluated in UTC only.
const CRON_FIELDS = [
  { name: "minute", min: 0, max: 59 },
  { name: "hour", min: 0, max: 23 },
  { name: "day of month", min: 1, max: 31 },
  { name: "month", min: 1, max: 12 },
  { name: "day of week", min: 0, max: 6 },
];
type ParsedField = { values: Set<number>; wildcard: boolean };

function parseCron(expr: string): ParsedField[] {
  if (expr.length > 256) throw new Error("Expression exceeds 256 characters.");
  const fields = expr.trim().split(/\s+/);
  if (fields.length !== 5) throw new Error("Use exactly five fields: minute hour day-of-month month day-of-week.");
  return fields.map((field, index) => {
    const { name, min, max } = CRON_FIELDS[index];
    const values = new Set<number>();
    const items = field.split(",");
    if (items.length > 1 && field.includes("*")) throw new Error(`Use a wildcard on its own in the ${name} field.`);
    for (const item of items) {
      const match = /^(\*|[0-9]+(?:-[0-9]+)?)(?:\/([0-9]+))?$/.exec(item);
      if (!match) throw new Error(`Invalid ${name} field: ${item || "empty list item"}.`);
      const base = match[1];
      const step = match[2] === undefined ? 1 : Number(match[2]);
      if (match[2] && base !== "*" && !base.includes("-")) throw new Error(`Steps require * or a range in the ${name} field.`);
      const [first, last] = base === "*" ? [min, max] : base.split("-").map(Number);
      const end = last ?? first;
      if (!Number.isSafeInteger(first) || !Number.isSafeInteger(end) || first < min || end > max || first > end || !Number.isSafeInteger(step) || step < 1 || step > max - min + 1) {
        throw new Error(`Invalid ${name}: use ${min}-${max}, ascending ranges and steps 1-${max - min + 1}.`);
      }
      for (let value = first; value <= end; value += step) values.add(value);
    }
    return { values, wildcard: field.startsWith("*") };
  });
}

export function validateCron(expr: string): { valid: boolean; error?: string } {
  try { parseCron(expr); return { valid: true }; }
  catch (error) { return { valid: false, error: error instanceof Error ? error.message : "Invalid cron expression." }; }
}

export function explainCron(expr: string): string {
  const validation = validateCron(expr);
  if (!validation.valid) return validation.error!;
  const fields = expr.trim().split(/\s+/);
  const restrictedDays = !fields[2].startsWith("*") && !fields[4].startsWith("*");
  return `UTC schedule: minute ${fields[0]}, hour ${fields[1]}, month ${fields[3]}; day of month ${fields[2]} ${restrictedDays ? "OR" : "AND"} weekday ${fields[4]} (0 = Sunday). Steps advance within each field, not from the previous run.`;
}

// Fixed anchor and UTC arithmetic make previews repeatable and independent of DST.
// At most 365 days / 525,600 candidate minutes, and at most 20 returned dates.
export function getNextRuns(expr: string, count = 5, anchor: Date = new Date()): Date[] {
  if (!Number.isInteger(count) || count < 1 || count > 20 || !Number.isFinite(anchor.getTime())) return [];
  let fields: ParsedField[];
  try { fields = parseCron(expr); } catch { return []; }
  const [minute, hour, day, month, weekday] = fields;
  const start = Math.floor(anchor.getTime() / 60000) * 60000 + 60000;
  const end = anchor.getTime() + 365 * 24 * 60 * 60000;
  const runs: Date[] = [];
  for (let time = start; time <= end && runs.length < count; time += 60000) {
    const date = new Date(time);
    if (!minute.values.has(date.getUTCMinutes()) || !hour.values.has(date.getUTCHours()) || !month.values.has(date.getUTCMonth() + 1)) continue;
    const dayMatches = day.values.has(date.getUTCDate());
    const weekdayMatches = weekday.values.has(date.getUTCDay());
    if (day.wildcard || weekday.wildcard ? dayMatches && weekdayMatches : dayMatches || weekdayMatches) runs.push(date);
  }
  return runs;
}

// Presets
export const CRON_PRESETS = [
  { label: 'Every minute', expr: '* * * * *' },
  { label: 'Every hour', expr: '0 * * * *' },
  { label: 'Every day at midnight', expr: '0 0 * * *' },
  { label: 'Every Monday at 9am', expr: '0 9 * * 1' },
  { label: 'Every 1st of month', expr: '0 0 1 * *' },
  { label: 'Every weekday at 6pm', expr: '0 18 * * 1-5' },
];
