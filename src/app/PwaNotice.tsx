import { useEffect, useState } from 'react';
import { applyOfflineUpdate } from '../services/pwaUpdate';
export function PwaNotice({busy = false}:{busy?:boolean}) {
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [failed, setFailed] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [updateFailed, setUpdateFailed] = useState(false);
  useEffect(() => {
    const updated = (event: Event) => setRegistration((event as CustomEvent<ServiceWorkerRegistration>).detail);
    const failure = () => setFailed(true);
    window.addEventListener('eng-master-update', updated); window.addEventListener('eng-master-offline-error', failure);
    void navigator.serviceWorker?.getRegistration().then(reg => { if (reg?.waiting && navigator.serviceWorker.controller) setRegistration(reg); }).catch(failure);
    return () => { window.removeEventListener('eng-master-update', updated); window.removeEventListener('eng-master-offline-error', failure); };
  }, []);
  if (failed) return <p role="status" className="p-3 text-amber-300 text-sm">Chưa tải xong bộ học offline. Giữ kết nối và tải lại trang để thử lại.</p>;
  if (!registration) return null;
  return <div role="status" className="p-3 bg-indigo-950 rounded-xl text-sm flex flex-wrap gap-3 items-center"><span>Có bản cập nhật. Phiên học đã lưu sẽ được giữ lại.</span><button disabled={busy || updating} className="underline text-indigo-200 disabled:opacity-40" onClick={() => {
    if (!window.confirm('Tải lại để cập nhật? Các câu chưa chấm sẽ không được tính; phiên đã lưu có thể tiếp tục.')) return;
    setUpdating(true); setUpdateFailed(false);
    void applyOfflineUpdate(registration).catch(() => { setUpdating(false); setUpdateFailed(true); });
  }}>{updating ? 'Đang cập nhật…' : 'Cập nhật'}</button><button disabled={updating} className="underline disabled:opacity-40" onClick={() => setRegistration(null)}>Để sau</button>{updateFailed && <p role="alert" className="w-full text-amber-300">Chưa thể cập nhật. Hãy thử lại; phiên học đã lưu vẫn được giữ.</p>}</div>;
}
