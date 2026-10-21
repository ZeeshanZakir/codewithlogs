import Link from "next/link";

export function TokenCounterSeoContent() {
  return (
    <section className="space-y-10">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight text-text">Why Token Count Matters</h2>
        <p className="max-w-4xl text-base leading-8 text-text/70">
          AI APIs charge based on tokens processed, not words or characters. Understanding your prompt&apos;s token count helps you estimate costs before sending requests and ensures you stay within model context windows. If you&apos;re working with encoded data, check out our <Link href="/tools/base64" className="text-primary font-semibold hover:underline">Base64 Encoder</Link> to handle payloads safely.
        </p>
        <p className="max-w-4xl text-base leading-8 text-text/70">
          Context windows limit how much text a model can process in a single request, so optimizing your prompts can save money and prevent truncation errors in your applications.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight text-text">How Tokenization Works</h2>
        <p className="max-w-4xl text-base leading-8 text-text/70">
          Models split text into sub-word tokens instead of exact words. In English, a token is roughly 4 characters or 0.75 words on average. For example, &quot;unhappiness&quot; might be split into &quot;un&quot;, &quot;happiness&quot; instead of being treated as a single word.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight text-text">Token Counter vs Character Counter</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm rounded-[24px] border border-black/6 bg-white">
            <thead>
              <tr className="border-b border-black/10">
                <th className="text-left py-3 px-4 text-text font-semibold">Metric</th>
                <th className="text-left py-3 px-4 text-text font-semibold">What It Measures</th>
                <th className="text-left py-3 px-4 text-text font-semibold">Why It Matters</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-black/5">
                <td className="py-3 px-4 text-text/70">Characters</td>
                <td className="py-3 px-4 text-text/70">Raw text length</td>
                <td className="py-3 px-4 text-text/70">Not billed by LLM APIs</td>
              </tr>
              <tr className="border-b border-black/5">
                <td className="py-3 px-4 text-text/70">Words</td>
                <td className="py-3 px-4 text-text/70">Whitespace-separated units</td>
                <td className="py-3 px-4 text-text/70">Rough estimate only</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-text/70">Tokens</td>
                <td className="py-3 px-4 text-text/70">Model&apos;s actual processing unit</td>
                <td className="py-3 px-4 text-text/70">What you&apos;re billed for</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight text-text">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div className="rounded-[24px] border border-black/6 bg-white p-6">
            <h3 className="text-lg font-semibold text-text">Is this an exact token count?</h3>
            <p className="mt-2 text-base leading-8 text-text/70">
              For GPT models, yes, using the same tokenizer family as the OpenAI API. For Claude and Gemini, it&apos;s a close estimate since their exact tokenizers aren&apos;t public.
            </p>
          </div>
          <div className="rounded-[24px] border border-black/6 bg-white p-6">
            <h3 className="text-lg font-semibold text-text">Why do different models count differently for the same text?</h3>
            <p className="mt-2 text-base leading-8 text-text/70">
              Each model family uses its own vocabulary and tokenization rules, so identical text can produce different token counts.
            </p>
          </div>
          <div className="rounded-[24px] border border-black/6 bg-white p-6">
            <h3 className="text-lg font-semibold text-text">Does this tool store my prompts?</h3>
            <p className="mt-2 text-base leading-8 text-text/70">
              No, everything is processed locally in your browser. Nothing is uploaded or logged. If you need secure token handling, our <Link href="/tools/jwt-decoder" className="text-primary font-semibold hover:underline">JWT Decoder</Link> can help with API tokens.
            </p>
          </div>
          <div className="rounded-[24px] border border-black/6 bg-white p-6">
            <h3 className="text-lg font-semibold text-text">How can I reduce token usage?</h3>
            <p className="mt-2 text-base leading-8 text-text/70">
              Remove redundant instructions, use concise phrasing, and avoid repeating context the model doesn&apos;t need.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
