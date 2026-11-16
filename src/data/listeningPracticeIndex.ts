// Compact registry for additive bank 2 questions. No image URLs/transcripts in schema imports.
const photos = ['forklift', 'desk', 'home-office', 'conference', 'bicycle', 'cyclist'];
export const LISTENING_PRACTICE_INDEX: Record<string, readonly [string, number]> = Object.fromEntries([
  ...photos.map(id => ['p1-listening-v1-' + id + '-q1', ['part1', 4]]),
  ...(['meeting', 'delivery'] as const).flatMap(id => [1, 2, 3].map(n => ['p3-listening-v1-' + id + '-q' + n, ['part3', 4]])),
  ...(['museum', 'repair'] as const).flatMap(id => [1, 2, 3].map(n => ['p4-listening-v1-' + id + '-q' + n, ['part4', 4]])),
]);
