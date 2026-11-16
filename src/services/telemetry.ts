export const reportError = (category: string, error: unknown, context: Record<string, string | number> = {}) => {
  const candidate = error && typeof error === 'object' && 'code' in error ? String(error.code) : '';
  const code=/^[a-zA-Z0-9/_-]{1,128}$/.test(candidate)?candidate:'unknown';
  const safeContext=Object.fromEntries(Object.entries(context).filter(([key])=>/^(requestId|sessionId|operationId|attempt|pending|durationMs)$/.test(key)).map(([key,value])=>[key,typeof value==='string'?value.slice(0,400):value]));
  const event={id:crypto.randomUUID(),category,code,context:safeContext,release:import.meta.env.VITE_RELEASE_VERSION || 'local',at:new Date().toISOString()};
  console.error('ENG_MASTER',event);
  try {const key='eng_master_diagnostics_v1';const previous:unknown=JSON.parse(localStorage.getItem(key)||'[]');localStorage.setItem(key,JSON.stringify([event,...(Array.isArray(previous)?previous:[])].slice(0,100)));}catch{/* Diagnostics must not break learning. */}
};
