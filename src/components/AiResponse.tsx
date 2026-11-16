import ReactMarkdown from 'react-markdown';
import { remarkAiLayout } from './aiMarkdown';
import { cn } from '../lib/utils';

export function AiResponse({ content, compact = false }: { content: string; compact?: boolean }) {
  return <article aria-label="Phản hồi AI" className={cn('ai-response', compact && 'ai-response-compact')}>
    <ReactMarkdown skipHtml remarkPlugins={[remarkAiLayout]}>{content}</ReactMarkdown>
  </article>;
}
