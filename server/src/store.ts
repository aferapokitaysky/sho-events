import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, "../data");
const DATA_FILE = path.join(DATA_DIR, "submissions.json");

export interface Submission {
  id: string;
  type: "partners" | "contact";
  receivedAt: string;
  data: Record<string, string>;
}

async function ensureFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, "[]", "utf-8");
  }
}

export async function appendSubmission(entry: Submission) {
  await ensureFile();
  const raw = await fs.readFile(DATA_FILE, "utf-8");
  const list: Submission[] = JSON.parse(raw || "[]");
  list.push(entry);
  await fs.writeFile(DATA_FILE, JSON.stringify(list, null, 2), "utf-8");
}

export async function listSubmissions(): Promise<Submission[]> {
  await ensureFile();
  const raw = await fs.readFile(DATA_FILE, "utf-8");
  return JSON.parse(raw || "[]");
}
