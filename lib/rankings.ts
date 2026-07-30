export type Ranking = {
  name: string;
  score: number;
  errors: number;
  timeMs: number;
  createdAt: number;
};

export const TOP_N = 10;
const STORAGE_KEY = "memory-card-game:rankings";
const COLLECTION = "rankings";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/** Firestore is used when configured; otherwise scores stay in the browser. */
export const usesFirestore = Boolean(firebaseConfig.projectId && firebaseConfig.apiKey);

/** Imported on demand so the SDK stays out of the bundle when it is unused. */
async function firestore() {
  const [{ getApp, getApps, initializeApp }, sdk] = await Promise.all([
    import("firebase/app"),
    import("firebase/firestore"),
  ]);
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  return { rankings: sdk.collection(sdk.getFirestore(app), COLLECTION), sdk };
}

function readLocal(): Ranking[] {
  if (typeof localStorage === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as Ranking[]) : [];
}

export function sortRankings(rankings: Ranking[]): Ranking[] {
  return [...rankings].sort((a, b) => b.score - a.score || a.timeMs - b.timeMs).slice(0, TOP_N);
}

export async function fetchRankings(): Promise<Ranking[]> {
  if (!usesFirestore) return sortRankings(readLocal());
  const { rankings, sdk } = await firestore();
  const snapshot = await sdk.getDocs(
    sdk.query(rankings, sdk.orderBy("score", "desc"), sdk.limit(TOP_N)),
  );
  return snapshot.docs.map((doc) => doc.data() as Ranking);
}

export async function submitRanking(entry: Omit<Ranking, "createdAt">): Promise<Ranking[]> {
  const ranking: Ranking = { ...entry, createdAt: Date.now() };
  if (!usesFirestore) {
    const next = sortRankings([...readLocal(), ranking]);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return next;
  }
  const { rankings, sdk } = await firestore();
  await sdk.addDoc(rankings, ranking);
  return fetchRankings();
}
