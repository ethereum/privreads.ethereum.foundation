# privreads.ethereum.org

Website for the Private Reads team at the Ethereum Foundation.

## Local development

```bash
npm install
npm run dev        # http://localhost:4321
```

## Adding a feed post

Create a `.md` file in `src/content/feed/` with this frontmatter:

```markdown
---
title: "Your Title"
description: "Short summary"
date: 2026-03-25
author: "Your Name"
type: "Update"
tags: ["pir", "torjs"]
---

Post content here (Markdown).
```

**Type** options: `Research`, `Engineering`, `Talk`, `Announcement`, `Update`, `Monthly Update`, `Quarterly Wrap-up`

Push to `main` and GitHub Actions will deploy automatically.
