# ENG_MASTER

<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy ENG_MASTER

ENG_MASTER is a vocabulary learning app with offline guest study, Firebase
sync, spaced repetition, and authenticated Gemini learning tools.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Copy [.env.example](.env.example) to `.env`, then fill the Gemini,
   Firebase Admin, and `VITE_FIREBASE_*` values.
3. Run the app:
   `npm run dev`

## Deploy to Vercel

Add these environment variables in Vercel Project Settings before deploying:

- `GEMINI_API_KEY`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`
- `APP_URL`
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`

The app pins Vercel to Node.js `22.x` through `package.json` because the Gemini SDK requires Node 20 or newer.

All `/api/gemini/*` endpoints require a Firebase ID token. The Admin
credentials verify that token and maintain server-only Firestore rate limits.
For `FIREBASE_PRIVATE_KEY`, paste the service-account private key with escaped
newlines (`\n`) in local and Vercel environment variables.

## Verification

Run the release gates before deployment:

```bash
npm run typecheck
npm test
npm run validate:vocab
npm run build
npm audit --audit-level=high
```

For Google login, Firebase Authentication must allow the deployed domain:

1. Open Firebase Console for the project used by `VITE_FIREBASE_PROJECT_ID`.
2. Go to Authentication -> Settings -> Authorized domains.
3. Add `eng-master-delta.vercel.app`.
4. Add any custom production domain or Vercel preview domain you use for login testing.

If the domain is missing, Google sign-in will fail with `auth/unauthorized-domain`.
