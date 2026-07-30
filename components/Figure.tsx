import { Bird, Bot, Cat, Fish, Ghost, Rabbit } from "lucide-react";
import type { FigureId } from "@/lib/cards";

/** Cute cyberpunk critters from lucide (ISC licensed), tinted with the DESIGN.md accents. */
const FIGURE_MAP = {
  bot: { Icon: Bot, color: "var(--breeze)", label: "droid" },
  cat: { Icon: Cat, color: "var(--sunset)", label: "cyber cat" },
  ghost: { Icon: Ghost, color: "var(--twilight)", label: "ghost in the shell" },
  rabbit: { Icon: Rabbit, color: "var(--sunset-soft)", label: "chrome hare" },
  bird: { Icon: Bird, color: "var(--ink)", label: "drone bird" },
  fish: { Icon: Fish, color: "var(--dusk)", label: "neon koi" },
} as const satisfies Record<FigureId, { Icon: typeof Bot; color: string; label: string }>;

export function figureLabel(figure: FigureId): string {
  return FIGURE_MAP[figure].label;
}

export function Figure({ figure, size = 64 }: { figure: FigureId; size?: number }) {
  const { Icon, color } = FIGURE_MAP[figure];
  return (
    <Icon
      size={size}
      strokeWidth={1.25}
      color={color}
      style={{ filter: `drop-shadow(0 0 12px ${color})` }}
      aria-hidden
    />
  );
}
