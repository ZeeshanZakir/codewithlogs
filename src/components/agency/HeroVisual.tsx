/**
 * Decorative hero composition: design, technology and growth as three linked
 * layers. Purely presentational, so it is hidden from assistive technology.
 */
export function HeroVisual() {
  return (
    <div className="ag-hv" aria-hidden="true">
      <svg className="ag-hv-link" viewBox="0 0 520 560" preserveAspectRatio="none">
        <path d="M118 150 C 250 150, 300 250, 392 296 S 300 470, 150 452" />
      </svg>

      <div className="ag-hv-card ag-hv-design">
        <div className="ag-hv-label"><span>01</span>Design</div>
        <div className="ag-hv-specimen">
          <span className="ag-hv-aa">Aa</span>
          <div className="ag-hv-type">
            <i style={{ width: "88%" }} />
            <i style={{ width: "64%" }} />
            <i style={{ width: "76%" }} />
          </div>
        </div>
        <div className="ag-hv-swatches">
          <b style={{ background: "#121816" }} />
          <b style={{ background: "#0b6e69" }} />
          <b style={{ background: "#8fd3c7" }} />
          <b style={{ background: "#f6f5f1" }} />
        </div>
        <div className="ag-hv-wire">
          <span className="ag-hv-wire-a" />
          <span className="ag-hv-wire-b" />
          <span className="ag-hv-wire-c" />
        </div>
      </div>

      <div className="ag-hv-card ag-hv-code">
        <div className="ag-hv-label"><span>02</span>Technology</div>
        <pre><code>
          <span className="k">const</span> site = <span className="f">design</span>(brand){"\n"}
          {"  "}.<span className="f">build</span>({"{"} stack: <span className="s">&quot;next&quot;</span> {"}"}){"\n"}
          {"  "}.<span className="f">optimise</span>(<span className="s">&quot;speed&quot;</span>){"\n"}
          {"  "}.<span className="f">launch</span>();{"\n"}
          {"\n"}
          <span className="f">grow</span>(site);
        </code></pre>
      </div>

      <div className="ag-hv-card ag-hv-growth">
        <div className="ag-hv-label"><span>03</span>Growth</div>
        <svg viewBox="0 0 220 110" className="ag-hv-chart">
          <defs>
            <linearGradient id="ag-hv-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#0b6e69" stopOpacity=".28" />
              <stop offset="1" stopColor="#0b6e69" stopOpacity="0" />
            </linearGradient>
          </defs>
          <g className="ag-hv-gridlines"><path d="M0 28H220M0 56H220M0 84H220" /></g>
          <path className="ag-hv-area" d="M0 96 C 30 92, 46 84, 70 80 S 112 70, 134 56 S 180 30, 220 12 V110 H0Z" fill="url(#ag-hv-fill)" />
          <path className="ag-hv-line" d="M0 96 C 30 92, 46 84, 70 80 S 112 70, 134 56 S 180 30, 220 12" />
          <circle cx="220" cy="12" r="4.5" />
        </svg>
        <div className="ag-hv-bars"><i /><i /><i /><i /><i /></div>
      </div>
    </div>
  );
}
