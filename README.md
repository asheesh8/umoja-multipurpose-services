# Umoja Multipurpose Cleaning Services

Static-first website and lightweight request desk for Umoja Multipurpose Cleaning Services in Essex Junction, Vermont.

## Run Locally

Open `index.html` directly for the static site. The quote form will save requests in browser storage and show them in `#admin`.

For the local API and file-backed admin workflow:

```bash
npm start
```

Then open `http://localhost:5577`. Requests are stored in `data/requests.local.json`, which is intentionally ignored by git.

## Checks

```bash
npm test
```

## Structure

- `index.html` - immersive six-scene app shell
- `styles.css` - responsive visual system and fixed desktop/mobile layout
- `script.js` - scene routing, quote form, admin desk, export tools, static fallback storage
- `server.mjs` - no-dependency Node API and static file server
- `tests/api.test.mjs` - API coverage for create, list, validation, and status updates
