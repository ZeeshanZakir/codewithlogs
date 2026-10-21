import path from "node:path";
import { fileURLToPath } from "node:url";

const fixtureRoot = path.dirname(fileURLToPath(import.meta.url));
const config = { turbopack: { root: fixtureRoot }, poweredByHeader: false };
export default config;
