import React from "react";
import { reportError } from "../services/telemetry";
export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: Error) { reportError("ui", error); }
  render() {
    if (this.state.failed) return <div role="alert" className="min-h-screen grid place-items-center p-6"><div className="max-w-md space-y-4"><h1 className="text-xl font-bold">Chưa thể mở màn hình này</h1><p>Dữ liệu đã lưu vẫn được giữ trên thiết bị. Tải lại để thử tiếp.</p><button className="rounded-xl bg-indigo-600 px-5 py-3" onClick={() => window.location.reload()}>Tải lại ứng dụng</button></div></div>;
    return this.props.children;
  }
}
