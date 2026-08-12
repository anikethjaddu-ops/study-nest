export type DocType = "pdf" | "docx" | "txt" | "epub";

export type Note = {
  id: string;
  documentId: string;
  page: number;
  text: string;
  createdAt: string; // ISO
};

export type Bookmark = {
  id: string;
  documentId: string;
  page: number;
  label: string;
  createdAt: string;
};

export type Highlight = {
  id: string;
  documentId: string;
  page: number;
  text: string;
  color: "yellow" | "green" | "pink" | "blue";
};

export type Doc = {
  id: string;
  title: string;
  author: string;
  type: DocType;
  sizeMb: number;
  totalPages: number;
  lastPage: number;
  pinned: boolean;
  dateAdded: string;
  lastOpenedAt: string;
  readSeconds: number;
  tags: string[];
  cover: string; // gradient css
  excerpt: string[]; // fake page text
};

export type Tag = { name: string; color: string };

export const TAGS: Tag[] = [
  { name: "Physics", color: "oklch(0.7 0.15 200)" },
  { name: "Novel", color: "oklch(0.7 0.16 20)" },
  { name: "Work", color: "oklch(0.72 0.15 162)" },
  { name: "Research", color: "oklch(0.68 0.18 300)" },
];

const body = (topic: string) => [
  `${topic} begins with a deceptively simple question, one that has followed careful readers for as long as the subject has had a name. The answer, as always, refuses to arrive in a straight line.`,
  `Consider the ordinary case first. What looks like noise at one scale resolves into structure at another, and the discipline of reading well is largely the discipline of choosing the right scale to look at.`,
  `We should be careful here. The temptation is to reach for the tidy conclusion, but the evidence supports something more modest, and more interesting: the pattern holds only under conditions we rarely encounter unaided.`,
  `By the end of this chapter you will have seen three arguments, two objections, and one unresolved tension. Keep a note of the tension — it returns later, wearing different clothes.`,
];

export const DOCUMENTS: Doc[] = [
  {
    id: "abc123",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    type: "pdf",
    sizeMb: 4.2,
    totalPages: 218,
    lastPage: 47,
    pinned: true,
    dateAdded: "2026-07-28T10:00:00Z",
    lastOpenedAt: "2026-08-12T18:12:00Z",
    readSeconds: 14520,
    tags: ["Novel"],
    cover: "linear-gradient(150deg, oklch(0.55 0.2 275), oklch(0.42 0.15 240))",
    excerpt: body("The green light"),
  },
  {
    id: "def456",
    title: "Quantum Mechanics — Lecture Notes",
    author: "Dr. R. Mehta",
    type: "pdf",
    sizeMb: 12.8,
    totalPages: 340,
    lastPage: 128,
    pinned: true,
    dateAdded: "2026-06-11T10:00:00Z",
    lastOpenedAt: "2026-08-12T09:40:00Z",
    readSeconds: 38400,
    tags: ["Physics", "Research"],
    cover: "linear-gradient(150deg, oklch(0.6 0.18 200), oklch(0.4 0.16 265))",
    excerpt: body("Wavefunction collapse"),
  },
  {
    id: "ghi789",
    title: "Design of Everyday Things",
    author: "Don Norman",
    type: "epub",
    sizeMb: 2.1,
    totalPages: 288,
    lastPage: 288,
    pinned: false,
    dateAdded: "2026-05-02T10:00:00Z",
    lastOpenedAt: "2026-08-11T21:05:00Z",
    readSeconds: 26100,
    tags: ["Work"],
    cover: "linear-gradient(150deg, oklch(0.68 0.17 40), oklch(0.5 0.18 350))",
    excerpt: body("Affordance"),
  },
  {
    id: "jkl012",
    title: "Q3 Product Strategy",
    author: "Internal",
    type: "docx",
    sizeMb: 0.8,
    totalPages: 24,
    lastPage: 6,
    pinned: false,
    dateAdded: "2026-08-01T10:00:00Z",
    lastOpenedAt: "2026-08-10T14:22:00Z",
    readSeconds: 2400,
    tags: ["Work"],
    cover: "linear-gradient(150deg, oklch(0.66 0.15 162), oklch(0.45 0.14 200))",
    excerpt: body("Positioning"),
  },
  {
    id: "mno345",
    title: "Attention Is All You Need",
    author: "Vaswani et al.",
    type: "pdf",
    sizeMb: 1.4,
    totalPages: 15,
    lastPage: 11,
    pinned: false,
    dateAdded: "2026-07-19T10:00:00Z",
    lastOpenedAt: "2026-08-09T23:31:00Z",
    readSeconds: 5400,
    tags: ["Research"],
    cover: "linear-gradient(150deg, oklch(0.6 0.21 300), oklch(0.42 0.2 275))",
    excerpt: body("Self-attention"),
  },
  {
    id: "pqr678",
    title: "Reading List 2026",
    author: "Aniketh",
    type: "txt",
    sizeMb: 0.02,
    totalPages: 3,
    lastPage: 1,
    pinned: false,
    dateAdded: "2026-01-04T10:00:00Z",
    lastOpenedAt: "2026-08-04T08:00:00Z",
    readSeconds: 420,
    tags: [],
    cover: "linear-gradient(150deg, oklch(0.62 0.12 250), oklch(0.4 0.1 285))",
    excerpt: body("A year of reading"),
  },
];

export const SEED_NOTES: Note[] = [
  {
    id: "n1",
    documentId: "abc123",
    page: 12,
    text: "Gatsby represents the **American Dream** gone wrong",
    createdAt: "2026-08-12T18:30:00Z",
  },
  {
    id: "n2",
    documentId: "abc123",
    page: 18,
    text: "The green light = *hope* and the unattainable past",
    createdAt: "2026-08-12T18:45:00Z",
  },
  {
    id: "n3",
    documentId: "abc123",
    page: 24,
    text: "Daisy's voice is full of money — Fitzgerald's symbolism",
    createdAt: "2026-08-12T19:01:00Z",
  },
  {
    id: "n4",
    documentId: "abc123",
    page: 5,
    text: "Nick is an **unreliable narrator** — subtle hints throughout",
    createdAt: "2026-08-10T15:10:00Z",
  },
  {
    id: "n5",
    documentId: "def456",
    page: 96,
    text: "Operators must be *Hermitian* for real eigenvalues",
    createdAt: "2026-08-12T09:55:00Z",
  },
  {
    id: "n6",
    documentId: "def456",
    page: 128,
    text: "Revisit the derivation on this page before the exam",
    createdAt: "2026-08-12T10:20:00Z",
  },
  {
    id: "n7",
    documentId: "mno345",
    page: 4,
    text: "Scaled dot-product attention — the 1/sqrt(dk) term prevents tiny gradients",
    createdAt: "2026-08-09T23:10:00Z",
  },
];

export const SEED_BOOKMARKS: Bookmark[] = [
  { id: "b1", documentId: "abc123", page: 47, label: "Chapter 4 — the party", createdAt: "2026-08-12T18:05:00Z" },
  { id: "b2", documentId: "def456", page: 128, label: "Perturbation theory", createdAt: "2026-08-12T09:44:00Z" },
  { id: "b3", documentId: "mno345", page: 6, label: "Multi-head diagram", createdAt: "2026-08-09T23:20:00Z" },
];

export const SEED_HIGHLIGHTS: Highlight[] = [
  { id: "h1", documentId: "abc123", page: 24, text: "Her voice is full of money.", color: "yellow" },
  { id: "h2", documentId: "def456", page: 101, text: "Measurement is not a passive act.", color: "green" },
  { id: "h3", documentId: "mno345", page: 3, text: "Attention weights are learned, not designed.", color: "blue" },
];

/** Last 12 weeks of reading minutes, keyed by day offset from today (0 = today). */
export const ACTIVITY: number[] = (() => {
  const out: number[] = [];
  for (let i = 0; i < 84; i++) {
    const wobble = (Math.sin(i * 1.7) + 1) / 2;
    const weekend = i % 7 === 0 || i % 7 === 6;
    const v = Math.round(wobble * (weekend ? 40 : 95));
    out.push(i > 80 ? 0 : v);
  }
  out[0] = 42;
  return out;
})();

export const DAILY_GOAL_MINUTES = 45;
