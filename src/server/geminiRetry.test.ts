import { describe, expect, it, vi } from 'vitest';
import { withGeminiRetry } from './geminiRetry';

describe('bounded Gemini retry', () => {
  it('recovers a fast 503 with one retry within the original deadline', async () => {
    let clock = 0;
    const request = vi.fn().mockRejectedValueOnce({status:503}).mockResolvedValueOnce('ok');
    const pause = vi.fn(async (delay:number) => { clock += delay; });
    expect(await withGeminiRetry(request,45000,()=>clock,pause)).toBe('ok');
    expect(request).toHaveBeenCalledTimes(2);
    expect(request.mock.calls[1][0]).toBeLessThan(45000);
  });
  it('never retries an invalid key, quota, response schema error or a deadline', async () => {
    for (const error of [{status:401},{status:403},{status:429},{status:504},new Error('invalid_response')]) {
      const request = vi.fn().mockRejectedValue(error), pause = vi.fn();
      await expect(withGeminiRetry(request,45000,()=>0,pause)).rejects.toBe(error);
      expect(request).toHaveBeenCalledOnce(); expect(pause).not.toHaveBeenCalled();
    }
  });
  it('does not retry a slow upstream error or start a request after the budget expires', async () => {
    let clock = 0;
    const request = vi.fn(async () => { clock=44000; throw {status:503}; });
    await expect(withGeminiRetry(request,45000,()=>clock)).rejects.toEqual({status:503});
    expect(request).toHaveBeenCalledOnce();
    await expect(withGeminiRetry(request,45000,()=>45000)).rejects.toThrow('deadline');
    expect(request).toHaveBeenCalledOnce();
  });
});
