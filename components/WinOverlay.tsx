"use client";

import { useState } from "react";
import Link from "next/link";
import { submitRanking, type Ranking } from "@/lib/rankings";
import { formatTime } from "@/lib/scoring";
import { RankingTable } from "./RankingTable";
import styles from "./WinOverlay.module.css";

type Props = {
  score: number;
  elapsedMs: number;
  errors: number;
  onPlayAgain: () => void;
};

export function WinOverlay({ score, elapsedMs, errors, onPlayAgain }: Props) {
  const [name, setName] = useState("");
  const [rankings, setRankings] = useState<Ranking[] | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    const saved = await submitRanking({
      name: name.trim().slice(0, 16) || "ANON",
      score,
      errors,
      timeMs: elapsedMs,
    });
    setRankings(saved);
    setSaving(false);
  }

  return (
    <div className={styles.overlay} role="dialog" aria-label="Run complete">
      <div className={`panel ${styles.card}`}>
        <p className="eyebrow">run complete</p>
        <p className={`mono ${styles.score}`} data-testid="final-score">
          {score.toLocaleString("en-US")}
        </p>
        <p className={`mono ${styles.summary}`}>
          {formatTime(elapsedMs)} · {errors} {errors === 1 ? "error" : "errors"}
          {errors === 0 ? " · flawless bonus" : ""}
        </p>

        {rankings ? (
          <div className={styles.results}>
            <p className="eyebrow">top 10</p>
            <RankingTable rankings={rankings} empty="No scores yet." />
          </div>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit}>
            <input
              className={styles.input}
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Handle"
              aria-label="Handle"
              maxLength={16}
            />
            <button type="submit" className="pill pill-primary" disabled={saving}>
              {saving ? "Saving" : "Submit score"}
            </button>
          </form>
        )}

        <div className={styles.actions}>
          <button type="button" className="pill" onClick={onPlayAgain}>
            Play again
          </button>
          <Link className="pill" href="/">
            Rankings
          </Link>
        </div>
      </div>
    </div>
  );
}
