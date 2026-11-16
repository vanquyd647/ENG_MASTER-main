import { expect,it,vi } from 'vitest';
import { reportError } from './telemetry';
it('records IDs and safe codes without raw credentials or error payload',()=>{
  localStorage.clear();const log=vi.spyOn(console,'error').mockImplementation(()=>{});
  reportError('auth',{code:'auth/invalid-token',message:'private-token-value',token:'private-token-value'},{operationId:'operation-1',requestBody:'private-token-value'});
  const stored=localStorage.getItem('eng_master_diagnostics_v1')!;expect(stored).not.toContain('private-token-value');expect(JSON.parse(stored)[0]).toMatchObject({code:'auth/invalid-token',context:{operationId:'operation-1'}});log.mockRestore();
});
