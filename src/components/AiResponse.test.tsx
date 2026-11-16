import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, expect, it } from 'vitest';
import { AiResponse } from './AiResponse';
afterEach(cleanup);
const field = (tone: string) => document.querySelector(`[data-ai-tone="${tone}"]`)!;
it('separates the tightly packed legacy reply into labeled fields without losing emphasis or content', () => {
  render(<AiResponse content={'**Nghĩa đúng:** sự tính toán, phép tính\n**Đáp án của em:** thư từ\n**Giải thích:** **Calculation** xuất phát từ *calculate*.\n**Câu đúng (Song ngữ):**\nThe calculation was checked twice.\nPhép tính đã được kiểm tra hai lần.\n**Bài ôn ngắn:**\nQuestion: The accountant found an error.\n**Đáp án:** A (calculation)'} />);
  expect(field('correct')).toHaveTextContent('Nghĩa đúng: sự tính toán, phép tính');
  expect(field('mistake')).toHaveTextContent('Đáp án của em: thư từ');
  expect(field('explanation').querySelector('strong:not(:first-child)')).toHaveTextContent('Calculation');
  expect(field('example')).toHaveTextContent('The calculation was checked twice. Phép tính đã được kiểm tra hai lần.');
  expect(field('practice')).toHaveTextContent('Bài ôn ngắn:');
  expect(screen.getByRole('article', { name: 'Phản hồi AI' })).toHaveTextContent('A (calculation)');
});
it('handles plain labels, hard line breaks and colon positions outside bold markup', () => {
  render(<AiResponse content={'Nghĩa đúng: sự phụ thuộc  \n**Đáp án của bạn**: độc lập  \nGiải thích: Đây là hai nghĩa khác nhau.'} />);
  expect(field('correct')).toHaveTextContent('sự phụ thuộc');
  expect(field('mistake')).toHaveTextContent('độc lập');
  expect(field('explanation')).toHaveTextContent('Đây là hai nghĩa khác nhau.');
});
it('preserves numbered words, nested fields, headings, examples and real list semantics', () => {
  render(<AiResponse content={'## Ôn tập\n\n2. **dependence**\n   **Nghĩa đúng:** sự phụ thuộc\n   **Đáp án của em:** độc lập\n\n### Cụm từ thường gặp\n\n- dependence on suppliers\n- reduce dependence'} />);
  expect(screen.getByRole('heading', { name: 'Ôn tập' })).toBeVisible();
  expect(document.querySelector('ol')).toHaveAttribute('start', '2');
  expect(document.querySelector('ol li [data-ai-tone="correct"]')).toHaveTextContent('sự phụ thuộc');
  expect(document.querySelector('ol li [data-ai-tone="mistake"]')).toHaveTextContent('độc lập');
  expect(screen.getAllByRole('listitem')).toHaveLength(3);
});
it('leaves unknown responses and fenced code readable instead of inferring answer correctness', () => {
  render(<AiResponse content={'Một đoạn văn có chữ **Giải thích:** ở giữa câu.\n\n```text\nNghĩa đúng: đây chỉ là mã ví dụ\n```\n\n[Tham khảo](https://example.com)'} />);
  expect(document.querySelector('[data-ai-tone]')).toBeNull();
  expect(document.querySelector('pre code')).toHaveTextContent('Nghĩa đúng: đây chỉ là mã ví dụ');
  expect(screen.getByRole('link', { name: 'Tham khảo' })).toHaveAttribute('href', 'https://example.com');
});
it('keeps raw HTML and executable link schemes out of rendered AI output', () => {
  const { container } = render(<AiResponse content={'<script>alert(1)</script>\n\n[bad](javascript:alert%281%29)\n\n**Ví dụ:** từ vựng an toàn'} />);
  expect(container.querySelector('script')).toBeNull();
  expect(container.querySelector('a')?.getAttribute('href') || '').not.toMatch(/^javascript:/);
  expect(field('example')).toHaveTextContent('từ vựng an toàn');
});
