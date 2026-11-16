import { describe, expect, it } from "vitest";
import { BASE_VOCABULARY, VOCABULARY } from "./vocabulary";
import { TOEIC_PDF_VOCABULARY } from "./toeic-pdf";
import rawRows from "../../new/toeic-pdf-extracted.json";
import report from "../../new/toeic-pdf-import-report.json";
import corrections from "../../new/vocabulary-existing-corrections.json";
import reviewed from "../../new/vocabulary-reviewed.json";
import baseline from "../../new/vocabulary-review-baseline.json";
import lexicalEvidence from "../../new/vocabulary-lexical-evidence.json";
import { getNewWordQueue } from "../lib/learning";
import { createBackup, normalizeBackup } from "../lib/backup";

describe("PDF vocabulary integration", () => {
  it("accounts for all PDF rows, including overlaps and the repeated package row", () => {
    expect(rawRows.map((row) => row.number)).toEqual(Array.from({ length: 1000 }, (_, index) => index + 1));
    const covered = [
      ...report.overlaps.map((row) => row.entry),
      ...report.duplicates.map((row) => row.entry),
      ...TOEIC_PDF_VOCABULARY.map((entry) => entry.source!.entry),
    ];
    expect(covered.sort((a, b) => a - b)).toEqual(rawRows.map((row) => row.number));
    const byId = new Map(VOCABULARY.map((entry) => [entry.id, entry]));
    for (const row of rawRows) {
      const canonicalWord = row.word === "according (to)" ? "according to" : row.word;
      const overlap = report.overlaps.find((entry) => entry.entry === row.number);
      const duplicate = report.duplicates.find((entry) => entry.entry === row.number);
      const entry = overlap ? byId.get(overlap.existingId)
        : duplicate ? VOCABULARY.find((entry) => entry.word === duplicate.word)
        : byId.get(`pdf-toeic-${String(row.number).padStart(4, "0")}`);
      expect(entry?.word).toBe(canonicalWord);
      if (entry?.source) expect(entry.source.page).toBe(row.page);
    }
    expect(new Set(VOCABULARY.map((entry) => entry.word)).size).toBe(1575);
    expect(new Set(VOCABULARY.map((entry) => entry.id)).size).toBe(1575);
  });

  it("retains reviewed definitions and requires bilingual examples for the entire catalog", () => {
    for (const correction of corrections) {
      const entry = BASE_VOCABULARY.find((word) => word.id === correction.id)!;
      expect(entry.word).toBe(correction.word);
      expect(entry.meaning).toBe((reviewed as Record<string, typeof reviewed["rec-01"]>)[entry.id].meaning);
      expect(entry.translations?.vi).toBe(entry.meaning);
      expect(entry.example).not.toBe("");
      expect(entry.exampleTranslation).not.toBe("");
    }
    expect(BASE_VOCABULARY.every((word) => word.example && word.exampleTranslation)).toBe(true);
    expect(TOEIC_PDF_VOCABULARY.every((word) => word.source && word.example && word.exampleTranslation)).toBe(true);
    const byWord = new Map(TOEIC_PDF_VOCABULARY.map((word) => [word.word, word]));
    expect(byWord.get("stapler")?.meaning).toContain("bấm ghim");
    expect(byWord.get("unfortunately")?.pos).toBe("adverb");
    expect(byWord.get("log on")?.phonetic).toBe("/lɔɡ ˈɑn/");
  });

  it("makes new words studyable and round-trips their progress alongside legacy progress", () => {
    const item = { easiness: 2.5, interval: 1, repetitions: 1, nextReviewDate: "2026-10-14T00:00:00.000Z" };
    const progress = { [BASE_VOCABULARY[0].id]: item, [TOEIC_PDF_VOCABULARY[0].id]: item };
    const queue = getNewWordQueue(progress);
    expect(queue).toHaveLength(VOCABULARY.length - 2);
    expect(queue.some((entry) => entry.id === TOEIC_PDF_VOCABULARY.at(-1)!.id)).toBe(true);
    expect(normalizeBackup(createBackup(null, progress)).progress).toEqual(progress);
  });

  it("accepts backups containing the full expanded catalog", () => {
    const item = { easiness: 2.5, interval: 6, repetitions: 2, nextReviewDate: "2026-10-19T00:00:00.000Z" };
    const progress = Object.fromEntries(VOCABULARY.map((word) => [word.id, item]));
    const restored = normalizeBackup(createBackup(null, progress));
    expect(Object.keys(restored.progress)).toHaveLength(1575);
    expect(restored.progress[TOEIC_PDF_VOCABULARY.at(-1)!.id]).toEqual(item);
  });
});

describe("linguistic regression checks", () => {
  it("keeps every ID, headword, topic and PDF reference stable", () => {
    expect(VOCABULARY.map(({ id, word, topic, source }) => ({ id, word, topic, source })))
      .toEqual(baseline.map(({ id, word, topic, source }) => ({ id, word, topic, source })));
  });

  it("uses lexical parts of speech and records grammatical exceptions explicitly", () => {
    const exceptions = new Set(["mounting", "several"]);
    for (const entry of VOCABULARY) {
      const reference = (lexicalEvidence.entries as Record<string, { partsOfSpeech: string[] }>)[entry.word];
      expect(reference).toBeDefined();
      const pos = ({ adjective: "adj", adverb: "adv" } as Record<string,string>)[entry.pos] || entry.pos;
      if (reference.partsOfSpeech.length && !exceptions.has(entry.word)) {
        expect(reference.partsOfSpeech).toContain(pos);
      }
    }
  });

  it("fixes the known POS, IPA and verb-complement errors", () => {
    const words = new Map(VOCABULARY.map((entry) => [entry.word, entry]));
    expect(words.get("compensate")?.pos).toBe("verb");
    expect(words.get("compensate")?.example).toContain("compensate customers for");
    expect(words.get("elegant")?.pos).toBe("adjective");
    expect(words.get("coordination")?.pos).toBe("noun");
    expect(words.get("concentrate")?.pos).toBe("verb");
    expect(words.get("necessarily")?.pos).toBe("adverb");
    expect(words.get("refusal")?.phonetic).toBe("/rɪˈfjuzəl/");
    expect(words.get("specialty")?.phonetic).toBe("/ˈspɛʃəlti/");
    expect(words.get("consist")?.example).toContain("consist of");
    expect(words.get("adhere")?.example).toContain("adhere to");
    expect(words.get("severely")?.example).toContain("severely damaged");
  });
});
