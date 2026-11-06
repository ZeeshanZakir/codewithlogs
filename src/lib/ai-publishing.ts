/**
 * Data for the "AI-Powered Product Publishing Automation" case study.
 * The interactive diagram on the project page is driven entirely by
 * `workflowStages`; it visualises the pipeline and does not call any API.
 */

export type WorkflowStageId = "input" | "analysis" | "research" | "content" | "video" | "publish";

export type WorkflowStage = {
  id: WorkflowStageId;
  step: number;
  title: string;
  service: string;
  summary: string;
  details: string[];
  /** What the stage hands to the next one. */
  output: string;
};

/** Visual state of one node at a point in the simulation. */
export type StageStatus = "pending" | "active" | "complete";

/** Overall state of the simulation. */
export type SimulationState = "idle" | "running" | "paused" | "finished";

export const workflowStages: WorkflowStage[] = [
  {
    id: "input",
    step: 1,
    title: "Product image",
    service: "Input",
    summary: "A single product photo starts the run.",
    details: [
      "The user uploads one product image.",
      "The image is validated and passed straight into the pipeline.",
      "No manual fields are needed to begin.",
    ],
    output: "Product image",
  },
  {
    id: "analysis",
    step: 2,
    title: "Gemini analysis",
    service: "Gemini AI",
    summary: "Identifies brand, model, category and features.",
    details: [
      "Gemini examines the image to recognise the product.",
      "It extracts the brand, model, category and distinguishing features it can identify.",
      "The result is structured data the research stage can query with.",
    ],
    output: "Structured product data",
  },
  {
    id: "research",
    step: 3,
    title: "Google research",
    service: "Google Search",
    summary: "Finds matching sources, specs and search intent.",
    details: [
      "Searches Google with the identified product details.",
      "Matches reliable product sources and gathers specifications.",
      "Looks at search intent to choose the SEO keywords to target.",
    ],
    output: "Verified specs and keywords",
  },
  {
    id: "content",
    step: 4,
    title: "SEO content & images",
    service: "Gemini AI",
    summary: "Writes the listing and prepares product images.",
    details: [
      "Writes an original title, description and key-feature list.",
      "Creates the meta title, meta description and keyword targeting.",
      "Collects candidate product images and prepares them for the listing.",
    ],
    output: "Listing copy, SEO fields and images",
  },
  {
    id: "video",
    step: 5,
    title: "YouTube discovery",
    service: "YouTube",
    summary: "Picks a relevant video and a 1–2 minute segment.",
    details: [
      "Searches YouTube for a video that matches the product or category.",
      "Chooses the most relevant available video.",
      "Sets a 1–2 minute segment that is embedded with YouTube's own player, within the platform's terms.",
    ],
    output: "Embedded video segment",
  },
  {
    id: "publish",
    step: 6,
    title: "Website publishing",
    service: "Website integration",
    summary: "Assembles everything and publishes the listing.",
    details: [
      "Combines title, description, specifications, images, SEO fields and video.",
      "Submits the finished product to the website through its integration.",
      "Confirms the listing is live.",
    ],
    output: "Published product listing",
  },
];

/** Reported benchmark supplied by the project owner, not a guarantee. */
export const reportedRunTime = "6.7–8.5 s";

export function stageStatus(index: number, current: number, finished: boolean): StageStatus {
  if (finished || index < current) return "complete";
  if (index === current) return "active";
  return "pending";
}
