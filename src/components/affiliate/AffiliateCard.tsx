import Link from "next/link";
import { ArrowRight } from "lucide-react";

type AffiliateCardProps = {
  name: string;
  review: string;
  ctaLabel: string;
  href: string;
  badge?: string;
};

export function AffiliateCard({
  name,
  review,
  ctaLabel,
  href,
  badge,
}: AffiliateCardProps) {
  return (
    <article className="rounded-xl border border-black/6 bg-white p-6 shadow-sm transition-colors hover:border-primary/20">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-zinc-200" aria-hidden="true" />
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-text">{name}</h3>
            {badge ? (
              <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-amber-800">
                {badge}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <p className="mt-5 text-sm leading-7 text-text/70">{review}</p>

      <div className="mt-6 flex items-center justify-between gap-4">
        <Link
          href={href}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary/92"
        >
          {ctaLabel} <ArrowRight className="h-4 w-4" />
        </Link>
        <span className="text-xs text-text/50">affiliate link</span>
      </div>
    </article>
  );
}
