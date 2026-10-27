import Link from "next/link";

export function RegexTesterSeoContent() {
  return (
    <section className="space-y-10">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight text-text">What Is a Regular Expression?</h2>
        <p className="max-w-4xl text-base leading-8 text-text/70">
          A regular expression (regex) is a sequence of characters that defines a search pattern. They&apos;re used for validation, search-and-replace operations, and parsing text in applications.
        </p>
        <p className="max-w-4xl text-base leading-8 text-text/70">
          Regex patterns are supported in almost every programming language and text editor, making them an essential tool for developers. If you&apos;re working with JSON data, check out our <Link href="/tools/json-formatter" className="text-primary font-semibold hover:underline">JSON Formatter</Link> to clean and inspect your payloads.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight text-text">Common Regex Patterns</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm rounded-[24px] border border-black/6 bg-white">
            <thead>
              <tr className="border-b border-black/10">
                <th className="text-left py-3 px-4 text-text font-semibold">Pattern</th>
                <th className="text-left py-3 px-4 text-text font-semibold">Matches</th>
                <th className="text-left py-3 px-4 text-text font-semibold">Example</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-black/5">
                <td className="py-3 px-4 font-mono text-text/70">{'^[\\w.+-]+@[\\w-]+\\.[a-zA-Z]{2,}$'}</td>
                <td className="py-3 px-4 text-text/70">Email address</td>
                <td className="py-3 px-4 text-text/70">user@example.com</td>
              </tr>
              <tr className="border-b border-black/5">
                <td className="py-3 px-4 font-mono text-text/70">{'^\\d{3}-\\d{3}-\\d{4}$'}</td>
                <td className="py-3 px-4 text-text/70">US phone number</td>
                <td className="py-3 px-4 text-text/70">555-123-4567</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-mono text-text/70">{'^https?:\\/\\/.+'}</td>
                <td className="py-3 px-4 text-text/70">URL</td>
                <td className="py-3 px-4 text-text/70">https://example.com</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight text-text">How to Use This Regex Tester</h2>
        <ol className="space-y-3 text-base leading-8 text-text/70 list-decimal list-inside">
          <li>Enter your regex pattern in the pattern input field</li>
          <li>Set any flags you need (global, case-insensitive, multiline, dotAll)</li>
          <li>Paste or type your test text in the test text area</li>
          <li>Review the highlighted matches and captured groups</li>
        </ol>
      </div>

    </section>
  );
}
