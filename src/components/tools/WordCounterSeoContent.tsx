export function WordCounterSeoContent() {
  return (
    <section className="space-y-10">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight text-text">Why Use a Word Counter?</h2>
        <p className="max-w-4xl text-base leading-8 text-text/70">
          A word counter helps you stay inside content limits while keeping your writing focused.
          Whether you are drafting blog posts, essays, landing page copy, or product descriptions,
          accurate counts make it easier to hit requirements without constant manual checking.
        </p>
        <p className="max-w-4xl text-base leading-8 text-text/70">
          It is also useful for SEO, editorial planning, and social publishing. You can quickly see
          whether a draft is too short, too long, or close to platform limits before publishing.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight text-text">
          How Reading Time Is Calculated
        </h2>
        <p className="max-w-4xl text-base leading-8 text-text/70">
          Reading time on this tool is estimated using 200 words per minute, which is a widely used
          baseline for average reading speed. This gives you a practical estimate for how long a
          reader may spend on your article, email, or page copy.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight text-text">
          Word Count Requirements by Content Type
        </h2>
        <ul className="space-y-3 text-base leading-8 text-text/70">
          <li>
            <span className="font-semibold text-text">Blog post:</span> 1,500-2,500 words
          </li>
          <li>
            <span className="font-semibold text-text">SEO article:</span> 1,000-2,000 words
          </li>
          <li>
            <span className="font-semibold text-text">Novel chapter:</span> 3,000-5,000 words
          </li>
          <li>
            <span className="font-semibold text-text">Tweet:</span> max 280 characters
          </li>
          <li>
            <span className="font-semibold text-text">Meta description:</span> 150-160 characters
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight text-text">FAQ</h2>
        <div className="space-y-4">
          <div className="rounded-[24px] border border-black/6 bg-white p-6">
            <h3 className="text-lg font-semibold text-text">
              Does this word counter send my text anywhere?
            </h3>
            <p className="mt-2 text-base leading-8 text-text/70">
              No. All counting and analysis happens directly in your browser.
            </p>
          </div>
          <div className="rounded-[24px] border border-black/6 bg-white p-6">
            <h3 className="text-lg font-semibold text-text">
              How are paragraphs counted?
            </h3>
            <p className="mt-2 text-base leading-8 text-text/70">
              Paragraphs are detected using double line breaks between text blocks.
            </p>
          </div>
          <div className="rounded-[24px] border border-black/6 bg-white p-6">
            <h3 className="text-lg font-semibold text-text">
              How are sentences counted?
            </h3>
            <p className="mt-2 text-base leading-8 text-text/70">
              Sentences are detected using `.`, `!`, and `?` punctuation endings.
            </p>
          </div>
          <div className="rounded-[24px] border border-black/6 bg-white p-6">
            <h3 className="text-lg font-semibold text-text">
              Can I use this for SEO content planning?
            </h3>
            <p className="mt-2 text-base leading-8 text-text/70">
              Yes. It is useful for checking article length, reading time, and meta-description
              limits while drafting SEO content.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
