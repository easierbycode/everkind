# EverKind — GitHub Pages Viewer

This folder contains the static 3D preview and checkout starter. It is designed to be served by **GitHub Pages** from the `/docs` directory on your `main` branch.

## Configure the backend URL
Edit `config.js` and set:
```js
export const SERVER_BASE_URL = 'https://YOUR-BACKEND-URL';
```
For local development, leave it as `http://localhost:4242` and run the server from `../server`.

## Enable GitHub Pages
1. Push this repo to GitHub.
2. Repository Settings → Pages → **Build and deployment**: Source = `Deploy from a branch`.
3. Branch = `main`, Folder = `/docs`.
4. Save. Your site will publish at `https://<user>.github.io/<repo>/`.

> Note: GitHub Pages is static hosting only. The Stripe backend must be hosted elsewhere (Render, Railway, Fly, Vercel Functions, etc.) and must use **HTTPS** to avoid mixed‑content errors.
