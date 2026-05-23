import { Children, isValidElement, type ReactNode } from "react";
import { codeToHtml } from "shiki";

type CodeBlockProps = {
  children?: ReactNode;
};

function getTextContent(node: ReactNode): string {
  if (typeof node === "string") {
    return node;
  }

  if (typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(getTextContent).join("");
  }

  if (isValidElement<{ children?: ReactNode }>(node)) {
    return getTextContent(node.props.children);
  }

  return "";
}

export async function CodeBlock({ children }: CodeBlockProps) {
  const child = Children.toArray(children)[0];

  if (!isValidElement<{ className?: string; children?: ReactNode }>(child)) {
    return <pre>{children}</pre>;
  }

  const className = child.props.className ?? "";
  const language = className.replace("language-", "") || "tsx";
  const code = getTextContent(child.props.children).trimEnd();

  const html = await codeToHtml(code, {
    lang: language,
    theme: "github-light",
  });

  return (
    <div
      className="[&_code]:font-mono [&_code]:text-[13px] [&_pre]:overflow-x-auto [&_pre]:rounded-[12px] [&_pre]:border [&_pre]:border-black/6 [&_pre]:bg-[#f6f8fa] [&_pre]:p-5 [&_pre]:shadow-sm"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
