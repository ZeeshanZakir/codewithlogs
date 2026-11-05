import { ArrowUpRight, Star } from "lucide-react";
import { siTrustpilot } from "simple-icons";
import { trustpilot } from "@/lib/site-config";

function TrustpilotMark({ size = 22 }: { size?: number }) {
  return <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false"><path d={siTrustpilot.path} fill="#00b67a" /></svg>;
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="tp-stars" role="img" aria-label={`Rated ${rating} out of 5`}>
      {Array.from({ length: 5 }, (_, index) => <span key={index} className={index < rating ? "on" : ""}><Star size={14} strokeWidth={0} fill="currentColor" /></span>)}
    </span>
  );
}

/**
 * Trustpilot trust section. Shows real client reviews from site-config when
 * there are any; until then it invites clients to leave an independent review.
 * It never shows a score or reviews that are not on the public profile.
 */
export function TrustpilotSection() {
  const { reviews, profileUrl, reviewUrl } = trustpilot;
  return (
    <section className="tp" aria-labelledby="tp-title">
      <div className="ag-container">
        <div className="tp-card ag-reveal">
          <div className="tp-head">
            <p className="tp-brand"><TrustpilotMark /> Trustpilot</p>
            <h2 id="tp-title" className="hp-h2">{reviews.length ? <>What Clients <span className="ag-hl">Say About Us.</span></> : <>Worked With Us? <span className="ag-hl">Tell the World.</span></>}</h2>
            <p className="tp-text">
              {reviews.length
                ? "Independent reviews from clients, published on Trustpilot."
                : "We collect reviews on Trustpilot, an independent public platform, so future clients can hear directly from the people we have worked with. If we have delivered a project for you, we would value your honest feedback."}
            </p>
            <div className="ag-actions">
              <a href={reviewUrl} target="_blank" rel="noopener noreferrer" className="ag-btn ag-btn-primary ag-btn-lg tp-btn">Review us on Trustpilot <ArrowUpRight size={16} aria-hidden="true" /></a>
              <a href={profileUrl} target="_blank" rel="noopener noreferrer" className="ag-btn ag-btn-outline ag-btn-lg">See our Trustpilot profile</a>
            </div>
          </div>
          {reviews.length ? (
            <ul className="tp-reviews">
              {reviews.slice(0, 3).map((review) => (
                <li key={review.url} className="tp-review">
                  <Stars rating={review.rating} />
                  <h3>{review.title}</h3>
                  <blockquote><p>{review.text}</p></blockquote>
                  <p className="tp-meta">{review.author} · <time dateTime={review.date}>{new Date(review.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</time> · <a href={review.url} target="_blank" rel="noopener noreferrer">Read on Trustpilot</a></p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="tp-art" aria-hidden="true">
              <div className="tp-art-card"><i /><i /><i /><i /></div>
              <div className="tp-art-mark"><TrustpilotMark size={56} /></div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
