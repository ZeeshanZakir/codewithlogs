"use client";

export function BuildLabel() {
  return <p>Public build label: {process.env.NEXT_PUBLIC_FIXTURE_LABEL}</p>;
}
