React (CDN) sample for Food Menu

This is a minimal React app that uses React + ReactDOM from CDN and Babel in-browser to compile JSX.
It runs without any bundler or npm build step.

Run:
1. Open a terminal in `frontend-react/`.
2. Start the static server:
   ```powershell
   node server.js
   ```
3. Open http://localhost:3001 in your browser.

Open in VS Code:
- From PowerShell run: `code C:\Users\sonu\food-ordering-qr\frontend-react` (if `code` CLI is available).

Notes:
- This demo shows a sample menu and add-to-cart functionality. Cart is persisted to `localStorage`.
- For a production React app, convert to a proper toolchain (Vite / Create React App) and run `npm install` / build.
