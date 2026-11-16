"""Extract the numbered PDF table locally; requires pypdf (no OCR or network)."""
import json
import re
from pathlib import Path
from pypdf import PdfReader

root = Path(__file__).resolve().parents[1]
reader = PdfReader(root / "new/1250 từ vựng TOEIC.pdf")
rows = []
for page_number, page in enumerate(reader.pages, 1):
    current = None
    for line in page.extract_text(extraction_mode="layout").splitlines():
        match = re.match(
            r"^\s+(\d{1,4})\s{2,}(.+?)\s{2,}([a-z, ]+?)\s{2,}(.+?)\s{2,}(.+?)\s*$",
            line,
        )
        if match:
            number, word, pos, ipa, meaning = match.groups()
            current = {
                "number": int(number), "page": page_number,
                "word": word, "pos": pos, "phonetic": ipa, "meaning": meaning,
            }
            rows.append(current)
        elif current and re.match(r"^\s{85,}\S", line):
            current.setdefault("meaningContinuations", []).append(line.strip())
        elif current and re.match(r"^\s{50,}/", line):
            current.setdefault("alternativePhonetics", []).append(line.strip())

if len(reader.pages) != 23 or [row["number"] for row in rows] != list(range(1, 1001)):
    raise ValueError("Source layout changed: expected 23 pages and rows 1–1000.")
(root / "new/toeic-pdf-extracted.json").write_text(
    json.dumps(rows, ensure_ascii=False, indent=2) + "\n", encoding="utf-8",
)
print(f"Extracted {len(rows)} numbered rows from {len(reader.pages)} pages.")
