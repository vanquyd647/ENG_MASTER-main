import { describe, expect, it } from "vitest";
import { chunkItems } from "./chunks";

describe("Firestore batch chunking", () => {
  it("splits 905 writes below the 500-write Firestore limit", () => {
    const chunks = chunkItems(Array.from({ length: 905 }, (_, index) => index));
    expect(chunks.map((chunk) => chunk.length)).toEqual([400, 400, 105]);
  });
});
