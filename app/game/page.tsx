"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/Card";
import { Hud } from "@/components/Hud";
import { WinOverlay } from "@/components/WinOverlay";
import { useMemoryGame } from "@/lib/useMemoryGame";
import styles from "./game.module.css";

export default function GamePage() {
  const game = useMemoryGame();
  const [pulse, setPulse] = useState<{ key: number; text: string } | null>(null);
  const lastPairs = useRef(0);

  useEffect(() => {
    if (game.matchedPairs > lastPairs.current) {
      setPulse({
        key: game.matchedPairs,
        text: game.streak > 1 ? `COMBO X${game.streak}` : "MATCH",
      });
    }
    lastPairs.current = game.matchedPairs;
  }, [game.matchedPairs, game.streak]);

  return (
    <main className={styles.page}>
      <header className={styles.top}>
        <div>
          <p className="eyebrow">neon recall</p>
          <h1 className={styles.title}>Match the grid</h1>
        </div>
        <Link className="pill" href="/">
          Exit
        </Link>
      </header>

      <Hud
        elapsedMs={game.elapsedMs}
        errors={game.errors}
        score={game.score}
        matchedPairs={game.matchedPairs}
        streak={game.streak}
      />

      <div className={styles.banner}>
        {game.status === "idle" && (
          <button type="button" className="pill pill-primary" onClick={game.start}>
            Start run
          </button>
        )}
        {game.status === "preview" && (
          <p className={`mono ${styles.bannerText}`} data-testid="banner">
            Memorise the grid
          </p>
        )}
        {game.status === "playing" && (
          <p className={`mono ${styles.bannerText}`} data-testid="banner">
            {game.isMismatch ? "No match" : "Find a pair"}
          </p>
        )}
      </div>

      <div className={styles.boardWrap}>
        <section className={styles.board} aria-label="Memory board">
          {game.cards.map((card) => (
            <Card
              key={card.id}
              card={card}
              disabled={game.locked || card.flipped || card.matched}
              mismatch={game.isMismatch}
              onFlip={game.flip}
            />
          ))}
        </section>
        {pulse && (
          <span key={pulse.key} className={styles.pulse} data-testid="pulse">
            {pulse.text}
          </span>
        )}
      </div>

      {game.status === "won" && (
        <WinOverlay
          score={game.score}
          elapsedMs={game.elapsedMs}
          errors={game.errors}
          onPlayAgain={game.start}
        />
      )}
    </main>
  );
}
