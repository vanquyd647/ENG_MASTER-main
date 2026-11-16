import type { PracticeSelection } from './WorkplaceView';
import { selectPracticeQuestions } from '../../domain/practiceLearning';
import { Button } from '../../components/ui';
import { practiceKindLabel } from '../../data/learningContent';
import { summarizePracticeTopics } from '../../domain/practiceLearning';
import { usePracticeRecords } from '../../repositories/practiceStore';
import { Card } from '../../components/ui';
export function PracticeInsights({ days, onPractice }: { days: number; onPractice?:(selection:PracticeSelection)=>void }) {
  const { records, error } = usePracticeRecords();
  const now = Date.now();
  const rows = summarizePracticeTopics(records, now - days * 86400000, now);
  return <Card className="space-y-4"><h2 className="text-xl font-bold">Bài luyện theo chủ điểm · {days} ngày</h2>
    <p className="text-sm text-zinc-400">Từ tối đa 100 bài cũ và 100 bài mở rộng còn được lưu, tách khỏi SRS từ vựng. Tỷ lệ đúng tính cả câu bỏ trống; Chủ điểm có tỷ lệ đúng thấp đứng trước; số lượt ít chưa đủ để kết luận thành thạo.</p>
    {error ? <p role="alert">{error}</p> : !rows.length ? <p>Chưa có bài luyện trong khoảng thời gian này.</p> : <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr><th className="p-2">Chủ điểm</th><th className="p-2">Đúng / lượt</th><th className="p-2">Bỏ trống</th><th className="p-2">Tỷ lệ đúng</th>{onPractice&&<th className="p-2">Bài gợi ý</th>}</tr></thead><tbody>{rows.map(row => <tr key={row.kind + row.topic} className="border-t border-zinc-800"><th className="p-2 font-medium">{practiceKindLabel(row.kind)} · {row.topic}</th><td className="p-2">{row.correct}/{row.total}</td><td className="p-2">{row.unanswered}</td><td className="p-2">{Math.round(row.correct / row.total * 100)}%</td>{onPractice&&<td className="p-2"><Button variant="outline" onClick={()=>onPractice({kind:row.kind,questionIds:selectPracticeQuestions(records,{kind:row.kind,topic:row.topic,count:10}).map(q=>q.id)})}>Ôn chủ điểm</Button></td>}</tr>)}</tbody></table></div>}
  </Card>;
}
