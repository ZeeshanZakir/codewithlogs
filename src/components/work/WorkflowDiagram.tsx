"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { Check, ChevronLeft, ChevronRight, Clapperboard, CloudUpload, ImageUp, Pause, PenLine, Play, RotateCcw, Search, Sparkles, type LucideIcon } from "lucide-react";
import { reportedRunTime, stageStatus, workflowStages, type SimulationState, type StageStatus, type WorkflowStageId } from "@/lib/ai-publishing";

const stageIcons: Record<WorkflowStageId, LucideIcon> = {
  input: ImageUp, analysis: Sparkles, research: Search, content: PenLine, video: Clapperboard, publish: CloudUpload,
};

/** Base timings in ms at 1× speed. Purely visual; not the real run time. */
const TRAVEL_MS = 750;
const WORK_MS = 1900;
const speeds = [0.5, 1, 2] as const;
type Speed = typeof speeds[number];

const statusLabel: Record<StageStatus, string> = { pending: "Waiting", active: "Running", complete: "Done" };

/** Small, stage-specific activity visual inside each node. Decorative. */
function StageActivity({ id }: { id: WorkflowStageId }) {
  switch (id) {
    case "input":
      return <div className="wf-act wf-act-input"><span className="wf-thumb" /><span className="wf-scan" /></div>;
    case "analysis":
      return <div className="wf-act wf-act-tags"><span>Brand</span><span>Model</span><span>Category</span></div>;
    case "research":
      return <div className="wf-act wf-act-search"><span className="wf-query">product specs<i /></span><span className="wf-line" /><span className="wf-line short" /></div>;
    case "content":
      return <div className="wf-act wf-act-content"><span className="wf-line" /><span className="wf-line short" /><span className="wf-chips"><b /><b /><b /></span></div>;
    case "video":
      return <div className="wf-act wf-act-video"><span className="wf-track"><span className="wf-seg" /><span className="wf-head" /></span><small>1–2 min segment</small></div>;
    case "publish":
      return <div className="wf-act wf-act-publish"><span className="wf-bar"><span /></span><small className="wf-live">Live</small></div>;
  }
}

type Connector = { d: string };

export function WorkflowDiagram() {
  const last = workflowStages.length - 1;
  const [current, setCurrent] = useState(-1);
  const [phase, setPhase] = useState<"travel" | "work">("work");
  const [state, setState] = useState<SimulationState>("idle");
  const [speed, setSpeed] = useState<Speed>(1);
  const [reduced, setReduced] = useState(false);
  const [connectors, setConnectors] = useState<Connector[]>([]);
  const [box, setBox] = useState({ width: 0, height: 0 });
  const stageRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const finished = state === "finished";
  const playing = state === "running";

  // Respect reduced motion: no autoplay and no travelling packet.
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  // Measure node positions and build connector paths in stage coordinates.
  const measure = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const origin = stage.getBoundingClientRect();
    const rects = nodeRefs.current.map((node) => node?.getBoundingClientRect());
    const paths: Connector[] = [];
    for (let i = 0; i < rects.length - 1; i += 1) {
      const a = rects[i];
      const b = rects[i + 1];
      if (!a || !b) continue;
      const ay = a.top + a.height / 2 - origin.top;
      const by = b.top + b.height / 2 - origin.top;
      if (Math.abs(ay - by) < 12 && b.left > a.right) {
        const x1 = a.right - origin.left;
        const x2 = b.left - origin.left;
        paths.push({ d: `M ${x1} ${ay} L ${x2} ${by}` });
      } else {
        const x1 = a.left + a.width / 2 - origin.left;
        const y1 = a.bottom - origin.top;
        const x2 = b.left + b.width / 2 - origin.left;
        const y2 = b.top - origin.top;
        const mid = (y2 - y1) / 2;
        paths.push({ d: Math.abs(x1 - x2) < 2 ? `M ${x1} ${y1} L ${x2} ${y2}` : `M ${x1} ${y1} C ${x1} ${y1 + mid}, ${x2} ${y2 - mid}, ${x2} ${y2}` });
      }
    }
    setConnectors(paths);
    setBox({ width: origin.width, height: origin.height });
  }, []);

  useLayoutEffect(() => {
    measure();
    const stage = stageRef.current;
    if (!stage || !("ResizeObserver" in window)) return;
    const observer = new ResizeObserver(() => measure());
    observer.observe(stage);
    return () => observer.disconnect();
  }, [measure]);

  // Start automatically the first time the diagram's top reaches the middle
  // of the viewport. A passive scroll check works at every screen height.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || reduced) return;
    let started = false;
    const check = () => {
      if (started) return;
      const rect = stage.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.6 && rect.bottom > 0) {
        started = true;
        window.removeEventListener("scroll", check);
        window.removeEventListener("resize", check);
        setCurrent((value) => (value === -1 ? 0 : value));
        setPhase("work");
        setState((value) => (value === "idle" ? "running" : value));
      }
    };
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    const initial = window.setTimeout(check, 0);
    return () => {
      window.clearTimeout(initial);
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [reduced]);

  // The simulation clock. Every timer is cleared when state changes.
  useEffect(() => {
    if (!playing || current < 0) return;
    const travel = reduced ? 0 : TRAVEL_MS / speed;
    const timer = window.setTimeout(() => {
      if (phase === "travel") {
        setPhase("work");
      } else if (current >= last) {
        setState("finished");
      } else {
        setCurrent(current + 1);
        setPhase(travel ? "travel" : "work");
      }
    }, phase === "travel" ? travel : WORK_MS / speed);
    return () => window.clearTimeout(timer);
  }, [playing, current, phase, speed, last, reduced]);

  function goTo(index: number) {
    setCurrent(Math.max(0, Math.min(last, index)));
    setPhase("work");
    setState("paused");
  }
  function togglePlay() {
    if (finished) return restart();
    if (current === -1) setCurrent(0);
    setPhase("work");
    setState(playing ? "paused" : "running");
  }
  function restart() {
    setCurrent(0);
    setPhase("work");
    setState("running");
  }
  function stepForward() {
    if (finished) return;
    if (current >= last) { setState("finished"); return; }
    goTo(current + 1);
  }
  function stepBack() {
    if (finished) { goTo(last); return; }
    goTo(current - 1);
  }

  const shown = workflowStages[Math.max(0, finished ? last : current)];
  const ShownIcon = stageIcons[shown.id];
  const statusText = finished
    ? "Simulation complete. The product listing is published."
    : current < 0
      ? "Simulation ready. Press play to start."
      : `Stage ${current + 1} of ${workflowStages.length}: ${workflowStages[current].title}, ${phase === "travel" ? "receiving data" : playing ? "running" : "paused"}.`;

  return (
    <div className={`wf${reduced ? " wf-reduced" : ""}`} data-state={state} style={{ "--wf-speed": speed } as CSSProperties}>
      <div className="wf-toolbar">
        <div className="wf-controls" role="group" aria-label="Simulation controls">
          <button type="button" className="wf-ctrl wf-ctrl-main" onClick={togglePlay} aria-label={playing ? "Pause simulation" : finished ? "Replay simulation" : "Play simulation"}>
            {playing ? <Pause size={18} aria-hidden="true" /> : <Play size={18} aria-hidden="true" />}
            <span>{playing ? "Pause" : finished ? "Replay" : "Play"}</span>
          </button>
          <button type="button" className="wf-ctrl" onClick={stepBack} disabled={current <= 0 && !finished} aria-label="Previous stage"><ChevronLeft size={18} aria-hidden="true" /></button>
          <button type="button" className="wf-ctrl" onClick={stepForward} disabled={finished} aria-label="Next stage"><ChevronRight size={18} aria-hidden="true" /></button>
          <button type="button" className="wf-ctrl" onClick={restart} aria-label="Restart simulation"><RotateCcw size={17} aria-hidden="true" /></button>
        </div>
        <div className="wf-speed" role="group" aria-label="Simulation speed">
          {speeds.map((value) => (
            <button key={value} type="button" aria-pressed={speed === value} onClick={() => setSpeed(value)}>{value}×</button>
          ))}
        </div>
        <p className="wf-note">Visual simulation · reported real run {reportedRunTime}</p>
      </div>

      <div className="wf-stage" ref={stageRef}>
        <svg className="wf-links" width={box.width} height={box.height} viewBox={`0 0 ${box.width || 1} ${box.height || 1}`} aria-hidden="true">
          {connectors.map((connector, index) => {
            const done = finished || index < current - 1 || (index === current - 1 && phase === "work");
            const travelling = !finished && index === current - 1 && phase === "travel";
            return (
              <g key={index}>
                <path className="wf-link-base" d={connector.d} />
                <path className={`wf-link-fill${done ? " is-done" : ""}${travelling ? " is-travel" : ""}`} d={connector.d} pathLength={1} key={travelling ? `t${current}` : `s${index}`} />
              </g>
            );
          })}
        </svg>
        {!reduced && phase === "travel" && current > 0 && connectors[current - 1] ? (
          <span key={`packet-${current}`} className="wf-packet" style={{ offsetPath: `path("${connectors[current - 1].d}")`, animationDuration: `${TRAVEL_MS / speed}ms` }} aria-hidden="true" />
        ) : null}

        <ol className="wf-nodes">
          {workflowStages.map((stage, index) => {
            const status: StageStatus = current < 0 ? "pending" : phase === "travel" && index === current ? "pending" : stageStatus(index, current, finished);
            const Icon = stageIcons[stage.id];
            return (
              <li key={stage.id}>
                <button
                  ref={(element) => { nodeRefs.current[index] = element; }}
                  type="button"
                  className="wf-node"
                  data-status={status}
                  data-stage={stage.id}
                  aria-current={!finished && index === current ? "step" : undefined}
                  aria-label={`Stage ${stage.step}: ${stage.title}. ${stage.summary} Status: ${statusLabel[status]}. Show details.`}
                  onClick={() => goTo(index)}
                >
                  <span className="wf-node-top">
                    <span className="wf-node-icon" aria-hidden="true"><Icon size={20} strokeWidth={1.7} /></span>
                    <span className="wf-status" aria-hidden="true">
                      {status === "complete" ? <Check size={13} strokeWidth={3} /> : <span className="wf-dot" />}
                      {statusLabel[status]}
                    </span>
                  </span>
                  <span className="wf-step" aria-hidden="true">Step {String(stage.step).padStart(2, "0")} · {stage.service}</span>
                  <span className="wf-title" aria-hidden="true">{stage.title}</span>
                  <span className="wf-summary" aria-hidden="true">{stage.summary}</span>
                  <StageActivity id={stage.id} />
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      <p className="sr-only" role="status" aria-live="polite">{statusText}</p>

      <div className="wf-panel">
        {finished ? (
          <div className="wf-success" key="success">
            <span className="wf-success-icon" aria-hidden="true"><Check size={30} strokeWidth={2.6} /></span>
            <div>
              <p className="wf-panel-kicker">Simulation complete</p>
              <h3>Product listing published.</h3>
              <p>Image, copy, specifications, SEO fields and video were assembled and submitted in one pass. In the real system this run is reported at {reportedRunTime}.</p>
            </div>
            <button type="button" className="ag-btn ag-btn-primary" onClick={restart}><RotateCcw size={16} aria-hidden="true" /> Run it again</button>
          </div>
        ) : (
          <div className="wf-detail" key={shown.id}>
            <span className="wf-detail-icon" aria-hidden="true"><ShownIcon size={26} strokeWidth={1.6} /></span>
            <div className="wf-detail-main">
              <p className="wf-panel-kicker">Step {String(shown.step).padStart(2, "0")} of {String(workflowStages.length).padStart(2, "0")} · {shown.service}</p>
              <h3>{shown.title}</h3>
              <ul>{shown.details.map((detail) => <li key={detail}>{detail}</li>)}</ul>
            </div>
            <div className="wf-detail-out">
              <p className="wf-panel-kicker">Hands off</p>
              <p className="wf-out">{shown.output}</p>
              <div className="wf-progress" aria-hidden="true">
                {workflowStages.map((stage, index) => <i key={stage.id} data-status={current < 0 ? "pending" : stageStatus(index, current, finished)} />)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
