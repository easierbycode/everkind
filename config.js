// Configure where the Stripe backend lives.
// For GitHub Pages, this must be HTTPS (e.g., https://your-render-app.onrender.com)
export const SERVER_BASE_URL = (new URLSearchParams(location.search).get('api')) 
  || 'http://localhost:4242';
