/**
 * Decorative, art-directed compositions for each service. Pure HTML/SVG/CSS
 * (no images, no client JS) that scale with their container via cqi units.
 * They contain no client names, figures or claims.
 */
export type ServiceVisualKind =
  | "website-design-development"
  | "ui-ux-design"
  | "web-application-development"
  | "mobile-app-development"
  | "ecommerce-development"
  | "seo-services"
  | "digital-marketing"
  | "branding-creative"
  | "ai-automation"
  | "support-maintenance";

function Bars({ widths, className = "" }: { widths: number[]; className?: string }) {
  return <div className={`sv-bars ${className}`}>{widths.map((width, index) => <i key={index} style={{ width: `${width}%` }} />)}</div>;
}

function Browser({ children, className = "", url = "yourbrand.com" }: { children: React.ReactNode; className?: string; url?: string }) {
  return (
    <div className={`sv-browser ${className}`}>
      <div className="sv-browser-bar"><span /><span /><span /><em>{url}</em></div>
      <div className="sv-browser-body">{children}</div>
    </div>
  );
}

function Website() {
  return (
    <div className="sv-scene sv-web">
      <Browser className="sv-web-back" url="yourbrand.com/services"><Bars widths={[60, 80, 45, 70, 55]} /></Browser>
      <Browser className="sv-web-front">
        <div className="sv-web-nav"><b /><span /><span /><span /><i /></div>
        <div className="sv-web-hero">
          <div><p className="sv-type-xl">Grow with<br /><em>intent.</em></p><Bars widths={[90, 70]} /><span className="sv-pill-btn" /></div>
          <div className="sv-web-art"><span /><span /></div>
        </div>
        <div className="sv-web-cards"><span /><span /><span /></div>
      </Browser>
      <div className="sv-chip sv-web-chip">Responsive</div>
    </div>
  );
}

function UiUx() {
  return (
    <div className="sv-scene sv-ui">
      <div className="sv-panel sv-ui-tokens">
        <p className="sv-label">Color tokens</p>
        <div className="sv-ui-swatches"><span style={{ background: "#101816" }} /><span style={{ background: "#073f3b" }} /><span style={{ background: "#087f75" }} /><span style={{ background: "#35d5bd" }} /><span style={{ background: "#e7ece7" }} /></div>
        <p className="sv-label">Type scale</p>
        <div className="sv-ui-type"><span>Aa</span><span>Aa</span><span>Aa</span><span>Aa</span></div>
      </div>
      <div className="sv-panel sv-ui-comp">
        <p className="sv-label">Components</p>
        <div className="sv-ui-row"><span className="sv-btn-solid">Primary</span><span className="sv-btn-ghost">Secondary</span></div>
        <div className="sv-ui-input"><span />Email address</div>
        <div className="sv-ui-row"><span className="sv-toggle" /><span className="sv-check" /><span className="sv-radio" /></div>
      </div>
      <svg className="sv-cursor" viewBox="0 0 24 24"><path d="M4 2l15 9-6.5 1.6L10 19z" /></svg>
      <div className="sv-chip sv-ui-chip">Design system</div>
    </div>
  );
}

function WebApp() {
  return (
    <div className="sv-scene sv-app">
      <div className="sv-app-shell">
        <aside><b /><span /><span className="on" /><span /><span /></aside>
        <div className="sv-app-main">
          <div className="sv-app-top"><Bars widths={[34]} /><i /></div>
          <div className="sv-app-kpis"><div><Bars widths={[50, 80]} /></div><div><Bars widths={[40, 70]} /></div><div className="hl"><Bars widths={[60, 85]} /></div></div>
          <svg className="sv-app-chart" viewBox="0 0 300 110" preserveAspectRatio="none">
            <path d="M0 92 C 40 86 60 70 95 72 S 150 50 185 54 S 245 22 300 14 V110 H0Z" fill="#35d5bd" fillOpacity=".16" />
            <path d="M0 92 C 40 86 60 70 95 72 S 150 50 185 54 S 245 22 300 14" fill="none" stroke="#35d5bd" strokeWidth="2.5" />
          </svg>
          <div className="sv-app-table"><Bars widths={[70, 40, 55]} /><Bars widths={[60, 50, 35]} /><Bars widths={[75, 30, 45]} /></div>
        </div>
      </div>
      <div className="sv-chip sv-app-chip">Admin dashboard</div>
    </div>
  );
}

function Mobile() {
  return (
    <div className="sv-scene sv-mobile">
      <div className="sv-phone sv-phone-a"><div className="sv-phone-screen"><span className="sv-phone-notch" /><div className="sv-mobile-orb" /><p className="sv-type-md">Welcome<br /><em>aboard.</em></p><Bars widths={[80, 60]} /><span className="sv-pill-btn wide" /></div></div>
      <div className="sv-phone sv-phone-b"><div className="sv-phone-screen light"><span className="sv-phone-notch" /><Bars widths={[45]} /><div className="sv-mobile-card" /><div className="sv-mobile-card" /><div className="sv-mobile-card short" /><div className="sv-tabbar"><i /><i className="on" /><i /><i /></div></div></div>
      <div className="sv-chip sv-mobile-chip">iOS · Android</div>
    </div>
  );
}

function Ecommerce() {
  return (
    <div className="sv-scene sv-shop">
      <div className="sv-panel sv-shop-product">
        <div className="sv-shop-img"><span /></div>
        <p className="sv-type-md">The Essential</p>
        <Bars widths={[70, 45]} />
        <div className="sv-ui-row"><span className="sv-size">S</span><span className="sv-size on">M</span><span className="sv-size">L</span></div>
        <span className="sv-btn-solid full">Add to cart</span>
      </div>
      <div className="sv-panel sv-shop-cart">
        <p className="sv-label">Your cart</p>
        <div className="sv-cart-line"><i /><Bars widths={[80, 50]} /></div>
        <div className="sv-cart-line"><i /><Bars widths={[70, 40]} /></div>
        <div className="sv-cart-total"><Bars widths={[40]} /><Bars widths={[25]} /></div>
        <span className="sv-btn-accent full">Checkout</span>
      </div>
      <div className="sv-chip sv-shop-chip">Secure payments</div>
    </div>
  );
}

function Seo() {
  return (
    <div className="sv-scene sv-seo">
      <div className="sv-panel sv-seo-serp">
        <div className="sv-seo-search"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6" /><path d="M20 20l-4.5-4.5" /></svg>web design agency</div>
        <div className="sv-seo-result top"><span className="sv-seo-rank" /><div><p className="sv-seo-url">yourbrand.com › services</p><p className="sv-seo-title">Your Brand — Website Design</p><Bars widths={[92, 70]} /></div></div>
        <div className="sv-seo-result"><div><Bars className="url" widths={[38]} /><Bars className="title" widths={[66]} /><Bars widths={[88, 60]} /></div></div>
        <div className="sv-seo-result"><div><Bars className="url" widths={[30]} /><Bars className="title" widths={[58]} /><Bars widths={[80]} /></div></div>
      </div>
      <div className="sv-panel sv-seo-graph">
        <p className="sv-label">Organic visibility</p>
        <svg viewBox="0 0 200 90"><path d="M0 80 L30 74 L60 76 L90 60 L120 52 L150 34 L200 12" fill="none" stroke="#087f75" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /><circle cx="200" cy="12" r="5" fill="#35d5bd" /></svg>
      </div>
    </div>
  );
}

function Marketing() {
  return (
    <div className="sv-scene sv-mkt">
      <div className="sv-mkt-ad sv-mkt-ad-a"><p className="sv-type-lg">Grow<br /><em>faster.</em></p><span className="sv-pill-btn" /></div>
      <div className="sv-mkt-ad sv-mkt-ad-b"><span className="sv-mkt-ring" /><p className="sv-type-md">New<br />season</p></div>
      <div className="sv-panel sv-mkt-funnel">
        <p className="sv-label">Campaign funnel</p>
        {["Reach", "Clicks", "Leads", "Sales"].map((step, index) => <div key={step} className="sv-funnel-row"><span>{step}</span><i style={{ width: `${92 - index * 20}%` }} /></div>)}
      </div>
      <div className="sv-chip sv-mkt-chip">Google · Meta</div>
    </div>
  );
}

function Branding() {
  return (
    <div className="sv-scene sv-brand">
      <div className="sv-brand-board">
        <div className="sv-brand-logo"><span className="sv-brand-mark">b.</span><p>brand<em>.</em></p></div>
        <div className="sv-brand-palette"><span style={{ background: "#101816" }} /><span style={{ background: "#087f75" }} /><span style={{ background: "#35d5bd" }} /><span style={{ background: "#efe9dc" }} /></div>
        <div className="sv-brand-type"><span>Aa</span><div><Bars widths={[90, 70, 80]} /></div></div>
      </div>
      <div className="sv-brand-card"><span className="sv-brand-mark small">b.</span><Bars widths={[60, 40]} /></div>
      <div className="sv-chip sv-brand-chip">Identity system</div>
    </div>
  );
}

function Ai() {
  return (
    <div className="sv-scene sv-ai">
      <svg className="sv-ai-net" viewBox="0 0 400 260">
        <g className="sv-ai-links">
          <path d="M70 70 C 140 70 150 130 200 130" /><path d="M70 190 C 140 190 150 130 200 130" />
          <path d="M200 130 C 260 130 260 60 330 60" /><path d="M200 130 L330 130" /><path d="M200 130 C 260 130 260 200 330 200" />
        </g>
        <g className="sv-ai-flow">
          <path d="M70 70 C 140 70 150 130 200 130" /><path d="M200 130 C 260 130 260 60 330 60" /><path d="M200 130 C 260 130 260 200 330 200" />
        </g>
        <circle className="sv-ai-halo" cx="200" cy="130" r="54" />
        <polygon className="sv-ai-core" points="200,92 233,111 233,149 200,168 167,149 167,111" />
        <circle className="sv-ai-node" cx="70" cy="70" r="10" /><circle className="sv-ai-node" cx="70" cy="190" r="10" />
        <circle className="sv-ai-node out" cx="330" cy="60" r="10" /><circle className="sv-ai-node out" cx="330" cy="130" r="10" /><circle className="sv-ai-node out" cx="330" cy="200" r="10" />
        <text x="70" y="44">Form</text><text x="70" y="226">Inbox</text><text x="200" y="196">AI step</text><text x="330" y="34">CRM</text><text x="330" y="104">Reply</text><text x="330" y="234">Sheet</text>
      </svg>
      <div className="sv-chip sv-ai-chip">Workflow automation</div>
    </div>
  );
}

function Support() {
  const checks = ["SSL certificate", "Scheduled backups", "Dependency updates", "Uptime monitoring", "Security patches"];
  return (
    <div className="sv-scene sv-care">
      <div className="sv-panel sv-care-list">
        <p className="sv-label">Maintenance checklist</p>
        {checks.map((check, index) => (
          <div key={check} className="sv-care-row">
            <span className="sv-care-dot"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg></span>
            <p>{check}</p>
            <div className="sv-spark">{Array.from({ length: 10 }, (_, bar) => <i key={bar} style={{ height: `${40 + ((bar * 37 + index * 13) % 55)}%` }} />)}</div>
          </div>
        ))}
      </div>
      <div className="sv-chip sv-care-chip">Monitored</div>
    </div>
  );
}

const visuals: Record<ServiceVisualKind, () => React.ReactElement> = {
  "website-design-development": Website,
  "ui-ux-design": UiUx,
  "web-application-development": WebApp,
  "mobile-app-development": Mobile,
  "ecommerce-development": Ecommerce,
  "seo-services": Seo,
  "digital-marketing": Marketing,
  "branding-creative": Branding,
  "ai-automation": Ai,
  "support-maintenance": Support,
};

export function ServiceVisual({ kind, tone = "dark", className = "" }: { kind: ServiceVisualKind; tone?: "dark" | "light"; className?: string }) {
  const Visual = visuals[kind];
  return <div className={`sv sv-${tone} ${className}`} aria-hidden="true"><Visual /></div>;
}
