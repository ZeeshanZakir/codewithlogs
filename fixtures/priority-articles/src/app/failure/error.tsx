"use client";

import { useEffect } from "react";

export default function Failure({ error, reset }: {
  error: Error & { digest?: string }; reset: () => void;
}) {
  useEffect(() => {
    console.error("fixture_segment_failed", { digest: error.digest });
  }, [error]);
  return <section><h2>This section could not load.</h2>
    {error.digest && <p>Reference: {error.digest}</p>}
    <button type="button" onClick={reset}>Try again</button>
  </section>;
}
