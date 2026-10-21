import Link from "next/link";

export function CronBuilderSeoContent() {
  return (
    <section className="space-y-10">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight text-text">What Is a Cron Expression?</h2>
        <p className="max-w-4xl text-base leading-8 text-text/70">
          A cron expression is a string of five fields that defines a schedule for recurring tasks.
          It&apos;s widely used in Linux crontab files, CI/CD pipelines like GitHub Actions, and cloud
          services such as AWS EventBridge to automate jobs that run on a set timetable.
        </p>
        <p className="max-w-4xl text-base leading-8 text-text/70">
          Cron syntax uses simple special characters to represent every unit, ranges, steps, and lists,
          making it flexible enough to describe almost any recurring schedule you can imagine. If you
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

      <div className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight text-text">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div className="rounded-[24px] border border-black/6 bg-white p-6">
            <h3 className="text-lg font-semibold text-text">Does this tool run my cron job?</h3>
            <p className="mt-2 text-base leading-8 text-text/70">
              No, this only builds and explains the expression. Use it in your crontab, CI/CD config, or scheduler (AWS EventBridge, GitHub Actions, etc.)
            </p>
          </div>
          <div className="rounded-[24px] border border-black/6 bg-white p-6">
            <h3 className="text-lg font-semibold text-text">What timezone are the &quot;next run times&quot; based on?</h3>
            <p className="mt-2 text-base leading-8 text-text/70">
              Your browser&apos;s local timezone. Actual server cron jobs typically run in the server&apos;s configured timezone (often UTC).
            </p>
          </div>
          <div className="rounded-[24px] border border-black/6 bg-white p-6">
            <h3 className="text-lg font-semibold text-text">Can I schedule &quot;every 15 minutes&quot;?</h3>
            <p className="mt-2 text-base leading-8 text-text/70">
              Yes, use the step syntax: */15 * * * *
            </p>
          </div>
          <div className="rounded-[24px] border border-black/6 bg-white p-6">
            <h3 className="text-lg font-semibold text-text">Is data sent anywhere?</h3>
            <p className="mt-2 text-base leading-8 text-text/70">
              No, all parsing and calculation happens locally in your browser. For secure token handling, check out our <Link href="/tools/jwt-decoder" className="text-primary font-semibold hover:underline">JWT Decoder</Link>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
