import { expect, it, vi } from 'vitest';
import { createDeferredRemoteUpdate } from './deferredRemoteUpdate';
it('re-reads the confirmed remote value after pending work drains, instead of applying an old snapshot',async()=>{
 let pending=true,value='old';const apply=vi.fn(),read=vi.fn(async()=>value);
 const update=createDeferredRemoteUpdate({isCurrent:()=>true,isBlocked:()=>pending,hasPending:async()=>pending,readRemote:read,apply,onError:vi.fn()});
 update.notify();expect(read).not.toHaveBeenCalled();
 value='confirmed-new';pending=false;await update.flush();
 expect(apply).toHaveBeenCalledWith('confirmed-new');expect(read).toHaveBeenCalledTimes(1);
});
it('checks the durable outbox again when a new write starts during the server read',async()=>{
 let pending=false,resolve!:(value:string)=>void;
 const apply=vi.fn(),read=vi.fn(()=>new Promise<string>(done=>{resolve=done;}));
 const update=createDeferredRemoteUpdate({isCurrent:()=>true,isBlocked:()=>false,hasPending:async()=>pending,readRemote:read,apply,onError:vi.fn()});
 update.notify();await vi.waitFor(()=>expect(read).toHaveBeenCalledTimes(1));
 pending=true;resolve('stale');await new Promise(done=>setTimeout(done,0));expect(apply).not.toHaveBeenCalled();
});
it('never writes an old account or disposed listener result after a request is in flight',async()=>{
 let current=true,resolve!:(value:string)=>void;const apply=vi.fn(),read=vi.fn(()=>new Promise<string>(done=>{resolve=done;}));
 const update=createDeferredRemoteUpdate({isCurrent:()=>current,isBlocked:()=>false,hasPending:async()=>false,readRemote:read,apply,onError:vi.fn()});
 update.notify();await vi.waitFor(()=>expect(read).toHaveBeenCalledTimes(1));current=false;update.dispose();resolve('other-owner');
 await new Promise(done=>setTimeout(done,0));expect(apply).not.toHaveBeenCalled();
});
it('reports network failure and retries the dirty state on the next sync event',async()=>{
 const apply=vi.fn(),onError=vi.fn(),read=vi.fn().mockRejectedValueOnce(Error('offline')).mockResolvedValue('ready');
 const update=createDeferredRemoteUpdate({isCurrent:()=>true,isBlocked:()=>false,hasPending:async()=>false,readRemote:read,apply,onError});
 update.notify();await vi.waitFor(()=>expect(onError).toHaveBeenCalledTimes(1));
 await update.flush();expect(apply).toHaveBeenCalledWith('ready');
});
it('does not overwrite a local preference changed while the request was in flight',async()=>{
 let local='before',resolve!:(value:string)=>void;const apply=vi.fn(),read=vi.fn(()=>new Promise<string>(done=>{resolve=done;}));
 const update=createDeferredRemoteUpdate({localVersion:()=>local,isCurrent:()=>true,isBlocked:()=>false,hasPending:async()=>false,readRemote:read,apply,onError:vi.fn()});
 update.notify();await vi.waitFor(()=>expect(read).toHaveBeenCalledTimes(1));local='new-local-record';resolve('old-server-record');
 await new Promise(done=>setTimeout(done,0));expect(apply).not.toHaveBeenCalled();
});
