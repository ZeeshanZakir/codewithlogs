export function CssMinifierSeoContent() {
  return (
    <section className="space-y-10">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight text-text">What Is CSS Minification?</h2>
        <p className="max-w-4xl text-base leading-8 text-text/70">
          This tool removes structural whitespace with a CSS parser. It preserves comments, selectors,
          declaration values and their order, including spacing inside strings and calc() expressions.
          It checks parseable syntax, not property validity or browser support. Test the result in your project.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight text-text">
          How Much Can CSS Minification Save?
        </h2>
        <p className="max-w-4xl text-base leading-8 text-text/70">
          Savings depend on the input. The displayed percentage compares uncompressed UTF-8 byte sizes
          before and after processing; it does not measure network transfer size or loading speed.
          Comments and value whitespace are retained, so already compact CSS may barely change.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight text-text">
          CSS Minification vs Gzip Compression
        </h2>
        <p className="max-w-4xl text-base leading-8 text-text/70">
          Minification reduces the CSS source itself before it is served. Gzip or Brotli compression
          happens during delivery over the network. In production, you should usually use both:
          minify the file first, then let the server compress the response for even better results.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight text-text">
          How to Use This CSS Minifier
        </h2>
        <ol className="space-y-3 text-base leading-8 text-text/70">
          <li>
            <span className="font-semibold text-text">1. Paste your CSS</span> into the input panel
            or load the sample stylesheet.
          </li>
          <li>
            <span className="font-semibold text-text">2. Click Minify CSS</span> to compress it or
            Beautify CSS to make it readable.
          </li>
          <li>
            <span className="font-semibold text-text">3. Copy the output</span> and use it in your
            project or deployment workflow.
          </li>
        </ol>
      </div>

    </section>
  );
}
