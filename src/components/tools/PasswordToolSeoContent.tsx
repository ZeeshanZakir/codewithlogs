export function PasswordToolSeoContent() {
  return (
    <section className="space-y-10">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight text-text">Why Use a Password Generator?</h2>
        <p className="max-w-4xl text-base leading-8 text-text/70">
          Weak passwords are one of the easiest ways attackers break into accounts. Reused passwords,
          short words, and predictable patterns make it much easier for brute-force tools and leaked
          credential databases to succeed.
        </p>
        <p className="max-w-4xl text-base leading-8 text-text/70">
          A password generator removes guesswork by creating long, random combinations that are much
          harder to crack. Instead of relying on memorable phrases or minor variations, you get a
          stronger password built for real-world security.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight text-text">How Strong Is Your Password?</h2>
        <div className="overflow-x-auto rounded-[24px] border border-black/6 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-surface text-text/65">
              <tr>
                <th className="px-5 py-4 font-semibold">Length</th>
                <th className="px-5 py-4 font-semibold">Character Types</th>
                <th className="px-5 py-4 font-semibold">Estimated Crack Time</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-black/6">
                <td className="px-5 py-4">8 chars</td>
                <td className="px-5 py-4">Letters only</td>
                <td className="px-5 py-4 text-red-700">Very Weak | Minutes</td>
              </tr>
              <tr className="border-t border-black/6">
                <td className="px-5 py-4">12 chars</td>
                <td className="px-5 py-4">Mixed</td>
                <td className="px-5 py-4 text-orange-700">Moderate | Days</td>
              </tr>
              <tr className="border-t border-black/6">
                <td className="px-5 py-4">16 chars</td>
                <td className="px-5 py-4">All types</td>
                <td className="px-5 py-4 text-blue-700">Strong | Centuries</td>
              </tr>
              <tr className="border-t border-black/6">
                <td className="px-5 py-4">20+ chars</td>
                <td className="px-5 py-4">All types</td>
                <td className="px-5 py-4 text-emerald-700">Very Strong | Billions of years</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight text-text">
          How to Use This Password Generator
        </h2>
        <ol className="space-y-3 text-base leading-8 text-text/70">
          <li>
            <span className="font-semibold text-text">1. Choose length</span> using the slider to
            match your security requirements.
          </li>
          <li>
            <span className="font-semibold text-text">2. Select character types</span> like uppercase,
            lowercase, numbers, and symbols.
          </li>
          <li>
            <span className="font-semibold text-text">3. Click Generate</span> to create a fresh
            secure password instantly.
          </li>
          <li>
            <span className="font-semibold text-text">4. Copy and use</span> the password in your
            account or save it in a password manager.
          </li>
        </ol>
      </div>

      <div className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight text-text">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div className="rounded-[24px] border border-black/6 bg-white p-6">
            <h3 className="text-lg font-semibold text-text">
              Are generated passwords stored or sent to a server?
            </h3>
            <p className="mt-2 text-base leading-8 text-text/70">
              No. Everything runs in your browser. Zero data leaves your device.
            </p>
          </div>
          <div className="rounded-[24px] border border-black/6 bg-white p-6">
            <h3 className="text-lg font-semibold text-text">What makes a password strong?</h3>
            <p className="mt-2 text-base leading-8 text-text/70">
              Length + variety. 16+ characters with uppercase, lowercase, numbers, and symbols.
            </p>
          </div>
          <div className="rounded-[24px] border border-black/6 bg-white p-6">
            <h3 className="text-lg font-semibold text-text">How often should I change passwords?</h3>
            <p className="mt-2 text-base leading-8 text-text/70">
              Use a unique password for every account. Change if a site reports a breach.
            </p>
          </div>
          <div className="rounded-[24px] border border-black/6 bg-white p-6">
            <h3 className="text-lg font-semibold text-text">Should I use a password manager?</h3>
            <p className="mt-2 text-base leading-8 text-text/70">
              Yes. Tools like Bitwarden or 1Password store passwords securely so you only need to
              remember one.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
