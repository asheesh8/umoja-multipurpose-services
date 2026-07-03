# Build rules

You are rebuilding the website for **Umoja Multipurpose Cleaning Services** (House cleaning service · CSV import, Essex Junction, VT).

- Treat `data/business.json` and `data/reviews.json` as the source of truth. Do
  not invent facts, phone numbers, hours, or services that aren't supported by them.
- Write the finished site into the `site/` directory. Keep it as static
  HTML/CSS/JS with **no build step** and **no external framework installs**.
- Use the branding images and photos referenced in `business.json` by their URLs.
  If an image URL fails to load, fall back to a tasteful gradient/solid section.
- Make it genuinely nice: responsive, accessible, fast, smooth scrolling, modern
  type and spacing, subtle motion. No lorem ipsum.
- Quote real reviews verbatim from `reviews.json` and attribute them correctly.
