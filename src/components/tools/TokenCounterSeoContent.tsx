import Link from "next/link";

export function TokenCounterSeoContent() {
  return (
    <section className="space-y-10">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight text-text">Why Token Count Matters</h2>
        <p className="max-w-4xl text-base leading-8 text-text/70">
          AI APIs charge based on tokens processed, not words or characters. Understanding your prompt&apos;s token count helps you estimate costs before sending requests and helps plan text length; complete requests also include framing and other inputs. If you&apos;re working with encoded data, check out our <Link href="/tools/base64" className="text-primary font-semibold hover:underline">Base64 Encoder</Link> to handle payloads safely.
        </p>
        <p className="max-w-4xl text-base leading-8 text-text/70">
          Context windows limit how much text a model can process in a single request, so optimizing your prompts can save money and prevent truncation errors in your applications.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight text-text">How Tokenization Works</h2>
        <p className="max-w-4xl text-base leading-8 text-text/70">
          The GPT-4o option counts pasted text with the local o200k_base tokenizer. Claude and Gemini
          use a length-divided-by-four heuristic, which can be inaccurate for code, non-English text and emoji.
          Context bars are illustrative thresholds, not checks against a selected model’s current limits.
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
                <td className="py-3 px-4 text-text/70">UTF-16 code units</td>
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
                <td className="py-3 px-4 text-text/70">One input to usage-based billing</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </section>
  );
}
