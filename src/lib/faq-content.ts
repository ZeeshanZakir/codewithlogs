// Evidence and editorial rationale: reports/faq/faq-research.json.
// Reviewed 2026-10-25. Plain FAQ content only; no FAQPage structured data.
export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  links: readonly { label: string; href: string }[];
};

export const pageFaqs = {
  "/": [
    {
      "id": "home-1",
      "question": "How can I find a guide for the error I am seeing?",
      "answer": "Search the archive using the error code or a few distinctive words, then narrow by topic. The search matches words in articles; it does not diagnose your project. If a full log finds nothing, remove paths, timestamps and version numbers and search again.",
      "links": [
        {
          "label": "Search troubleshooting guides",
          "href": "/blog"
        }
      ]
    },
    {
      "id": "home-2",
      "question": "Does an article marked Unverified mean its fix has been tested?",
      "answer": "No. It means no reproducible test record has been approved for that published version. Check the article's software versions and official references, then verify the proposed change in your own test environment. Tests of a separate draft do not verify the published article.",
      "links": [
        {
          "label": "How verification works",
          "href": "/editorial-policy"
        }
      ]
    },
    {
      "id": "home-3",
      "question": "Can CodeWithLogs check my Supabase row policies or database permissions?",
      "answer": "The site provides Supabase troubleshooting guides, but its browser tools do not connect to your database or test row policies. Use the relevant guide to plan checks in your own test project; never paste a service-role key into a tool.",
      "links": [
        {
          "label": "Supabase troubleshooting",
          "href": "/blog?topic=supabase"
        }
      ]
    },
    {
      "id": "home-4",
      "question": "What information should I include when reporting an incorrect guide or tool result?",
      "answer": "Use the contact page with the affected URL, software versions, what you expected and a minimal example that reproduces the issue. Remove credentials, customer data and identifying paths. For a tool problem, include the input and result only if they are safe to share.",
      "links": [
        {
          "label": "Contact and corrections",
          "href": "/contact"
        }
      ]
    }
  ],
  "/tools": [
    {
      "id": "tools-1",
      "question": "Are pasted inputs sent to a server for processing?",
      "answer": "The current tools process text and selected files in your browser. Their analysis code does not upload those inputs to an API or AI service. This describes the tool code, not every script on the page; avoid entering credentials or confidential production data.",
      "links": [
        {
          "label": "Privacy policy",
          "href": "/privacy-policy"
        }
      ]
    },
    {
      "id": "tools-2",
      "question": "Why does the page make network requests while a tool runs locally?",
      "answer": "The page still loads site assets and measurement scripts. Google and Vercel analytics are included, and advertising can load when configured. Those requests are separate from the tool's local analysis, so browser processing does not mean the whole page works offline or makes no network requests.",
      "links": [
        {
          "label": "Data handling details",
          "href": "/privacy-policy"
        }
      ]
    },
    {
      "id": "tools-3",
      "question": "Can I recover my input after closing or refreshing a tool?",
      "answer": "The tools keep working input in page state and do not provide saved projects or account sync. Copy or download results you need before leaving. Browser navigation can sometimes restore a page, but that is not a recovery feature.",
      "links": []
    },
    {
      "id": "tools-4",
      "question": "Will any tool install packages, run npm scripts or execute a cron job?",
      "answer": "No. The package inspector reads command text, the error decoder suggests checks, and the cron builder previews a schedule. You must review and perform any action in your own environment. The regex tester does evaluate regular expressions against your sample text in the browser.",
      "links": []
    },
    {
      "id": "tools-5",
      "question": "Does a successful result mean my input is ready for production?",
      "answer": "A result covers only that tool's checks. JSON parsing does not establish an API contract, decoding a JWT does not authenticate it, and a dependency summary does not prove package compatibility. Read the tool's limits and test the result in the application that will use it.",
      "links": [
        {
          "label": "JSON validation limits",
          "href": "/tools/json-formatter"
        },
        {
          "label": "Package inspection limits",
          "href": "/tools/package-json-inspector"
        }
      ]
    },
    {
      "id": "tools-6",
      "question": "Can I process a full production log or a very large file?",
      "answer": "Start with a small, redacted sample. The error decoder caps input at 20,000 characters and the package inspector at 100,000. The regex tester limits text to 20,000 characters, patterns to 500, and terminates its worker after one second of evaluation (startup has a separate five-second limit). Other tools have no verified large-file performance guarantee.",
      "links": []
    }
  ],
  "/tools/error-decoder": [
    {
      "id": "error-decoder-1",
      "question": "Can the decoder identify the exact cause of a Vercel deployment failure?",
      "answer": "No. It matches fixed error signatures and offers diagnostic checks; it cannot read your deployment or settings. For a failed build, inspect the first actionable error above the final exit message. A runtime failure needs its invocation logs instead.",
      "links": [
        {
          "label": "Vercel troubleshooting guide",
          "href": "/blog/common-vercel-deployment-errors-solutions"
        }
      ]
    },
    {
      "id": "error-decoder-2",
      "question": "Why does the decoder say an error is unsupported?",
      "answer": "Only a limited set of signatures is recognized. An unfamiliar code or a generic “build exited with 1” line can be unsupported even when the failure is real. Include nearby redacted context, or search the archive and the platform's official documentation for the exact code.",
      "links": [
        {
          "label": "Search the archive",
          "href": "/blog"
        }
      ]
    },
    {
      "id": "error-decoder-3",
      "question": "Why can one pasted log return several checklists?",
      "answer": "The decoder checks each signature independently. A log can contain both an npm conflict and a Vercel build summary, so several results may appear. They are possible symptoms, not ranked causes. Follow the earliest relevant failure before acting on a later summary.",
      "links": []
    }
  ],
  "/tools/package-json-inspector": [
    {
      "id": "package-json-inspector-1",
      "question": "Can this inspector detect npm peer dependency conflicts?",
      "answer": "It displays declared peer dependencies and version patterns, but does not fetch package metadata or resolve a dependency tree. For ERESOLVE, compare the conflicting versions and peer ranges in npm's log with the manifest and lockfile, then test a focused change.",
      "links": [
        {
          "label": "ERESOLVE troubleshooting",
          "href": "/blog/how-to-fix-npm-eresolve-dependency-errors"
        }
      ]
    },
    {
      "id": "package-json-inspector-2",
      "question": "Does a clean script report mean a package is safe to install?",
      "answer": "No. Scripts are displayed as text and only a few command patterns and lifecycle hooks are flagged. The inspector does not execute scripts, scan vulnerabilities or inspect downloaded code. Review the package source and install hooks before installing an unfamiliar project.",
      "links": []
    },
    {
      "id": "package-json-inspector-3",
      "question": "Why do the inspector's dependency counts differ from npm's installed tree?",
      "answer": "The counts describe entries in the pasted dependency fields, including separate declarations of the same package. The inspector does not read node_modules or package-lock.json. It inspects at most 200 entries per dependency field; a warning identifies omitted entries.",
      "links": []
    }
  ],
  "/tools/json-formatter": [
    {
      "id": "json-formatter-1",
      "question": "Why does JSON pass this validator but fail my API's schema validation?",
      "answer": "This tool checks strict JSON syntax and rejects duplicate object keys. It does not validate a schema, which can additionally require fields, restrict types or reject extra properties. Compare the API's schema error with the payload; a quoted number is valid JSON but may fail a numeric field rule.",
      "links": []
    },
    {
      "id": "json-formatter-2",
      "question": "Why did formatting change a large numeric ID?",
      "answer": "The earlier implementation converted numbers to JavaScript Number values, which could round large integers. The current formatter edits whitespace while preserving number tokens, including 9007199254740993, decimals and exponent notation. A receiving application can still lose precision when parsing them; follow its data contract.",
      "links": []
    },
    {
      "id": "json-formatter-3",
      "question": "Will this formatter warn me about duplicate object keys?",
      "answer": "Yes. Duplicate keys in the same object are reported, including equivalent names written with Unicode escapes. Formatting and minification stop until the duplicate is resolved, so an earlier value is not silently discarded. The same key in separate nested objects is allowed.",
      "links": []
    },
    {
      "id": "json-formatter-4",
      "question": "Can I paste JSON with comments or trailing commas?",
      "answer": "No. The formatter uses strict JSON parsing, so comments, trailing commas and single-quoted property names are rejected. If the source is JSONC or a JavaScript object literal, use a parser for that format rather than assuming it is ordinary JSON.",
      "links": []
    }
  ],
  "/tools/css-minifier": [
    {
      "id": "css-minifier-1",
      "question": "Can this minifier change how my CSS behaves?",
      "answer": "The current parser-based implementation removes only structural whitespace and preserves strings, calc() spacing, comments, custom-property values and declaration order. It does not optimize or rewrite values. This fixes the earlier whitespace corruption, but it is not a browser compatibility test; compare the output and test it in your project.",
      "links": [
        {
          "label": "CSS calc() syntax",
          "href": "https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/calc"
        }
      ]
    },
    {
      "id": "css-minifier-2",
      "question": "Does a valid CSS result mean every declaration is supported?",
      "answer": "No. The parser detects structural syntax errors such as missing braces or colons; it does not certify property names, values or browser support. Unknown declarations can remain in the output. Inspect the stylesheet in your target browser's developer tools to see which declarations are ignored.",
      "links": []
    },
    {
      "id": "css-minifier-3",
      "question": "Does the savings percentage measure Gzip or Brotli transfer size?",
      "answer": "No. It compares the UTF-8 byte length of the input and output text. It does not compress an HTTP response or measure a network transfer. Check the actual stylesheet request in browser developer tools to measure delivered size.",
      "links": []
    }
  ],
  "/tools/cron-builder": [
    {
      "id": "cron-builder-1",
      "question": "Can I paste an expression with seconds or a year field?",
      "answer": "This builder expects five fields: minute, hour, day of month, month and day of week. It does not support six- or seven-field dialects. Confirm the destination scheduler's syntax before copying an expression; a valid preview here does not establish compatibility.",
      "links": []
    },
    {
      "id": "cron-builder-2",
      "question": "Why do the preview times differ from my server's schedule?",
      "answer": "Previews use UTC, a fixed page-load time and a 365-day search window. UTC has no daylight-saving transitions. Your server may use a different timezone, dialect or DST policy. Reload for a fresh preview and compare with the scheduler's configured timezone; this page does not create or execute jobs.",
      "links": []
    },
    {
      "id": "cron-builder-3",
      "question": "What happens if I restrict both day of month and day of week?",
      "answer": "The preview follows Cronie-style day matching: when both fields are restricted, either can match. For example, 0 0 1 * 1 runs on the first of each month and every Monday. If either day field starts with *, both day conditions must match. Check your target scheduler because other dialects can differ.",
      "links": []
    },
    {
      "id": "cron-builder-4",
      "question": "Can the cron validator accept a malformed expression?",
      "answer": "The current validator requires complete numeric tokens, rejects trailing text and malformed lists, and checks ranges and positive steps. It supports five numeric fields, standalone wildcards, lists, ascending ranges and steps on wildcards or ranges. Names, seconds and extensions are rejected. A valid expression can still have no dates within the preview window.",
      "links": []
    }
  ],
  "/tools/regex-tester": [
    {
      "id": "regex-tester-1",
      "question": "Should I paste /pattern/g or just the pattern?",
      "answer": "Enter only the pattern body, such as \\d+, and select flags using the controls. The tool passes the field directly to JavaScript's RegExp constructor; surrounding slash delimiters become part of the pattern instead of being parsed as literal syntax.",
      "links": []
    },
    {
      "id": "regex-tester-2",
      "question": "Why is only the first match shown?",
      "answer": "Enable g to list repeated matches. Without g, the worker calls RegExp.exec once and shows only the first result. Output is capped at 1,000 matches and 100,000 captured characters, with a truncation notice. Expensive evaluations are stopped after one second rather than completing an unlimited scan.",
      "links": []
    },
    {
      "id": "regex-tester-3",
      "question": "Why does enabling multiline still not match across a newline?",
      "answer": "The m flag changes how ^ and $ treat line boundaries. It does not make the dot match newlines; enable s for that. Test with a small input containing a newline to check the behavior you need.",
      "links": []
    },
    {
      "id": "regex-tester-4",
      "question": "Does a successful test prove the pattern works in another regex engine?",
      "answer": "No. Matches come from your browser's JavaScript RegExp engine, with g, i, m and s controls. Other engines and runtime versions can differ. The explanation is a separate rule-based summary, so confirm complex patterns in the runtime that will use them.",
      "links": []
    }
  ],
  "/tools/token-counter": [
    {
      "id": "token-counter-1",
      "question": "Is the GPT count the same as my complete API request's token count?",
      "answer": "The GPT-4o mode uses the local o200k_base tokenizer for pasted text. It does not count the complete API request, such as message framing, tools or images. Compare against the provider's usage for the exact request and model; a local text count is not a billing total.",
      "links": [
        {
          "label": "OpenAI token counting",
          "href": "https://developers.openai.com/api/docs/guides/token-counting"
        }
      ]
    },
    {
      "id": "token-counter-2",
      "question": "Why do Claude and Gemini show the same count?",
      "answer": "Both modes currently use the same estimate: JavaScript text length divided by four, rounded up. They do not call either provider's tokenizer. Treat the result as a rough approximation, especially for code or non-English text, and use the provider's counting API when accuracy matters.",
      "links": [
        {
          "label": "Claude token counting",
          "href": "https://platform.claude.com/docs/en/build-with-claude/token-counting"
        },
        {
          "label": "Gemini token counting",
          "href": "https://ai.google.dev/gemini-api/docs/tokens"
        }
      ]
    },
    {
      "id": "token-counter-3",
      "question": "Does the displayed cost predict my actual API bill?",
      "answer": "No. It multiplies the local count or heuristic estimate by an editable assumed input rate. The defaults are fixed examples, not live prices. Output, caching and other billed features are excluded. Check the exact model's current pricing and actual usage before budgeting.",
      "links": []
    }
  ],
  "/tools/jwt-decoder": [
    {
      "id": "jwt-decoder-1",
      "question": "Does a decoded JWT prove that its signature is valid?",
      "answer": "No. The tool decodes the header and payload and displays the signature text without cryptographic verification. A readable token can still be forged. Verify it in your application using trusted keys and the required algorithm and claim checks.",
      "links": [
        {
          "label": "JWT validation specification",
          "href": "https://www.rfc-editor.org/rfc/rfc7519.txt"
        }
      ]
    },
    {
      "id": "jwt-decoder-2",
      "question": "Why can an unexpired token still be rejected by my API?",
      "answer": "The expiry display marks a numeric exp as expired when your device clock reaches or exceeds that timestamp. It does not establish the signature, issuer, audience, not-before time or server-side session status. Check the API's rejection reason; this display is not continuous authorization or a substitute for server validation.",
      "links": []
    },
    {
      "id": "jwt-decoder-3",
      "question": "Can this tool decode an encrypted JWT?",
      "answer": "It expects three dot-separated segments with JSON in the decoded header and payload. Encrypted JWE compact tokens use a different structure and are not supported. Use the appropriate decryption library in a trusted environment with the required key.",
      "links": []
    }
  ],
  "/tools/password-generator": [
    {
      "id": "password-generator-1",
      "question": "Can I recover generated passwords after refreshing the page?",
      "answer": "The generator keeps up to ten recent passwords in page memory, without saving them to browser storage. A fresh page load does not restore that list. Save a password you intend to use before leaving; the history is not a password vault.",
      "links": []
    },
    {
      "id": "password-generator-2",
      "question": "Does the Strong label mean a password has been checked against breaches?",
      "answer": "No. The meter uses password length and the selected character types. It does not query breach databases, test account security or calculate a crack time. Treat the label as a limited indication of the chosen settings.",
      "links": []
    },
    {
      "id": "password-generator-3",
      "question": "Does selecting a character type guarantee it appears in the result?",
      "answer": "Yes. The generator takes at least one character from each selected group, fills the remaining positions and shuffles them. Character and shuffle choices use crypto.getRandomValues with rejection sampling to avoid modulo bias. Excluding ambiguous characters removes 0, O, l, 1 and I. Check the destination site's length and symbol rules.",
      "links": []
    }
  ],
  "/tools/base64": [
    {
      "id": "base64-1",
      "question": "Why does decoded Base64 show replacement characters or unreadable text?",
      "answer": "Base64 can represent arbitrary bytes, but the text decoder interprets those bytes as UTF-8. Binary files or another text encoding can therefore appear unreadable. Use the Image/File workflow for supported files, and preserve the original bytes when converting non-UTF-8 data.",
      "links": []
    },
    {
      "id": "base64-2",
      "question": "Why does URL-safe output still contain equals signs?",
      "answer": "The URL-safe option replaces + and / with - and _, but keeps = padding. Some protocols require padding to be omitted and others accept it. Follow the receiving protocol's rules; the toggle does not produce every protocol's required representation.",
      "links": []
    },
    {
      "id": "base64-3",
      "question": "Why does a data URL fail in the text decoder?",
      "answer": "A data URL includes a prefix such as data:image/png;base64, before the encoded bytes. The text decoder expects Base64 itself and does not remove that prefix. Use the Image/File preview for image data URLs, or supply only the payload when decoding actual UTF-8 text.",
      "links": []
    }
  ],
  "/tools/word-counter": [
    {
      "id": "word-counter-1",
      "question": "Why does the word count differ for Chinese text or joined words?",
      "answer": "The main counter splits on whitespace. Text without spaces can count as one word, and a hyphenated expression without spaces remains one item. It does not perform language-aware word segmentation. Use the destination editor's count when it defines the submission rule.",
      "links": []
    },
    {
      "id": "word-counter-2",
      "question": "Why can one emoji count as more than one character?",
      "answer": "The counter uses JavaScript string length, which counts UTF-16 code units. An emoji can occupy multiple units, and a combined emoji can contain several characters. This is not a count of visible symbols or a guarantee that a platform will use the same total.",
      "links": []
    },
    {
      "id": "word-counter-3",
      "question": "Why are sentence and paragraph totals different from my editor's?",
      "answer": "Sentences are counted as runs of ., ! or ? punctuation, so abbreviations can increase the count and unpunctuated sentences are missed. Paragraphs are separated by blank lines; a single line break does not start another paragraph. These are text rules, not grammatical analysis.",
      "links": []
    }
  ]
} as const satisfies Record<string, readonly FaqItem[]>;
