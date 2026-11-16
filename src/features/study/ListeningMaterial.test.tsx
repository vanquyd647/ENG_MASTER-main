import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { ListeningMaterial } from './ListeningMaterial';
import { LISTENING_QUESTIONS } from '../../data/listeningPractice';
vi.mock('../../services/dialogueSpeech', () => ({ localEnglishVoices: () => [], speakDialogue: vi.fn(), stopDialogue: vi.fn() }));
afterEach(cleanup);

it('hides transcripts while answering, plays bundled audio without system voices, and reveals the source in review', () => {
  const question = LISTENING_QUESTIONS.find(q => q.kind === 'part3')!;
  const { rerender } = render(<ListeningMaterial question={question} />);
  expect(screen.queryByText(/Our client meeting starts/)).not.toBeInTheDocument();
  expect(screen.queryByText('Transcript và bản dịch')).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Nghe toàn bộ bài' })).toBeEnabled();
  expect(document.querySelector('audio')).toHaveAttribute('src',expect.stringContaining('/learning/audio-v1/'));
  expect(screen.queryByText(/Thiết bị chưa có giọng tiếng Anh offline/)).not.toBeInTheDocument();
  rerender(<ListeningMaterial question={question} review />);
  expect(screen.getByText('Transcript và bản dịch')).toBeInTheDocument();
  expect(screen.getByText(/Our client meeting starts/)).toBeInTheDocument();
});

it('does not leak a Part 1 answer in image alt text and reports failed images', () => {
  render(<ListeningMaterial question={LISTENING_QUESTIONS[0]} />);
  expect(screen.getByRole('img')).not.toHaveAttribute('alt', expect.stringMatching(/forklift/i));
  expect(screen.queryByText(LISTENING_QUESTIONS[0].options[1])).not.toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Nguồn ảnh' })).toHaveAttribute('href', expect.stringContaining('commons.wikimedia.org'));
  fireEvent.error(screen.getByRole('img'));
  expect(screen.getAllByRole('alert').some(row => row.textContent?.includes('Chưa tải được ảnh'))).toBe(true);
});
