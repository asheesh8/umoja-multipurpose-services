# Umoja Website Handoff

This package now contains a static-first app shell and optional local API for Umoja Multipurpose Cleaning Services.

## Current State

- The public site has been rebuilt into `index.html` as a fixed six-scene experience: Home, Services, Proof, Quote, Admin, and Contact.
- Desktop uses a vertical scene rail; mobile uses a bottom dock.
- The quote form saves requests into the admin desk. When `npm start` is running, requests post to `/api/requests`; otherwise they save to browser storage.
- The admin desk is intentionally unprotected for now, per request, and supports status changes plus JSON/CSV export.
- Legacy page URLs now redirect into the relevant app scene.

## Main Files

- `index.html` - immersive app shell and form/admin markup
- `styles.css` - responsive visual system and scene layout
- `script.js` - hash routing, service tabs, quote form, admin desk, exports, static fallback
- `server.mjs` - no-dependency Node API and static server
- `tests/api.test.mjs` - API integration coverage

## Preview

- Static preview: open `index.html`
- Local API preview: run `npm start`, then open `http://localhost:5577`

## Notes For Next Steps

- Add authentication before exposing the admin desk publicly.
- Connect the form to durable hosted storage before relying on production submissions.
- Confirm live Google review count before launch.
