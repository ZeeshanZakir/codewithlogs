import { BookOpen, Briefcase, CalendarDays, Cpu, Globe, Layers, Star, Users, Wrench, type LucideIcon } from "lucide-react";
import { CountUp } from "./CountUp";

export type Stat = { value: number; suffix?: string; label: string; note?: string; icon: StatIcon };
export type StatIcon = "users" | "globe" | "layers" | "calendar" | "briefcase" | "star" | "book" | "wrench" | "cpu";

const icons: Record<StatIcon, LucideIcon> = {
  users: Users, globe: Globe, layers: Layers, calendar: CalendarDays, briefcase: Briefcase,
  star: Star, book: BookOpen, wrench: Wrench, cpu: Cpu,
};

/** Dark numbers band. Only pass figures that are true and verifiable. */
export function StatsBand({ stats, label }: { stats: Stat[]; label: string }) {
  return (
    <section className="hp-stats" aria-label={label}>
      <div className="ag-container">
        <ul className="hp-stats-grid">
          {stats.map((stat) => {
            const Icon = icons[stat.icon];
            return (
              <li key={stat.label} className="hp-stat ag-reveal">
                <span className="hp-stat-icon" aria-hidden="true"><Icon size={22} strokeWidth={1.6} /></span>
                <p className="hp-stat-value"><CountUp value={stat.value} />{stat.suffix ? <span className="hp-stat-suffix">{stat.suffix}</span> : null}</p>
                <p className="hp-stat-label">{stat.label}</p>
                {stat.note ? <p className="hp-stat-note">{stat.note}</p> : null}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
