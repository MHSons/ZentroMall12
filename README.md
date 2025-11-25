# Ehsan Collection — Production-ready starter

This repository is a production-ready React + Vite + Tailwind frontend for *Ehsan Collection* with:
- Responsive UI (mobile/tablet/desktop)
- Cart, product modal, cart drawer
- Stripe Checkout serverless function (Vercel-compatible)
- WhatsApp & Bank transfer checkout options
- Contact: WhatsApp 03018067880, Bank: Naya pay 03018067880, Email: ehsancollection@gmail.com
- Logo: included as public/logo.png (the logo you uploaded)

## How to run locally

1. Node 18+ recommended.
2. Install dependencies:
```bash
npm install
```
3. Start dev server:
```bash
npm run dev
```
4. Open http://localhost:5173

## Deploy (recommended) — Vercel

1. Push this repo to GitHub.
2. Import the repo into Vercel.
3. Add environment variable `STRIPE_SECRET_KEY` in Vercel project settings (your Stripe secret key).
4. Deploy. The serverless function will be available at `/api/create-checkout-session`.

### Important notes
- Stripe requires a secret key; do **not** commit your secret key to the repository.
- Stripe may not support PKR for all accounts; change currency in `src/App.jsx` and the client payload accordingly if needed.
- Replace placeholder product images in `public/products/` with your real product photos (optimized WebP recommended).
- This project is intended to be a complete, deployable codebase. If you want, I can also deploy it for you (if you give GitHub access) or guide you step-by-step.

