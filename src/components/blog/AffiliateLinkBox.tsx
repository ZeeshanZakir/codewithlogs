import Link from "next/link";

type AffiliateLinkBoxProps = {
  label: string;
  url: string;
  disclosure: string;
  description?: string;
};

export function AffiliateLinkBox({
  label,
  url,
  disclosure,
  description,
}: AffiliateLinkBoxProps) {
  return (
    <div className="my-8 rounded-[12px] border border-primary/15 bg-primary/5 p-5">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
        Recommendation
      </p>
      <p className="mt-3 text-base leading-8 text-text/80">
        <span className="font-semibold">I recommend {label}</span>
        {description ? ` — ${description}` : "."}{" "}
        <Link href={url} className="font-semibold text-primary">
          Get started →
        </Link>
      </p>
      <p className="mt-3 text-xs text-text/55">{disclosure}</p>
    </div>
  );
}
