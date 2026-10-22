import type { ComponentProps } from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

import { AffiliateLinkBox } from "./AffiliateLinkBox";
import { CodeBlock } from "./CodeBlock";
import { getAllPosts } from "@/lib/mdx";

type MDXRendererProps = {
  source: string;
};

function renderComponentLiteral(name: string) {
  return function ComponentLiteral() {
    return (
      <code className="rounded bg-[#0f172a] px-1.5 py-0.5 text-sm text-emerald-200">
        {`<${name} />`}
      </code>
    );
  };
}

const mdxComponents = {
  // The article header owns the page H1. Keep body titles visible without
  // creating a second top-level heading or changing the stored article text.
  h1: (props: ComponentProps<"h1">) => (
    <h2
      {...props}
      className="mt-12 scroll-mt-24 text-3xl font-bold tracking-tight text-text"
    />
  ),
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
  SignIn: renderComponentLiteral("SignIn"),
  SignUp: renderComponentLiteral("SignUp"),
  UserButton: renderComponentLiteral("UserButton"),
};

export async function MDXRenderer({ source }: MDXRendererProps) {
  const publicSlugs = new Set((await getAllPosts()).map((post) => post.slug));
  function ArticleLink({ href, children, ...props }: ComponentProps<"a">) {
    const slug = href?.startsWith("/blog/") ? href.split(/[?#]/)[0].slice(6) : undefined;
    if (slug && !publicSlugs.has(slug)) {
      return <span className="unpublished-reference">{children}<small> (guide not currently published)</small></span>;
    }
    return <a {...props} href={href} className="font-medium text-primary underline decoration-primary/35 underline-offset-4">{children}</a>;
  }
  return (
    <div className="max-w-none">
      <MDXRemote
        source={source}
        components={{ ...mdxComponents, a: ArticleLink }}
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
