import {
  CalendarCheck, CircleDot, ClipboardCheck, Code2, Eye, FlaskConical, KeyRound, Map, MessagesSquare,
  Palette, Rocket, Search, ShieldCheck, Target, TrendingUp, Users, Wrench, type LucideIcon,
} from "lucide-react";

const icons = {
  talk: MessagesSquare, progress: Eye, people: Users, launch: Rocket, handover: KeyRound, audit: ClipboardCheck,
  goal: Target, discover: Search, map: Map, prototype: FlaskConical, test: ShieldCheck, design: Palette,
  build: Code2, fix: Wrench, routine: CalendarCheck, grow: TrendingUp, other: CircleDot,
} satisfies Record<string, LucideIcon>;

type IconKey = keyof typeof icons;

/** First matching rule wins, so more specific words come first. */
const rules: [RegExp, IconKey][] = [
  [/contact|communicat/i, "talk"],
  [/progress|visib/i, "progress"],
  [/collaborat|decision/i, "people"],
  [/launch|release|roll-out|deploy/i, "launch"],
  [/handover|hand-over/i, "handover"],
  [/audit|review|catalogue|benchmark/i, "audit"],
  [/goal|track/i, "goal"],
  [/understand|discover|define|find|scop/i, "discover"],
  [/audience|message/i, "people"],
  [/structure|wirefram|^map|architecture|platform|direction/i, "map"],
  [/prototype|\bprove\b|sketch|mvp/i, "prototype"],
  [/test|hardening/i, "test"],
  [/design|visual|flow/i, "design"],
  [/develop|build|integrat|iterative/i, "build"],
  [/fix|stabilis/i, "fix"],
  [/routine|care/i, "routine"],
  [/monitor|measure|report|refine|improve|optimi|create|grow/i, "grow"],
];

export function stepIconKey(title: string): IconKey {
  return rules.find(([pattern]) => pattern.test(title))?.[1] ?? "other";
}

/** An icon chosen from a process step's title, in a rounded tile. Decorative. */
export function StepIcon({ title, size = 22 }: { title: string; size?: number }) {
  const Icon = icons[stepIconKey(title)];
  return <span className="step-icon" aria-hidden="true"><Icon size={size} strokeWidth={1.6} /></span>;
}
