import { describe, expect, it } from "vitest";
import {
  BASE_SCORE,
  ERROR_PENALTY,
  MIN_SCORE,
  PERFECT_BONUS,
  TIME_PENALTY_PER_SECOND,
  calculateScore,
  formatTime,
} from "@/lib/scoring";

describe("calculateScore", () => {
  it("awards the flawless bonus on an instant perfect run", () => {
    expect(calculateScore(0, 0)).toBe(BASE_SCORE + PERFECT_BONUS);
  });

  it("charges for elapsed time", () => {
    expect(calculateScore(10_000, 0)).toBe(BASE_SCORE + PERFECT_BONUS - 10 * TIME_PENALTY_PER_SECOND);
  });

  it("charges per error and drops the bonus", () => {
    expect(calculateScore(0, 2)).toBe(BASE_SCORE - 2 * ERROR_PENALTY);
  });

  it("rewards the faster of two runs with equal errors", () => {
    expect(calculateScore(20_000, 3)).toBeGreaterThan(calculateScore(60_000, 3));
  });

  it("rewards the cleaner of two runs with equal time", () => {
    expect(calculateScore(30_000, 1)).toBeGreaterThan(calculateScore(30_000, 5));
  });

  it("never drops below the floor", () => {
    expect(calculateScore(60 * 60 * 1000, 99)).toBe(MIN_SCORE);
  });

  it("treats negative time as zero", () => {
    expect(calculateScore(-5_000, 0)).toBe(BASE_SCORE + PERFECT_BONUS);
  });
});

describe("formatTime", () => {
  it("formats mm:ss", () => {
    expect(formatTime(0)).toBe("0:00");
    expect(formatTime(9_400)).toBe("0:09");
    expect(formatTime(65_000)).toBe("1:05");
    expect(formatTime(600_000)).toBe("10:00");
  });
});
