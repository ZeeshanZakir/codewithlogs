export function JwtDecoderSeoContent() {
  return (
    <section className="space-y-10">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight text-text">What Is a JSON Web Token (JWT)?</h2>
        <p className="max-w-4xl text-base leading-8 text-text/70">
          JSON Web Token (JWT) is an open standard for securely transmitting information between
          parties as a JSON object. This information can be verified and trusted because it is
          digitally signed. JWTs can be signed using a secret (with the HMAC algorithm) or a
          public/private key pair using RSA or ECDSA.
        </p>
        <p className="max-w-4xl text-base leading-8 text-text/70">
          Although JWTs can be encrypted to also provide secrecy between parties, this tool focuses
          on signed tokens. Signed tokens can verify the integrity of the claims contained within
          them, while encrypted tokens hide those claims from other parties.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight text-text">JWT Structure</h2>
        <p className="max-w-4xl text-base leading-8 text-text/70">
          A JWT consists of three parts separated by dots, which are Header, Payload, and Signature.
        </p>
        <div className="rounded-[24px] border border-black/6 bg-white p-6">
          <ol className="space-y-4 text-base leading-8 text-text/70">
            <li>
              <span className="font-semibold text-text">Header</span> — Typically consists of two
              parts: the type of token (JWT) and the signing algorithm being used, such as HMAC
              SHA256 or RSA.
            </li>
            <li>
              <span className="font-semibold text-text">Payload</span> — Contains the claims. Claims
              are statements about an entity (typically the user) and additional metadata. There are
              three types of claims: registered, public, and private.
            </li>
            <li>
              <span className="font-semibold text-text">Signature</span> — To create the signature
              part you have to take the encoded header, the encoded payload, a secret, the algorithm
              specified in the header, and sign that.
            </li>
          </ol>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight text-text">When Should You Use JWTs?</h2>
        <p className="max-w-4xl text-base leading-8 text-text/70">
          Here are some scenarios where JSON Web Tokens are useful:
        </p>
        <ul className="space-y-3 text-base leading-8 text-text/70 list-disc list-inside">
          <li>
            <span className="font-semibold text-text">Authentication</span> — This is the most common
            scenario for using JWT. Once the user is logged in, each subsequent request will include
            the JWT, allowing the user to access routes, services, and resources that are permitted
            with that token.
          </li>
          <li>
            <span className="font-semibold text-text">Information Exchange</span> — JSON Web Tokens
            are a good way of securely transmitting information between parties. Because JWTs can be
            signed, you can be sure the senders are who they say they are.
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight text-text">How to Use This JWT Decoder</h2>
        <ol className="space-y-3 text-base leading-8 text-text/70">
          <li>
            <span className="font-semibold text-text">1. Paste your JWT</span> in the input field
            above.
          </li>
          <li>
            <span className="font-semibold text-text">2. Inspect the decoded data</span> — The tool
            will automatically decode and display the header, payload, and signature.
          </li>
          <li>
            <span className="font-semibold text-text">3. Copy or download</span> the decoded JSON for
            further inspection.
          </li>
        </ol>
      </div>

      <div className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight text-text">FAQ</h2>
        <div className="space-y-4">
          <div className="rounded-[24px] border border-black/6 bg-white p-6">
            <h3 className="text-lg font-semibold text-text">Is JWT secure?</h3>
            <p className="mt-2 text-base leading-8 text-text/70">
              JWT itself is just a format. Its security depends on how you use it. Always use HTTPS
              to prevent tokens from being stolen in transit, use short expiration times, and never
              store sensitive data in the payload.
            </p>
          </div>
          <div className="rounded-[24px] border border-black/6 bg-white p-6">
            <h3 className="text-lg font-semibold text-text">
              Can anyone decode my JWT?
            </h3>
            <p className="mt-2 text-base leading-8 text-text/70">
              Yes. The header and payload are only base64url encoded, not encrypted. Anyone can
              decode them. The signature ensures that the token hasn't been tampered with, but it
              doesn't hide the content.
            </p>
          </div>
          <div className="rounded-[24px] border border-black/6 bg-white p-6">
            <h3 className="text-lg font-semibold text-text">
              Does this tool validate the signature?
            </h3>
            <p className="mt-2 text-base leading-8 text-text/70">
              This tool only decodes the JWT for inspection. It does not validate the signature, as
              that would require access to the secret or public key used to sign the token.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
