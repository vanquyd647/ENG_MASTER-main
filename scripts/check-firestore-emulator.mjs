const address = process.env.FIRESTORE_EMULATOR_HOST;
if (!address || !/^(?:127\.0\.0\.1|localhost):\d+$/.test(address)) {
  console.error('Start the local Firestore Emulator, then run: FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 npm run test:emulator');
  process.exit(1);
}
