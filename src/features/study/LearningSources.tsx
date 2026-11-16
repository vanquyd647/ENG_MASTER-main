import { Card } from '../../components/ui';

export function LearningSources() {
  return <Card className="space-y-4">
    <h2 className="text-xl font-bold">Học liệu bổ sung và bài mẫu chính thức</h2>
    <p className="text-sm text-zinc-400">Mở tại website nguồn, cần kết nối mạng. Các bài bên ngoài không được chấm hoặc lưu thành kết quả ENG_MASTER.</p>
    <div className="grid gap-3 sm:grid-cols-3">{(['1', '3', '4'] as const).map(part => <a key={part} className="rounded-xl border border-indigo-500/30 p-4 text-indigo-200 underline underline-offset-4" href={'https://www.iibc-global.org/toeic/test/lr/about/format/sample0' + part + '.html'} target="_blank" rel="noopener noreferrer">Mẫu Part {part} · IIBC/ETS</a>)}</div>
    <section aria-label="Bài nghe VOA" className="space-y-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
      <h3 className="font-semibold text-emerald-200">Budget Cuts · Hội thoại công việc</h3>
      <p className="text-sm text-zinc-300">Nghe chuyện về cuộc họp, tin đồn cắt giảm ngân sách và nhiệm vụ mới. Bài có phần hướng dẫn của Professor Bot; dùng luyện hiểu hội thoại và từ vựng.</p>
      <audio controls preload="metadata" aria-label="Nghe Budget Cuts của VOA" src="/learning/listening-v1/voa-budget-cuts.mp3" className="w-full">Trình duyệt chưa hỗ trợ phát audio.</audio>
      <p className="text-xs text-zinc-400">Audio gốc: VOA Learning English. Không cần giọng hệ thống; dùng offline sau khi bộ offline tải xong. Transcript đầy đủ mở tại nguồn bên dưới và cần mạng.</p>
    </section>
    <a className="block text-indigo-200 underline underline-offset-4" href="https://learningenglish.voanews.com/a/lets-learn-english-level-2-lesson1/3960391.html" target="_blank" rel="noopener noreferrer">VOA · Budget Cuts: nghe hội thoại công việc và đọc transcript</a>
    <p className="text-xs text-zinc-400">VOA là bài nghe bổ sung theo chủ đề. Gói thử Part 1/3/4 trong ứng dụng do ENG_MASTER biên soạn riêng, chưa nghiệm thu giáo viên độc lập; không phải đề chính thức của ETS.</p>
  </Card>;
}
