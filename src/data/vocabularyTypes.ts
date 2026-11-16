export interface Word {
  id: string;
  topic: string;
  word: string;
  phonetic: string;
  pos: string;
  meaning: string;
  // Bundled examples are authored for the selected sense, including PDF words.
  example: string;
  exampleTranslation: string;
  source?: {
    document: string;
    page: number;
    entry: number;
  };
  translations?: {
    vi?: string;
    fr?: string;
    es?: string;
    [key: string]: string | undefined;
  };
}
