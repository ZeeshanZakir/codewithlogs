import { Children, isValidElement, type ReactNode } from "react";
import { bundledLanguages, codeToHtml } from "shiki";
import { CopyCodeButton } from "./CopyCodeButton";

function getTextContent(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getTextContent).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) return getTextContent(node.props.children);
  return "";
}
export async function CodeBlock({ children }: { children?: ReactNode }) {
  const child = Children.toArray(children)[0];
  if (!isValidElement<{ className?: string; children?: ReactNode }>(child)) return <pre>{children}</pre>;
  const requested = child.props.className?.replace("language-", "") || "text";
  const language = Object.prototype.hasOwnProperty.call(bundledLanguages, requested) ? requested : "text";
  const code = getTextContent(child.props.children).trimEnd();
  const html = await codeToHtml(code, { lang: language, theme: "github-light" });
  return (
    <div className="code-example">
      <div className="code-example-bar"><span>{requested}</span><CopyCodeButton code={code} /></div>
      <div className="code-highlight" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
