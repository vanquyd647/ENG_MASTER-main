// Presentation only: keep the Markdown AST and split known labels at line starts.
// This also supports older AI replies that put every field in one paragraph.
interface MarkdownNode {
  type: string; value?: string; children?: MarkdownNode[]; spread?: boolean;
  data?: { hProperties?: Record<string, unknown>; [key: string]: unknown };
}
const labels = [
  { tone: 'mistake', pattern: /^(Đáp án của (?:em|bạn)|Câu trả lời của (?:em|bạn)|Bạn (?:đã chọn|chọn|trả lời)|Your answer)\s*:\s*/iu },
  { tone: 'correct', pattern: /^(Nghĩa đúng|Nghĩa chính xác|Đáp án đúng|Đáp án|Correct answer)\s*:\s*/iu },
  { tone: 'explanation', pattern: /^(Giải thích(?: lỗi)?|Phân tích lỗi|Explanation)\s*:\s*/iu },
  { tone: 'example', pattern: /^(Câu đúng(?:\s*\(song ngữ\))?|Ví dụ(?: công việc| song ngữ)?|Câu ví dụ|Example)\s*:\s*/iu },
  { tone: 'practice', pattern: /^(Bài ôn ngắn|Bài tập ôn(?: tập)?|Mẹo(?: ghi nhớ| tránh nhầm)?|Lưu ý)\s*:\s*/iu },
];
const textOf = (node: MarkdownNode): string => node.children ? node.children.map(textOf).join('') : node.value || '';
function removePrefix(nodes: MarkdownNode[], count: number): MarkdownNode[] {
  const result: MarkdownNode[] = [];
  for (const node of nodes) {
    if (!count) { result.push(node); continue; }
    const length = textOf(node).length;
    if (count >= length) { count -= length; continue; }
    result.push(node.children ? { ...node, children: removePrefix(node.children, count) } : { ...node, value: node.value?.slice(count) });
    count = 0;
  }
  return result;
}
function splitParagraph(paragraph: MarkdownNode): MarkdownNode[] {
  const lines: MarkdownNode[][] = [[]];
  for (const child of paragraph.children || []) {
    if (child.type === 'break') { lines.push([]); continue; }
    if (child.type !== 'text') { lines.at(-1)!.push(child); continue; }
    child.value!.split('\n').forEach((value, i) => { if (i) lines.push([]); if (value) lines.at(-1)!.push({ ...child, value }); });
  }
  const groups: { nodes: MarkdownNode[]; tone?: string; label?: string }[] = [];
  let found = false;
  for (const line of lines) {
    const text = line.map(textOf).join(''), trimmed = text.trimStart();
    const field = line[0]?.type === 'inlineCode' ? undefined : labels.find(row => row.pattern.test(trimmed));
    if (field) {
      found = true; const match = trimmed.match(field.pattern)!;
      groups.push({ tone: field.tone, label: match[1], nodes: removePrefix(line, text.length - trimmed.length + match[0].length) });
    } else {
      if (!groups.length) groups.push({ nodes: [] });
      const group = groups.at(-1)!;
      if (group.nodes.length) group.nodes.push({ type: 'text', value: '\n' });
      group.nodes.push(...line);
    }
  }
  if (!found) return [paragraph];
  return groups.filter(group => group.label || group.nodes.length).map(group => ({
    ...paragraph,
    children: group.label ? [{ type: 'strong', children: [{ type: 'text', value: group.label + ':' }] }, { type: 'text', value: ' ' }, ...group.nodes] : group.nodes,
    ...(group.tone ? { data: { ...paragraph.data, hProperties: { ...paragraph.data?.hProperties, className: 'ai-response-field', 'data-ai-tone': group.tone } } } : {}),
  }));
}
export function remarkAiLayout() {
  return (tree: unknown) => {
    const walk = (node: MarkdownNode) => {
      if (!node.children) return;
      if (node.type === 'list' || node.type === 'listItem') node.spread = true;
      node.children = node.children.flatMap(child => {
        if (child.type === 'paragraph') return splitParagraph(child);
        walk(child); return [child];
      });
    };
    walk(tree as MarkdownNode);
  };
}
