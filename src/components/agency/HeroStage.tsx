import type { CSSProperties } from "react";
import { HeroParallax } from "./HeroParallax";

const depth = (value: number) => ({ "--d": value }) as CSSProperties;

function Slab({ y, tone }: { y: number; tone: "deep" | "mid" | "glow" }) {
  return (
    <g className={`hs-slab hs-slab-${tone}`} transform={`translate(0 ${y})`}>
      <path className="side-l" d="M20 80 L100 120 L100 146 L20 106 Z" />
      <path className="side-r" d="M100 120 L180 80 L180 106 L100 146 Z" />
      <path className="top" d="M100 40 L180 80 L100 120 L20 80 Z" />
      <path className="edge" d="M20 80 L100 120 L180 80" />
    </g>
  );
}

/**
 * The hero art direction: design (type + palette fragments), technology
 * (website preview + code) and growth (analytics + rising stack), layered
 * with depth inside one dark stage. Decorative only.
 */
export function HeroStage() {
  return (
    <HeroParallax className="hs">
      <div className="hs-stage" aria-hidden="true">
        <div className="hs-glow" />
        <div className="hs-floor" />

        <div className="hs-layer hs-site" style={depth(0.35)}>
          <div className="hs-site-bar"><span /><span /><span /><em>yourbrand.com</em></div>
          <div className="hs-site-body">
            <div className="hs-site-nav"><b /><i /><i /><i /><span /></div>
            <p className="hs-site-title">Built to<br /><em>grow.</em></p>
            <div className="hs-site-lines"><i /><i /></div>
            <div className="hs-site-btns"><span /><span /></div>
            <div className="hs-site-media" />
          </div>
        </div>

        <div className="hs-layer hs-object" style={depth(1.1)}>
          <svg viewBox="0 0 200 250" className="hs-stack">
            <defs>
              <linearGradient id="hs-top-glow" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#7ff0dd" /><stop offset="1" stopColor="#35d5bd" /></linearGradient>
              <linearGradient id="hs-top-mid" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#14a393" /><stop offset="1" stopColor="#087f75" /></linearGradient>
              <linearGradient id="hs-top-deep" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#0d5a54" /><stop offset="1" stopColor="#073f3b" /></linearGradient>
            </defs>
            <Slab y={96} tone="deep" />
            <Slab y={48} tone="mid" />
            <Slab y={0} tone="glow" />
          </svg>
          <span className="hs-object-shadow" />
        </div>

        <div className="hs-layer hs-analytics" style={depth(0.8)}>
          <div className="hs-card-head"><span className="hs-dot" />Growth</div>
          <svg viewBox="0 0 240 100" className="hs-chart" preserveAspectRatio="none">
            <path className="grid" d="M0 25H240M0 50H240M0 75H240" />
            <path className="area" d="M0 88 C 30 84 50 78 80 72 S 130 60 160 44 S 210 18 240 10 V100 H0Z" />
            <path className="line" d="M0 88 C 30 84 50 78 80 72 S 130 60 160 44 S 210 18 240 10" />
          </svg>
          <div className="hs-bars"><i /><i /><i /><i /><i /><i /><i /></div>
        </div>

        <div className="hs-layer hs-type" style={depth(1.4)}>
          <span className="hs-aa">Aa</span>
          <div><b>Display</b><small>Editorial serif</small></div>
        </div>

        <div className="hs-layer hs-palette" style={depth(1.6)}>
          <span style={{ background: "#101816" }} /><span style={{ background: "#073f3b" }} /><span style={{ background: "#087f75" }} /><span style={{ background: "#35d5bd" }} />
        </div>

        <div className="hs-layer hs-code" style={depth(1)}>
          <pre><code><span className="k">await</span> <span className="f">launch</span>({"{"}{"\n"}{"  "}design, <span className="f">build</span>,{"\n"}{"  "}grow: <span className="s">true</span>{"\n"}{"}"});</code></pre>
        </div>

        <svg className="hs-links" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M18 30 C 40 30, 52 48, 70 40" />
          <path d="M30 78 C 46 70, 58 74, 74 62" />
        </svg>

      </div>
    </HeroParallax>
  );
}
