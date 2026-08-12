import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  DOCUMENTS,
  SEED_BOOKMARKS,
  SEED_HIGHLIGHTS,
  SEED_NOTES,
  type Bookmark,
  type Doc,
  type Highlight,
  type Note,
} from "./demo-data";

type State = {
  docs: Doc[];
  notes: Note[];
  bookmarks: Bookmark[];
  highlights: Highlight[];
};

type Store = State & {
  togglePin: (id: string) => void;
  removeDoc: (id: string) => void;
  addNote: (documentId: string, page: number, text: string) => void;
  deleteNote: (id: string) => void;
  toggleBookmark: (documentId: string, page: number) => void;
  setLastPage: (documentId: string, page: number) => void;
  addReadSeconds: (documentId: string, seconds: number) => void;
};

const KEY = "docnest-state-v1";
const StoreContext = createContext<Store | null>(null);

const initial: State = {
  docs: DOCUMENTS,
  notes: SEED_NOTES,
  bookmarks: SEED_BOOKMARKS,
  highlights: SEED_HIGHLIGHTS,
};

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(initial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState({ ...initial, ...(JSON.parse(raw) as State) });
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state, hydrated]);

  const value = useMemo<Store>(
    () => ({
      ...state,
      togglePin: (id) =>
        setState((s) => ({
          ...s,
          docs: s.docs.map((d) => (d.id === id ? { ...d, pinned: !d.pinned } : d)),
        })),
      removeDoc: (id) =>
        setState((s) => ({
          ...s,
          docs: s.docs.filter((d) => d.id !== id),
          notes: s.notes.filter((n) => n.documentId !== id),
        })),
      addNote: (documentId, page, text) =>
        setState((s) => ({
          ...s,
          notes: [
            ...s.notes,
            {
              id: `n${Date.now()}`,
              documentId,
              page,
              text,
              createdAt: new Date().toISOString(),
            },
          ],
        })),
      deleteNote: (id) => setState((s) => ({ ...s, notes: s.notes.filter((n) => n.id !== id) })),
      toggleBookmark: (documentId, page) =>
        setState((s) => {
          const existing = s.bookmarks.find((b) => b.documentId === documentId && b.page === page);
          if (existing) return { ...s, bookmarks: s.bookmarks.filter((b) => b.id !== existing.id) };
          return {
            ...s,
            bookmarks: [
              ...s.bookmarks,
              {
                id: `b${Date.now()}`,
                documentId,
                page,
                label: `Page ${page}`,
                createdAt: new Date().toISOString(),
              },
            ],
          };
        }),
      setLastPage: (documentId, page) =>
        setState((s) => ({
          ...s,
          docs: s.docs.map((d) =>
            d.id === documentId
              ? { ...d, lastPage: page, lastOpenedAt: new Date().toISOString() }
              : d,
          ),
        })),
      addReadSeconds: (documentId, seconds) =>
        setState((s) => ({
          ...s,
          docs: s.docs.map((d) =>
            d.id === documentId ? { ...d, readSeconds: d.readSeconds + seconds } : d,
          ),
        })),
    }),
    [state],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}

export function useDoc(id: string) {
  const { docs } = useStore();
  return docs.find((d) => d.id === id);
}
