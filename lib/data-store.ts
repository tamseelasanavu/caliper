import { promises as fs } from "fs";
import path from "path";
import { BlobNotFoundError, head, put } from "@vercel/blob";

export const DATA_DIR = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(process.cwd(), "data");

const BLOB_PREFIX = "data";

export const BLOB_ENABLED = Boolean(
  process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID
);

let queue: Promise<unknown> = Promise.resolve();

export function runExclusive<T>(task: () => Promise<T>): Promise<T> {
  const next = queue.then(task, task);
  queue = next.catch(() => undefined);
  return next;
}

function isMissingBlob(error: unknown): boolean {
  return (
    error instanceof BlobNotFoundError ||
    (typeof error === "object" &&
      error !== null &&
      "status" in error &&
      (error as { status?: number }).status === 404)
  );
}

async function readLocal(file: string): Promise<string | undefined> {
  try {
    return await fs.readFile(path.join(DATA_DIR, file), "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return undefined;
    throw error;
  }
}

async function readBlob(file: string): Promise<string | undefined> {
  try {
    const info = await head(`${BLOB_PREFIX}/${file}`);
    const res = await fetch(`${info.url}?v=${Date.now()}`, {
      cache: "no-store",
    });
    return res.ok ? await res.text() : undefined;
  } catch (error) {
    if (isMissingBlob(error)) return undefined;
    throw error;
  }
}

export async function readJson<T>(file: string, fallback: T): Promise<T> {
  const raw = (BLOB_ENABLED ? await readBlob(file) : undefined) ?? (await readLocal(file));
  if (raw === undefined) return fallback;
  return JSON.parse(raw) as T;
}

export async function writeJson(file: string, value: unknown): Promise<void> {
  const body = `${JSON.stringify(value, null, 2)}\n`;

  if (BLOB_ENABLED) {
    await put(`${BLOB_PREFIX}/${file}`, body, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
      cacheControlMaxAge: 60,
    });
    return;
  }

  await fs.mkdir(DATA_DIR, { recursive: true });
  const target = path.join(DATA_DIR, file);
  const temp = `${target}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(temp, body, "utf8");

  try {
    await fs.rename(temp, target);
  } catch {
    await fs.writeFile(target, body, "utf8");
    await fs.rm(temp, { force: true });
  }
}

export function withDataDir(file: string): string {
  return path.join(DATA_DIR, file);
}
