import type { PasswordStrength } from "@/lib/password-generator";

type PasswordStrengthMeterProps = {
  label: string;
  progress: number;
  strength: PasswordStrength;
};

const strengthStyles: Record<
  PasswordStrength,
  {
    bar: string;
    text: string;
    bg: string;
  }
> = {
  weak: {
    bar: "bg-red-500",
    text: "text-red-700",
    bg: "bg-red-50",
  },
  fair: {
    bar: "bg-orange-500",
    text: "text-orange-700",
    bg: "bg-orange-50",
  },
  good: {
    bar: "bg-blue-500",
    text: "text-blue-700",
    bg: "bg-blue-50",
  },
  strong: {
    bar: "bg-emerald-500",
    text: "text-emerald-700",
    bg: "bg-emerald-50",
  },
};

export function PasswordStrengthMeter({
  label,
  progress,
  strength,
}: PasswordStrengthMeterProps) {
  const style = strengthStyles[strength];

  return (
    <div className="space-y-3">
      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
        <div
          className={`h-full rounded-full transition-all duration-300 ${style.bar}`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${style.bg} ${style.text}`}>
        {label}
      </div>
    </div>
  );
}
