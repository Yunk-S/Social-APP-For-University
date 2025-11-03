## APP — Campus Social & Communication Platform (Demo)

A lightweight demo of a social and communication app designed for university students and faculty. It showcases core patterns such as messaging, media sharing, and real‑time interactions suitable for campus communities.

## Status
- Demo preview only; not production‑ready
- Features and data models are subject to change
- Some parts use mock services and sample assets

## Quick Start
1) Requirements: Node.js 18+ and npm
2) Install dependencies:
```bash
npm install
```
3) Start the development server:
```bash
npm start
```
The app will open at `http://localhost:3000/` (or the port shown in your terminal).

## AI Features
- AI Chat, Image Generation, Music Generation, Video Generation
- An AI quick bar is pinned at the top of the Chat page

### Configure School AI Endpoint
By default the app uses mock responses. Connect to your school's AI by setting either:

1) Environment variable (recommended for builds):
```bash
set REACT_APP_AI_BASE_URL=https://YOUR_AI_HOST
npm start
```

2) Or at runtime in the browser console:
```js
localStorage.setItem('seer_ai_base_url', 'https://YOUR_AI_HOST');
// Optional: set auth token if your gateway requires it
localStorage.setItem('seer_auth_token', 'Bearer <token>');
```

The app will call these endpoints (paths are examples that many gateways proxy):
- `POST /v1/chat/completions`
- `POST /v1/images/generations`
- `POST /v1/audio/music`
- `POST /v1/video/generations`

If your gateway differs, update `src/services/AIService.js` accordingly.

## Scripts
- `npm start`: Run the dev server with hot reload
- `npm run build`: Create an optimized production build (optional)

## Notes
- Demo is for presentation/testing in campus scenarios; avoid sensitive data
- If your environment blocks the default port, configure a custom port via env vars

## License
For demo and internal evaluation only.


