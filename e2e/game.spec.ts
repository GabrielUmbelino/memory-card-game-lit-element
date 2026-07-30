import { expect, test, type Page } from "@playwright/test";

const CARD = '[data-testid="card"]';

/** Read the layout during the memorisation window, like a player would. */
async function startAndMemorise(page: Page) {
  await page.goto("/game");
  await page.getByRole("button", { name: "Start run" }).click();
  const figures = await page
    .locator(CARD)
    .evaluateAll((cards) => cards.map((card) => card.getAttribute("data-figure") ?? ""));
  expect(figures.filter(Boolean)).toHaveLength(12);
  await expect(page.getByTestId("banner")).toHaveText("Find a pair");
  return figures;
}

function pairIndexes(figures: string[]): [number, number][] {
  const slots = new Map<string, number[]>();
  figures.forEach((figure, index) => slots.set(figure, [...(slots.get(figure) ?? []), index]));
  return [...slots.values()].map(([a, b]) => [a, b]);
}

test("presentation page leads into the game", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Neon Recall" })).toBeVisible();
  await expect(page.getByTestId("rankings")).toBeVisible();
  await page.getByRole("link", { name: "Enter the grid" }).click();
  await expect(page).toHaveURL(/\/game$/);
  await expect(page.locator(CARD)).toHaveCount(12);
});

test("a wrong pair turns back over and costs an error", async ({ page }) => {
  const figures = await startAndMemorise(page);
  const first = 0;
  const second = figures.findIndex((figure) => figure !== figures[first]);
  const cards = page.locator(CARD);

  await cards.nth(first).click();
  await cards.nth(second).click();
  await expect(page.getByTestId("banner")).toHaveText("No match");
  await expect(cards.nth(first)).toHaveAttribute("data-state", "hidden");
  await expect(cards.nth(second)).toHaveAttribute("data-state", "hidden");
  await expect(page.getByTestId("errors")).toHaveText("1");
});

test("a matching pair stays open and fires the match effect", async ({ page }) => {
  const figures = await startAndMemorise(page);
  const [[a, b]] = pairIndexes(figures);
  const cards = page.locator(CARD);

  await cards.nth(a).click();
  await cards.nth(b).click();
  await expect(cards.nth(a)).toHaveAttribute("data-state", "matched");
  await expect(cards.nth(b)).toHaveAttribute("data-state", "matched");
  await expect(page.getByTestId("pulse")).toHaveText("MATCH");
  await expect(page.getByTestId("errors")).toHaveText("0");
});

test("a clean run scores, submits, and lands on the leaderboard", async ({ page }) => {
  const figures = await startAndMemorise(page);
  const cards = page.locator(CARD);

  for (const [a, b] of pairIndexes(figures)) {
    await cards.nth(a).click();
    await cards.nth(b).click();
    await expect(cards.nth(a)).toHaveAttribute("data-state", "matched");
  }

  const dialog = page.getByRole("dialog", { name: "Run complete" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText("flawless bonus")).toBeVisible();
  const score = await page.getByTestId("final-score").textContent();

  await dialog.getByLabel("Handle").fill("PLAYWRIGHT");
  await dialog.getByRole("button", { name: "Submit score" }).click();
  await expect(dialog.getByText("PLAYWRIGHT")).toBeVisible();

  await dialog.getByRole("link", { name: "Rankings" }).click();
  await expect(page).toHaveURL("/");
  const board = page.getByTestId("rankings");
  await expect(board.getByText("PLAYWRIGHT")).toBeVisible();
  await expect(board.getByText(score!, { exact: true })).toBeVisible();
});

test("replaying deals a fresh board", async ({ page }) => {
  const figures = await startAndMemorise(page);
  const cards = page.locator(CARD);
  for (const [a, b] of pairIndexes(figures)) {
    await cards.nth(a).click();
    await cards.nth(b).click();
  }

  await page.getByRole("button", { name: "Play again" }).click();
  await expect(page.getByRole("dialog", { name: "Run complete" })).toBeHidden();
  await expect(page.getByTestId("errors")).toHaveText("0");
  await expect(page.getByTestId("banner")).toHaveText("Find a pair");
  await expect(page.locator('[data-state="matched"]')).toHaveCount(0);
});
