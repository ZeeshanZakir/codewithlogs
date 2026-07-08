export function CssMinifierSeoContent() {
  return (
    <section className="space-y-10">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight text-text">What Is CSS Minification?</h2>
        <p className="max-w-4xl text-base leading-8 text-text/70">
          CSS minification removes comments, extra spaces, line breaks, and other non-essential
          characters from your stylesheet so the file becomes smaller without changing how it works.
          The result is leaner CSS that loads faster and sends fewer bytes to the browser.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight text-text">
          How Much Can CSS Minification Save?
        </h2>
        <p className="max-w-4xl text-base leading-8 text-text/70">
          Typical CSS files often shrink by 20% to 80% depending on how much whitespace, commenting,
          and repeated formatting they contain. Large utility stylesheets and hand-written theme files
          usually benefit the most because there is more non-essential formatting to remove.
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

      <div className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight text-text">FAQ</h2>
        <div className="space-y-4">
          <div className="rounded-[24px] border border-black/6 bg-white p-6">
            <h3 className="text-lg font-semibold text-text">Does minification break my CSS?</h3>
            <p className="mt-2 text-base leading-8 text-text/70">
              Proper minification should not change the meaning of valid CSS. It only removes
              formatting and other non-essential characters.
            </p>
          </div>
          <div className="rounded-[24px] border border-black/6 bg-white p-6">
            <h3 className="text-lg font-semibold text-text">
              Should I minify CSS in development?
            </h3>
            <p className="mt-2 text-base leading-8 text-text/70">
              Usually no. Beautified CSS is easier to debug in development, while minified CSS is
              best for production builds.
            </p>
          </div>
          <div className="rounded-[24px] border border-black/6 bg-white p-6">
            <h3 className="text-lg font-semibold text-text">
              What&apos;s the difference between minify and compress?
            </h3>
            <p className="mt-2 text-base leading-8 text-text/70">
              Minify changes the source code to remove extra characters. Compression like Gzip or
              Brotli reduces transfer size when the file is sent over the network.
            </p>
          </div>
          <div className="rounded-[24px] border border-black/6 bg-white p-6">
            <h3 className="text-lg font-semibold text-text">
              Is this tool safe for production CSS?
            </h3>
            <p className="mt-2 text-base leading-8 text-text/70">
              Yes, for normal valid CSS. This tool runs in your browser and is safe to use for checking
              production styles before deployment.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
