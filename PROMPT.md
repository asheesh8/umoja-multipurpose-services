# Rebuild the website for Umoja Multipurpose Cleaning Services

Rebuild this business's website end-to-end into a modern, smooth, high-converting
static site. Read the data first, then regenerate everything under `site/`.

## Inputs
- `data/business.json` — identity, contact, address, Google rating, logo, cover, photos.
- `data/reviews.json` — real Google reviews (author, rating, text, time).

## Build
1. Read both JSON files.
2. Rewrite `site/index.html` (and any `site/styles.css` / `site/script.js` you need)
   into a complete, polished website for Umoja Multipurpose Cleaning Services in Essex Junction, VT.
3. Use the logo and photos from `business.json` (reference the image URLs directly).

## Required features
- Sticky responsive nav with a clear call-to-action (Call / Get directions)
- Hero with the business name, tagline, rating, and a primary CTA
- Services / about section written from the category and context
- A reviews section that surfaces the real Google reviews with stars
- Google rating badge with the live review count
- Contact section: click-to-call, email, address, and an embedded map link
- Smooth scroll, scroll-reveal animations, and tasteful hover states
- Mobile-first, accessible (semantic HTML, alt text, focus states), and fast

## Quality bar
- One cohesive brand look derived from the business + its imagery.
- Real review quotes only — pull them from `reviews.json`, never fabricate.
- Works with no server and no build step. Output must open directly in a browser.

When done, summarize what you built and list the files you created under `site/`.
