import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
export function Footer() {
  return <footer className="journal-footer"><div className="journal-container">
    <div className="footer-top"><div><Link href="/" className="journal-wordmark"><span className="brand-mark" aria-hidden="true">/l</span>codewithlogs<span className="brand-period">.</span></Link><p>Practical notes for people who build.<br />Next.js. Supabase. The bugs in between.</p></div><nav aria-label="Explore"><h2>Explore</h2><Link href="/blog">All articles</Link><Link href="/tools">Developer tools</Link><Link href="/about">About the author</Link><Link href="/contact">Contact & corrections</Link></nav><nav aria-label="More"><h2>Elsewhere</h2><a href="https://github.com/ZeeshanZakir/" target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={13} /></a><a href="https://www.linkedin.com/company/code-with-logs" target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={13} /></a><Link href="/services">Work with me</Link><Link href="/gallery">Gallery</Link></nav></div>
    <div className="footer-bottom"><p>© {new Date().getFullYear()} CodeWithLogs. Keep building. Keep learning.</p><nav aria-label="Legal"><Link href="/privacy-policy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/disclaimer">Disclaimer & disclosures</Link></nav></div>
  </div></footer>;
}

