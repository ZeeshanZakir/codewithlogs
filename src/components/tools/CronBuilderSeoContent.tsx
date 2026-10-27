import Link from "next/link";

export function CronBuilderSeoContent() {
  return (
    <section className="space-y-10">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight text-text">What Is a Cron Expression?</h2>
        <p className="max-w-4xl text-base leading-8 text-text/70">
          Cron dialects differ between schedulers. This tool supports a numeric five-field subset:
          minute, hour, day of month, month and day of week. It previews UTC times and uses Cronie-style
          OR matching when both day fields are restricted. It does not implement AWS EventBridge or Quartz syntax.
        </p>
        <p className="max-w-4xl text-base leading-8 text-text/70">
          Cron syntax uses simple special characters to represent every unit, ranges, steps, and lists,
          with steps supported on wildcards or ranges. A step resets within its field; it is not an elapsed-time interval. If you
          work with APIs or scheduled jobs, you might also use tools like our <Link href="/tools/base64" className="text-primary font-semibold hover:underline">Base64 Encoder</Link> to handle payloads.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight text-text">Cron Field Reference</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm rounded-[24px] border border-black/6 bg-white">
            <thead>
              <tr className="border-b border-black/10">
                <th className="text-left py-3 px-4 text-text font-semibold">Field</th>
                <th className="text-left py-3 px-4 text-text font-semibold">Allowed Values</th>
                <th className="text-left py-3 px-4 text-text font-semibold">Special Characters</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-black/5">
                <td className="py-3 px-4 text-text/70">Minute</td>
                <td className="py-3 px-4 text-text/70">0-59</td>
                <td className="py-3 px-4 text-text/70">* , - /</td>
              </tr>
              <tr className="border-b border-black/5">
                <td className="py-3 px-4 text-text/70">Hour</td>
                <td className="py-3 px-4 text-text/70">0-23</td>
                <td className="py-3 px-4 text-text/70">* , - /</td>
              </tr>
              <tr className="border-b border-black/5">
                <td className="py-3 px-4 text-text/70">Day of Month</td>
                <td className="py-3 px-4 text-text/70">1-31</td>
                <td className="py-3 px-4 text-text/70">* , - /</td>
              </tr>
              <tr className="border-b border-black/5">
                <td className="py-3 px-4 text-text/70">Month</td>
                <td className="py-3 px-4 text-text/70">1-12</td>
                <td className="py-3 px-4 text-text/70">* , - /</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-text/70">Day of Week</td>
                <td className="py-3 px-4 text-text/70">0-6 (Sun-Sat)</td>
                <td className="py-3 px-4 text-text/70">* , - /</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight text-text">Common Cron Expression Examples</h2>
        <p className="text-sm text-text/70">All examples below are interpreted in UTC.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm rounded-[24px] border border-black/6 bg-white">
            <thead>
              <tr className="border-b border-black/10">
                <th className="text-left py-3 px-4 text-text font-semibold">Expression</th>
                <th className="text-left py-3 px-4 text-text font-semibold">Meaning</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-black/5">
                <td className="py-3 px-4 font-mono text-text/70">* * * * *</td>
                <td className="py-3 px-4 text-text/70">Every minute</td>
              </tr>
              <tr className="border-b border-black/5">
                <td className="py-3 px-4 font-mono text-text/70">0 * * * *</td>
                <td className="py-3 px-4 text-text/70">Every hour</td>
              </tr>
              <tr className="border-b border-black/5">
                <td className="py-3 px-4 font-mono text-text/70">0 0 * * *</td>
                <td className="py-3 px-4 text-text/70">Every day at midnight</td>
              </tr>
              <tr className="border-b border-black/5">
                <td className="py-3 px-4 font-mono text-text/70">0 9 * * 1-5</td>
                <td className="py-3 px-4 text-text/70">Every weekday at 9am</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-mono text-text/70">0 0 1 * *</td>
                <td className="py-3 px-4 text-text/70">First day of every month</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </section>
  );
}
