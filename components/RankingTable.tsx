import { formatTime } from "@/lib/scoring";
import type { Ranking } from "@/lib/rankings";
import styles from "./RankingTable.module.css";

export function RankingTable({ rankings, empty }: { rankings: Ranking[]; empty: string }) {
  if (!rankings.length) {
    return <p className={styles.empty}>{empty}</p>;
  }

  return (
    <ol className={styles.list}>
      {rankings.map((entry, index) => (
        <li key={`${entry.createdAt}-${entry.name}`} className={styles.row}>
          <span className={`mono ${styles.rank}`}>{String(index + 1).padStart(2, "0")}</span>
          <span className={styles.name}>{entry.name}</span>
          <span className={`mono ${styles.meta}`}>
            {formatTime(entry.timeMs)} · {entry.errors} err
          </span>
          <span className={`mono ${styles.score}`}>{entry.score.toLocaleString("en-US")}</span>
        </li>
      ))}
    </ol>
  );
}
