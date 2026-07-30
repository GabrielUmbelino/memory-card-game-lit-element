import { beforeEach, describe, expect, it } from "vitest";
import { TOP_N, fetchRankings, sortRankings, submitRanking, type Ranking } from "@/lib/rankings";

function entry(name: string, score: number, timeMs = 20_000): Ranking {
  return { name, score, errors: 0, timeMs, createdAt: score };
}

beforeEach(() => localStorage.clear());

describe("sortRankings", () => {
  it("ranks by score, then by the faster run", () => {
    const sorted = sortRankings([
      entry("slow", 5_000, 40_000),
      entry("best", 9_000),
      entry("fast", 5_000, 10_000),
    ]);
    expect(sorted.map((item) => item.name)).toEqual(["best", "fast", "slow"]);
  });

  it("keeps only the top ten", () => {
    const many = Array.from({ length: 25 }, (_, index) => entry(`p${index}`, index * 100));
    expect(sortRankings(many)).toHaveLength(TOP_N);
    expect(sortRankings(many)[0].name).toBe("p24");
  });
});

describe("local persistence", () => {
  it("returns an empty board before any run", async () => {
    expect(await fetchRankings()).toEqual([]);
  });

  it("persists a submitted run and reads it back", async () => {
    const saved = await submitRanking({ name: "NEO", score: 8_200, errors: 1, timeMs: 31_000 });
    expect(saved[0]).toMatchObject({ name: "NEO", score: 8_200, errors: 1, timeMs: 31_000 });
    expect(await fetchRankings()).toHaveLength(1);
  });

  it("orders accumulated runs by score", async () => {
    await submitRanking({ name: "LOW", score: 1_000, errors: 4, timeMs: 60_000 });
    await submitRanking({ name: "HIGH", score: 9_500, errors: 0, timeMs: 12_000 });
    expect((await fetchRankings()).map((item) => item.name)).toEqual(["HIGH", "LOW"]);
  });
});
