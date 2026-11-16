import { READING_PASSAGES } from './extendedPractice';
import { EXPANSION_PASSAGES } from './examExpansion';
import { EXAM_READING_SUPPLEMENT } from './examReadingSupplement';
import {CALIBRATED_READING_PASSAGES} from './readingCalibration';
import {lengthenOriginalExamPassage} from './examReadingLength';
export const ALL_READING_PASSAGES = [...READING_PASSAGES, ...EXPANSION_PASSAGES.map(lengthenOriginalExamPassage),...EXAM_READING_SUPPLEMENT,...CALIBRATED_READING_PASSAGES];
export const readingById = new Map(ALL_READING_PASSAGES.map(row => [row.id, row]));
