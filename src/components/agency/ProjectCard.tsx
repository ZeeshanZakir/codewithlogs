import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { CaseStudy } from "@/lib/work";
import { getService } from "@/lib/services";
import { ServiceVisual } from "./ServiceVisual";

/** Large editorial project card. Concept studies are always labelled as such. */
export function ProjectCard({ study, size = "large", headingLevel = 3 }: { study: CaseStudy; size?: "large" | "medium" | "small"; headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const services = study.services.map((slug) => getService(slug)?.shortName).filter(Boolean).join(" · ");
  const body = (
    <div className="pc-body">
      <p className="pc-meta"><span>{study.industry}</span>{services}</p>
      <Heading className="pc-title">{study.title}</Heading>
    </div>
  );
  return (
    <Link href={`/work/${study.slug}`} className={`pc pc-${size}${study.coverImage ? " pc-image" : ""} ag-reveal`}>
      <div className="pc-media">
        {study.coverImage ? (
          <Image src={study.coverImage.src} alt={study.coverImage.alt} fill sizes={size === "large" ? "(max-width: 900px) 100vw, 1240px" : "(max-width: 900px) 100vw, 50vw"} className="object-cover" style={{ objectPosition: "top left" }} />
        ) : study.visual ? (
          <ServiceVisual kind={study.visual} tone={size === "large" ? "dark" : "light"} />
        ) : null}
        {study.isPlaceholder ? <span className="pc-tag">Concept study · not client work</span> : null}
        {study.coverImage && size === "large" ? <span className="pc-scrim" aria-hidden="true" /> : null}
        {!study.isPlaceholder ? <span className="pc-tag pc-tag-client">Client project</span> : null}
        <span className="pc-go" aria-hidden="true"><ArrowUpRight size={22} /></span>
        {size === "large" ? body : null}
      </div>
      {size === "large" ? null : body}
    </Link>
  );
}
