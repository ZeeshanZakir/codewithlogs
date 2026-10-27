export function WordCounterSeoContent() {
  return (
    <section className="space-y-10">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight text-text">Why Use a Word Counter?</h2>
        <p className="max-w-4xl text-base leading-8 text-text/70">
          A word counter helps you stay inside content limits while keeping your writing focused.
          Whether you are drafting blog posts, essays, landing page copy, or product descriptions,
          whitespace-based word counts help track draft length. A publisher may count words or characters differently.
        </p>
        <p className="max-w-4xl text-base leading-8 text-text/70">
          Use the counts for editorial planning, then check the destination platform for its own limits.
          This tool does not predict search rankings or enforce a platform-specific character budget.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight text-text">
          How Reading Time Is Calculated
        </h2>
        <p className="max-w-4xl text-base leading-8 text-text/70">
          Reading time on this tool uses a fixed assumption of 200 words per minute. This gives you a practical estimate for how long a
          reader may spend on your article, email, or page copy.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight text-text">
          Word Count Requirements by Content Type
        </h2>
        <p className="max-w-4xl text-base leading-8 text-text/70">
          Use the requirements from your editor, assignment or publishing platform. There is no universal
          word count for a blog post or SEO article. Character counts here use JavaScript UTF-16 length,
          so emoji and some scripts may differ from the count shown by your destination platform.
        </p>
      </div>

    </section>
  );
}
