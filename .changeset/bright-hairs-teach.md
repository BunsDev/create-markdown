---
"@create-markdown/preview": minor
"@create-markdown/preview-mermaid": minor
"create-markdown": minor
---

Split Mermaid support into a dedicated `@create-markdown/preview-mermaid` addon package and add the matching `create-markdown/preview-mermaid` convenience export.

Base preview rendering continues to work as before for the normal happy path, but Mermaid users now need to install the addon explicitly:

`pnpm add @create-markdown/preview-mermaid mermaid`

If you previously imported `mermaidPlugin` from `@create-markdown/preview`, update that import to `@create-markdown/preview-mermaid`.
