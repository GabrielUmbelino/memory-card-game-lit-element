"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { RankingTable } from "@/components/RankingTable";
import { fetchRankings, type Ranking } from "@/lib/rankings";
import styles from "./page.module.css";

export default function HomePage() {
  const [rankings, setRankings] = useState<Ranking[] | null>(null);

  useEffect(() => {
    fetchRankings()
      .then(setRankings)
      .catch(() => setRankings([]));
  }, []);

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Neon Recall</h1>
      <p className={styles.lead}>Six pairs. Fewest misses, fastest clock.</p>
      <Link className="pill pill-primary" href="/game">
        Enter the grid
      </Link>

      <section className={styles.rankings} data-testid="rankings">
        <p className="eyebrow">top 10</p>
        {rankings === null ? (
          <p className={styles.muted}>Loading</p>
        ) : (
          <RankingTable rankings={rankings} empty="No runs yet." />
        )}
      </section>
    </main>
  );
}
