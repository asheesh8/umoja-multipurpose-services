# Umoja Multipurpose Cleaning Services — Website Rebuild Kit

This folder is a self-contained kit that uses **Claude Code** to rebuild
Umoja Multipurpose Cleaning Services's website from scratch: a modern, smooth, fast site that shows off their
real Google reviews and the imagery already on their current site.

## What's inside

```
umoja-multipurpose-cleaning-services-website-kit/
├── rebuild.sh          # one command — runs Claude Code to build the site
├── PROMPT.md           # the build brief Claude follows
├── CLAUDE.md           # working rules for Claude during the build
├── data/
│   ├── business.json   # name, contact, address, rating, branding, photos
│   └── reviews.json    # real Google reviews (author, rating, text)
└── site/
    └── index.html      # starter shell — Claude rebuilds this into the full site
```

## How to run it

1. Install Claude Code: https://docs.claude.com/claude-code
2. From inside this folder, run:

   ```bash
   ./rebuild.sh
   ```

3. Claude reads `data/business.json` + `data/reviews.json` and rewrites
   everything under `site/` into a polished multi-section website.
4. Open `site/index.html` in a browser to preview, then deploy anywhere
   (Netlify, Vercel, GitHub Pages, or any static host).

No build tools required — the output is plain HTML/CSS/JS.
