// Cron field definitions
const CRON_FIELDS = [
  { name: 'minute', min: 0, max: 59 },
  { name: 'hour', min: 0, max: 23 },
  { name: 'dayOfMonth', min: 1, max: 31 },
  { name: 'month', min: 1, max: 12 },
  { name: 'dayOfWeek', min: 0, max: 6 },
];

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 
                     'July', 'August', 'September', 'October', 'November', 'December'];
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Validate a cron expression
export function validateCron(expr: string): { valid: boolean; error?: string } {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) {
    return { valid: false, error: 'A cron expression must have exactly 5 fields' };
  }
  
  for (let i = 0; i < 5; i++) {
    const field = parts[i];
    const { name, min, max } = CRON_FIELDS[i];
    
    if (field === '*') continue;
    
    const partsList = field.split(',');
    for (const part of partsList) {
      if (part.includes('/')) {
        const [range, step] = part.split('/');
        if (!validateRange(range, min, max) || !validateNumber(step, 1, max)) {
          return { valid: false, error: `Invalid ${name} field: ${part}` };
        }
      } else if (part.includes('-')) {
        if (!validateRange(part, min, max)) {
          return { valid: false, error: `Invalid ${name} field: ${part}` };
        }
      } else {
        if (!validateNumber(part, min, max)) {
          return { valid: false, error: `Invalid ${name} field: ${part}` };
        }
      }
    }
  }
  
  return { valid: true };
}

function validateNumber(str: string, min: number, max: number): boolean {
  const num = parseInt(str, 10);
  return !isNaN(num) && num >= min && num <= max;
}

function validateRange(range: string, min: number, max: number): boolean {
  if (range === '*') return true;
  const [start, end] = range.split('-');
  if (end === undefined) {
    return validateNumber(start, min, max);
  }
  return validateNumber(start, min, max) && validateNumber(end, min, max) && parseInt(start) <= parseInt(end);
}

// Parse a cron field into human-readable parts
function parseField(field: string, fieldInfo: typeof CRON_FIELDS[0]): string {
  if (field === '*') {
    return `every ${fieldInfo.name}`;
  }
  
  const parts = field.split(',');
  const explanations: string[] = [];
  
  for (const part of parts) {
    if (part.includes('/')) {
      const [range, step] = part.split('/');
      if (range === '*') {
        explanations.push(`every ${step} ${fieldInfo.name}s`);
      } else {
        const [start, end] = range.split('-');
        explanations.push(`every ${step} ${fieldInfo.name}s from ${formatValue(start, fieldInfo.name)}${end ? ` to ${formatValue(end, fieldInfo.name)}` : ''}`);
      }
    } else if (part.includes('-')) {
      const [start, end] = part.split('-');
      explanations.push(`${formatValue(start, fieldInfo.name)} through ${formatValue(end, fieldInfo.name)}`);
    } else {
      explanations.push(formatValue(part, fieldInfo.name));
    }
  }
  
  return explanations.join(', ');
}

function formatValue(value: string, fieldName: string): string {
  if (fieldName === 'month') {
    return MONTH_NAMES[parseInt(value, 10) - 1];
  }
  if (fieldName === 'dayOfWeek') {
    return DAY_NAMES[parseInt(value, 10)];
  }
  return value;
}

// Generate a human-readable explanation
export function explainCron(expr: string): string {
  const parts = expr.trim().split(/\s+/);
  const explanations = parts.map((p, i) => parseField(p, CRON_FIELDS[i]));
  
  return `At ${explanations[0]}, ${explanations[1]}, ${explanations[2]}, ${explanations[3]}, ${explanations[4]}.`;
}

// Calculate next N run times
export function getNextRuns(expr: string, count = 5): Date[] {
  const { valid } = validateCron(expr);
  if (!valid) return [];
  
  const [minuteExpr, hourExpr, dayOfMonthExpr, monthExpr, dayOfWeekExpr] = expr.trim().split(/\s+/);
  
  const runs: Date[] = [];
  const current = new Date();
  current.setSeconds(0, 0);
  current.setMinutes(current.getMinutes() + 1); // Start from next minute
  
  while (runs.length < count && current.getTime() < Date.now() + 1000 * 60 * 60 * 24 * 365) { // Limit to 1 year
    if (matchesCron(current, minuteExpr, hourExpr, dayOfMonthExpr, monthExpr, dayOfWeekExpr)) {
      runs.push(new Date(current));
    }
    current.setMinutes(current.getMinutes() + 1);
  }
  
  return runs;
}

function matchesCron(date: Date, minute: string, hour: string, dayOfMonth: string, month: string, dayOfWeek: string): boolean {
  return matchesField(date.getMinutes(), minute, 0, 59) &&
         matchesField(date.getHours(), hour, 0, 23) &&
         matchesField(date.getDate(), dayOfMonth, 1, 31) &&
         matchesField(date.getMonth() + 1, month, 1, 12) &&
         matchesField(date.getDay(), dayOfWeek, 0, 6);
}

function matchesField(value: number, expr: string, min: number, max: number): boolean {
  if (expr === '*') return true;
  
  const parts = expr.split(',');
  return parts.some(part => {
    if (part.includes('/')) {
      const [range, stepStr] = part.split('/');
      const step = parseInt(stepStr, 10);
      if (range === '*') {
        return value % step === min % step;
      } else {
        const [start, end] = range.split('-').map(Number);
        return value >= start && (end ? value <= end : true) && (value - start) % step === 0;
      }
    } else if (part.includes('-')) {
      const [start, end] = part.split('-').map(Number);
      return value >= start && value <= end;
    } else {
      return value === parseInt(part, 10);
    }
  });
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
