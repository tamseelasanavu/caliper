import { promises as fs } from "fs";
import path from "path";

export const DATA_DIR = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(process.cwd(), "data");

let queue: Promise<unknown> = Promise.resolve();

export function runExclusive<T>(task: () => Promise<T>): Promise<T> {
  const next = queue.then(task, task);
  queue = next.catch(() => undefined);
  return next;
}

export async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, file), "utf8");
    return JSON.parse(raw) as T;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return fallback;
    throw error;
  }
}

export async function writeJson(file: string, value: unknown): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const target = path.join(DATA_DIR, file);
  const temp = `${target}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(temp, `${JSON.stringify(value, null, 2)}\n`, "utf8");

  try {
    await fs.rename(temp, target);
  } catch {
    await fs.writeFile(target, `${JSON.stringify(value, null, 2)}\n`, "utf8");
    await fs.rm(temp, { force: true });
  }
}

export function withDataDir(file: string): string {
  return path.join(DATA_DIR, file);
}
