export function JsonToolSeoContent() {
  return (
    <section className="space-y-10">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight text-text">What is JSON Formatting?</h2>
        <p className="max-w-4xl text-base leading-8 text-text/70">
          JSON formatting turns raw JSON data into a readable structure with indentation, line
          breaks, and clear nesting. That makes it much easier to inspect complex objects, arrays,
          API payloads, and configuration files without missing important details.
        </p>
        <p className="max-w-4xl text-base leading-8 text-text/70">
          This is especially useful when working with REST API responses, MongoDB documents,
          frontend or backend config files, and webhook payloads. A clean formatted view helps you
          debug faster, spot bad values, and understand the structure immediately.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight text-text">
          How to Use This JSON Formatter
        </h2>
        <ol className="space-y-3 text-base leading-8 text-text/70">
          <li>
            <span className="font-semibold text-text">1. Paste JSON</span> into the input panel or
            load the sample JSON.
          </li>
          <li>
            <span className="font-semibold text-text">2. Click Format</span> to validate and
            beautify the structure, or use Minify to compress it.
          </li>
          <li>
            <span className="font-semibold text-text">3. Copy result</span> from the output panel
            and use it in your project, API client, or database workflow.
          </li>
        </ol>
      </div>

      <div className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight text-text">What Is JSON Validation?</h2>
        <p className="max-w-4xl text-base leading-8 text-text/70">
          JSON validation checks whether your text follows proper JSON syntax. If even one bracket,
          comma, quote, or colon is wrong, the entire document becomes invalid and most tools or
          APIs will reject it.
        </p>
        <p className="max-w-4xl text-base leading-8 text-text/70">
          This validator uses the browser&apos;s native JSON parser, so the error messages are real,
          immediate, and useful for fixing malformed input before it reaches your application.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight text-text">
          Common JSON Errors and How to Fix Them
        </h2>
        <ul className="space-y-3 text-base leading-8 text-text/70">
          <li>
            <span className="font-semibold text-text">Missing quotes:</span> JSON keys and string
            values must use double quotes.
          </li>
          <li>
            <span className="font-semibold text-text">Trailing commas:</span> Remove commas after
            the last item in an object or array.
          </li>
          <li>
            <span className="font-semibold text-text">Unescaped strings:</span> Escape inner quotes
            and special characters inside string values.
          </li>
          <li>
            <span className="font-semibold text-text">Wrong brackets:</span> Make sure arrays use
            `[]` and objects use `{}` in the right places.
          </li>
          <li>
            <span className="font-semibold text-text">Missing colons:</span> Every object key must
            be followed by a colon before its value.
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight text-text">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div className="rounded-[24px] border border-black/6 bg-white p-6">
            <h3 className="text-lg font-semibold text-text">Is my JSON data sent to a server?</h3>
            <p className="mt-2 text-base leading-8 text-text/70">
              No. Everything runs in your browser. Zero data leaves your device.
            </p>
          </div>
          <div className="rounded-[24px] border border-black/6 bg-white p-6">
            <h3 className="text-lg font-semibold text-text">
              What is the difference between formatting and minifying JSON?
            </h3>
            <p className="mt-2 text-base leading-8 text-text/70">
              Formatting adds spaces and line breaks for readability. Minifying removes them to
              reduce file size.
            </p>
          </div>
          <div className="rounded-[24px] border border-black/6 bg-white p-6">
            <h3 className="text-lg font-semibold text-text">
              Can I use this tool for large JSON files?
            </h3>
            <p className="mt-2 text-base leading-8 text-text/70">
              Yes, up to several MB of JSON can be processed instantly.
            </p>
          </div>
          <div className="rounded-[24px] border border-black/6 bg-white p-6">
            <h3 className="text-lg font-semibold text-text">
              What JSON version does this support?
            </h3>
            <p className="mt-2 text-base leading-8 text-text/70">
              Standard JSON (RFC 8259) including nested objects and arrays.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
