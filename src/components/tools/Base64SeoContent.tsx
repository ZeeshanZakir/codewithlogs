export function Base64SeoContent() {
  return (
    <section className="space-y-10">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight text-text">What Is Base64 Encoding?</h2>
        <p className="max-w-4xl text-base leading-8 text-text/70">
          Base64 is a text-based encoding format that turns binary data into readable characters.
          Developers use it when raw binary bytes need to move through systems that expect plain
          text, such as HTML, JSON payloads, email bodies, or headers.
        </p>
        <p className="max-w-4xl text-base leading-8 text-text/70">
          It does not compress or secure data. Instead, it changes the representation so that files,
          images, or credentials can be safely transported in text-friendly environments.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight text-text">
          When Do Developers Use Base64?
        </h2>
        <p className="max-w-4xl text-base leading-8 text-text/70">
          Common use cases include email attachments, inline data URLs, API authentication headers,
          and embedding small images directly in CSS or HTML. It is also useful when you need to
          inspect file payloads while debugging browser or backend workflows.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight text-text">
          Base64 vs URL Encoding — What&apos;s the Difference?
        </h2>
        <p className="max-w-4xl text-base leading-8 text-text/70">
          Base64 converts raw data into a limited character set. URL encoding is different: it
          escapes reserved URL characters such as spaces, `?`, `&`, or `#`. If you need binary or
          file content represented as text, use Base64. If you need to safely place characters inside
          a URL, use URL encoding.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight text-text">How to Use This Base64 Tool</h2>
        <ol className="space-y-3 text-base leading-8 text-text/70">
          <li>
            <span className="font-semibold text-text">1. Choose a tab</span> for text conversion or
            image/file conversion.
          </li>
          <li>
            <span className="font-semibold text-text">2. Paste or upload content</span> and decide
            whether you want to encode or decode it.
          </li>
          <li>
            <span className="font-semibold text-text">3. Copy, swap, preview, or download</span> the
            output once the browser finishes processing it.
          </li>
        </ol>
      </div>

      <div className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight text-text">FAQ</h2>
        <div className="space-y-4">
          <div className="rounded-[24px] border border-black/6 bg-white p-6">
            <h3 className="text-lg font-semibold text-text">
              Is Base64 the same as encryption?
            </h3>
            <p className="mt-2 text-base leading-8 text-text/70">
              No. Base64 is encoding, not encryption. Anyone can decode it instantly.
            </p>
          </div>
          <div className="rounded-[24px] border border-black/6 bg-white p-6">
            <h3 className="text-lg font-semibold text-text">Can I encode images to Base64?</h3>
            <p className="mt-2 text-base leading-8 text-text/70">
              Yes. Use the Image/File tab to upload and convert supported image files directly in
              your browser.
            </p>
          </div>
          <div className="rounded-[24px] border border-black/6 bg-white p-6">
            <h3 className="text-lg font-semibold text-text">What is URL-safe Base64?</h3>
            <p className="mt-2 text-base leading-8 text-text/70">
              It is a variant that replaces `+` and `/` with `-` and `_` so the output works more
              safely inside URLs and filenames.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
