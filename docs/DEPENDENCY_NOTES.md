# Dependency runtime notes

## Firebase Admin 14 / jwks-rsa / jose

Vercel preview reproduced `ERR_REQUIRE_ESM` while initializing Firebase Admin 14.2.0: jwks-rsa 4.0.1 uses `require('jose')` with ESM-only jose 6. This happens before the application can return an auth error. Native Node 22 with `--no-experimental-require-module` reproduces the deployed failure.

Use the scoped npm override `jwks-rsa: { jose: '4.15.9' }`. Other jose consumers retain their dependency versions. This is the workaround acknowledged by the Firebase maintainer in [firebase-admin-node issue 3181](https://github.com/firebase/firebase-admin-node/issues/3181), tracking [the upstream jwks-rsa issue](https://github.com/auth0/node-jwks-rsa/issues/507). Do not remove the override merely because a new Admin patch is available; verify the installed dependency tree, native runtime gate and Vercel preview first.

`npm run test:api-runtime` emits the API dependency graph and imports all four handlers using native Node with CommonJS-to-ESM require disabled. This checks deployment import extensions and dependency initialization; requests without Firebase auth must return 401. The bundled Express build alone cannot detect these errors.

Server relative imports use `.js` so emitted ES modules resolve on Node. TypeScript/Vite resolve these paths to the source `.ts` files. `npm audit` and live authenticated API acceptance remain required before release.
