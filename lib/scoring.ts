export const BASE_SCORE = 10_000;
export const TIME_PENALTY_PER_SECOND = 25;
export const ERROR_PENALTY = 300;
export const PERFECT_BONUS = 1_500;
export const MIN_SCORE = 500;

/** Points reward speed and punish wrong guesses. A flawless run gets a bonus. */
export function calculateScore(elapsedMs: number, errors: number): number {
  const seconds = Math.max(0, elapsedMs) / 1000;
  const raw =
    BASE_SCORE -
    seconds * TIME_PENALTY_PER_SECOND -
    errors * ERROR_PENALTY +
    (errors === 0 ? PERFECT_BONUS : 0);
  return Math.max(MIN_SCORE, Math.round(raw));
}

export function formatTime(elapsedMs: number): string {
  const total = Math.floor(Math.max(0, elapsedMs) / 1000);
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}
