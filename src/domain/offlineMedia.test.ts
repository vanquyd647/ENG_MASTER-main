import { expect, it } from 'vitest';
import { mediaRangeResponse } from '../../scripts/offline-media-response.mjs';

it('serves byte ranges needed for cached audio seeking, including suffix/open ranges and invalid positions', async () => {
  const response = () => new Response(new Uint8Array([1, 2, 3, 4, 5]), { headers: { 'Content-Type': 'audio/mpeg' } });
  for (const [range, expected] of [['bytes=1-3', [2, 3, 4]], ['bytes=3-', [4, 5]], ['bytes=-2', [4, 5]], ['bytes=0-99', [1, 2, 3, 4, 5]]] as const) {
    const result = await mediaRangeResponse(response(), range);
    expect(result.status).toBe(206);
    expect(result.headers.get('Content-Type')).toBe('audio/mpeg');
    expect(Array.from(new Uint8Array(await result.arrayBuffer()))).toEqual(expected);
  }
  for (const range of ['bytes=5-', 'bytes=4-2', 'bytes=-0', 'bytes=-', 'bytes=1-2,3-4', 'invalid']) {
    const result = await mediaRangeResponse(response(), range);
    expect(result.status).toBe(416);
    expect(result.headers.get('Content-Range')).toBe('bytes */5');
  }
});
