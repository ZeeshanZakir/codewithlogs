import type { ComponentProps } from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

import { AffiliateLinkBox } from "./AffiliateLinkBox";
import { CodeBlock } from "./CodeBlock";

type MDXRendererProps = {
  source: string;
};

const mdxComponents = {
  h2: (props: ComponentProps<"h2">) => (
    <h2
      {...props}
      className="mt-12 scroll-mt-24 text-3xl font-bold tracking-tight text-text"
    />
  ),
  h3: (props: ComponentProps<"h3">) => (
    <h3
      {...props}
      className="mt-8 scroll-mt-24 text-2xl font-semibold tracking-tight text-text"
    />
  ),
  p: (props: ComponentProps<"p">) => (
    <p {...props} className="mt-5 text-base leading-8 text-text/80" />
  ),
  ul: (props: ComponentProps<"ul">) => (
    <ul {...props} className="mt-5 list-disc space-y-3 pl-6 text-base leading-8 text-text/80" />
  ),
  ol: (props: ComponentProps<"ol">) => (
    <ol {...props} className="mt-5 list-decimal space-y-3 pl-6 text-base leading-8 text-text/80" />
  ),
  li: (props: ComponentProps<"li">) => <li {...props} className="pl-1" />,
  a: (props: ComponentProps<"a">) => (
    <a
      {...props}
      className="font-medium text-primary underline decoration-primary/35 underline-offset-4"
    />
  ),
  blockquote: (props: ComponentProps<"blockquote">) => (
    <blockquote
      {...props}
      className="mt-6 rounded-r-[12px] border-l-4 border-primary bg-primary/5 px-5 py-4 text-base italic leading-8 text-text/75"
    />
  ),
  pre: CodeBlock,
  AffiliateLink: AffiliateLinkBox,
};

export async function MDXRenderer({ source }: MDXRendererProps) {
  return (
    <div className="max-w-none">
      <MDXRemote
        source={source}
        components={mdxComponents}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [rehypeSlug],
          },
        }}
      />
    </div>
  );
}
