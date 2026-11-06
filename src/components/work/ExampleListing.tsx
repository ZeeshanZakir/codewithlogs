import { CheckCircle2, ImageIcon, Info, PlayCircle } from "lucide-react";

/** Sample data for the demonstration listing. Not a real product or page. */
const sample = {
  title: "Wireless ANC Earbuds with 4-Mic ENC, Bluetooth 5.3 and 30-Hour Battery Case",
  slug: "/products/wireless-anc-earbuds-bluetooth-5-3",
  description:
    "Block out the commute and take calls clearly. These true wireless earbuds combine active noise cancellation with four environmental-noise-cancelling microphones, a low-latency Bluetooth 5.3 connection and a pocket-sized charging case for all-day listening.",
  specs: [
    ["Connectivity", "Bluetooth 5.3"],
    ["Noise control", "ANC + 4-mic ENC"],
    ["Battery", "Up to 30 h with case"],
    ["Water resistance", "IPX4"],
    ["Charging", "USB-C"],
  ],
  keywords: ["wireless earbuds", "ANC earbuds", "Bluetooth 5.3 earbuds", "earbuds with mic", "noise cancelling earbuds"],
  metaTitle: "Wireless ANC Earbuds, Bluetooth 5.3, 30h Battery",
  metaDescription: "True wireless ANC earbuds with 4-mic ENC for clear calls, Bluetooth 5.3 and up to 30 hours of playback with the charging case.",
  segment: "01:12 – 02:48",
};

function Counter({ value, limit }: { value: string; limit: number }) {
  const ok = value.length <= limit;
  return <span className={`ex-count${ok ? "" : " is-over"}`}>{value.length}/{limit}</span>;
}

export function ExampleListing() {
  return (
    <figure className="ex" aria-labelledby="ex-caption">
      <div className="ex-bar">
        <span className="ex-dots" aria-hidden="true"><i /><i /><i /></span>
        <span className="ex-url">yourstore.com{sample.slug}</span>
        <span className="ex-status"><CheckCircle2 size={15} aria-hidden="true" /> Published</span>
      </div>
      <p className="ex-demo"><Info size={15} aria-hidden="true" /> Demonstration with sample data. This is not a real published product.</p>
      <div className="ex-body">
        <div className="ex-media">
          <div className="ex-product" role="img" aria-label="Illustration of a pair of wireless earbuds in a charging case">
            <span className="ex-case" /><span className="ex-bud ex-bud-l" /><span className="ex-bud ex-bud-r" />
          </div>
          <div className="ex-thumbs" aria-label="Collected product images">
            {[1, 2, 3].map((n) => <span key={n} className="ex-thumb"><ImageIcon size={16} aria-hidden="true" /></span>)}
          </div>
          <div className="ex-video">
            <PlayCircle size={34} strokeWidth={1.4} aria-hidden="true" />
            <div><p>Embedded YouTube segment</p><small>{sample.segment} · played in YouTube&apos;s player</small></div>
          </div>
        </div>
        <div className="ex-content">
          <p className="ex-label">SEO product title</p>
          <h3 className="ex-title">{sample.title}</h3>
          <p className="ex-label">Description</p>
          <p className="ex-desc">{sample.description}</p>
          <p className="ex-label">Key specifications</p>
          <dl className="ex-specs">
            {sample.specs.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
          </dl>
          <p className="ex-label">Target keywords</p>
          <ul className="ex-keywords">{sample.keywords.map((keyword) => <li key={keyword}>{keyword}</li>)}</ul>
          <div className="ex-seo">
            <p className="ex-label">Search preview <Counter value={sample.metaTitle} limit={60} /> <Counter value={sample.metaDescription} limit={160} /></p>
            <p className="ex-serp-url">yourstore.com › products</p>
            <p className="ex-serp-title">{sample.metaTitle}</p>
            <p className="ex-serp-desc">{sample.metaDescription}</p>
          </div>
        </div>
      </div>
      <figcaption id="ex-caption" className="sr-only">Example of a product listing assembled by the automation, using sample data.</figcaption>
    </figure>
  );
}
