# ENG_MASTER

<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy ENG_MASTER

ENG_MASTER is a vocabulary learning app with offline guest study, Firebase
sync, spaced repetition, and authenticated Gemini learning tools.

The bundled catalog contains **1,575 unique entries**: 905 existing words and
670 additions from the supplied TOEIC PDF. See [the import report](docs/VOCABULARY_IMPORT.md)
for source counts, corrections, and how to rebuild the imported dataset.
All bundled entries have reviewed POS, broad American IPA and bilingual examples;
see [the linguistic review](docs/VOCABULARY_REVIEW.md).

The upgrade roadmap and current completion status are in [PROJECT_PLAN.md](PROJECT_PLAN.md). Phase 1 adds
version 3 backups for personal words, favorites, decks, preferences, daily activity and study events,
validated JSON/CSV imports, and recoverable Cloud restore. See
[phase 1 verification](docs/PHASE1_VERIFICATION.md) for checks and rollout order.

The upgrade now includes owner-scoped IndexedDB, a durable sync outbox, resumable study sessions, cloze/listening, event-based statistics and a build-generated offline pack. Default AI text model: `gemini-3.5-flash-lite`. See [upgrade verification](docs/UPGRADE_VERIFICATION.md), [release runbook](docs/RELEASE_RUNBOOK.md) and [sync policy](docs/SYNC_POLICY.md) for evidence, staging checks and limits. Release `2026.10.15-learning.7` is live at https://eng-master-main2.vercel.app. Current AI/UI/HTTP evidence is linked below; earlier dataset acceptance remains documented in its release reports. Guest mode includes “Đăng nhập để đồng bộ” and a reviewed guest merge. Dataset replacement stages a fresh generation and activates it atomically, with offline-device archives and rollback. Learning features include an actual-answer mistake notebook, exam-date roadmap, eight workplace lessons, a 166-question practice bank, six grammar lessons, four Part 6 passages and six Part 7 passages, local-voice dialogues, timed Part 2/Part 5/Part 6/Part 7 practice, and local PDF/CSV import with preview. Backups support 20 MB and paginated Cloud history. See [next-upgrade verification](docs/NEXT_UPGRADE_VERIFICATION.md). Google OAuth was verified with the user’s real account; Calendar, Tasks and Drive create/read/delete were verified with the user’s real account; QA items were removed. Avatar remains disabled and billing unchanged.

## Run Locally

**Prerequisites:** Node.js 22.x


1. Install dependencies:
   `npm ci`
2. Copy [.env.example](.env.example) to `.env.local`, then fill the Gemini,
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
npm run lint
npm test
npm run validate:vocab
npm run build
node scripts/verify-release-build.mjs
npm audit --audit-level=high
```

For Google login, Firebase Authentication must allow the deployed domain:

1. Open Firebase Console for the project used by `VITE_FIREBASE_PROJECT_ID`.
2. Go to Authentication -> Settings -> Authorized domains.
3. Verify the chosen project hostname. Both `eng-master-main2.vercel.app` and `eng-master-delta.vercel.app` are already authorized in the current Firebase project; the final Vercel target must be matched to project history.
4. Add any custom production domain or Vercel preview domain you use for login testing.

If the domain is missing, Google sign-in will fail with `auth/unauthorized-domain`.

Learning upgrade `2026.10.15-learning.1` adds a shared vocabulary/Part 2/Part 5 mistake notebook, exact-question retries, resumable daily learning flow, practice topic/scope/count filters, sentence-level offline dialogue controls and topic statistics. See [learning upgrade](docs/LEARNING_UPGRADE.md) for verification and retention limits. Avatar/native TTL remain deferred and billing is unchanged.

Learning content release `2026.10.15-learning.2` adds difficulty filters, topic practice recommendations and isolated extended history with v4 backups. The 1,575-word catalog and original 60 questions remain unchanged. See [content upgrade and production verification](docs/LEARNING_CONTENT_UPGRADE.md) for compatibility and retention limits.

PWA patch `2026.10.15-learning.3` fixes stale update banners where confirming did not reload. Includes loading/error/retry feedback and preserves saved study drafts. An already-open page running the old handler needs one normal reload. See [PWA fix verification](docs/PWA_UPDATE_FIX.md).

AI layout release `2026.10.15-learning.4` adds shared Markdown typography and labeled color panels for correct answers, mistakes, explanations, examples and practice. Works with existing replies across quiz review, inline library and study modal; includes separate request-error/retry feedback. See [AI response layout verification](docs/AI_RESPONSE_LAYOUT.md).

Library AI release `2026.10.15-learning.5` opens explanations in a separate scrollable dialog with a fixed header and close button. Keeps library filters/scroll/focus, cached replies, cancel and retry; no longer expands vocabulary cards. See [library dialog verification](docs/LIBRARY_AI_DIALOG.md).

AI learning release `2026.10.15-learning.6` adds structured reply cards, server lookup of reviewed words/examples, and contextual simplify/examples/compare/quick-check actions. Original data and AI additions have separate labels; old Markdown remains readable. Quick checks hide answers until submission and do not change study progress. Mistake feedback includes the original question and loads at most five errors per request. See [AI learning module and verification](docs/AI_LEARNING_MODULE.md), including remaining semantic limitations.

Learning.7 adds a saved four-stage, 20-question baseline assessment (Parts 2/5/6/7), deterministic answer observations, cued target recall and attributed ENG_MASTER teaching notes/examples. [Quality target and outstanding work](docs/QUALITY_TARGET_95.md): full-system 95% has not been established; Parts 1/3/4 and an integrated 200-question exam remain missing. The 45-item pilot mixes authored and generated content and is not an overall AI-accuracy score.
