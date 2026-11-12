import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { readJson, runExclusive, writeJson } from "./data-store";

const COOKIE_NAME = "cc_admin";
const SESSION_MS = 1000 * 60 * 60 * 24 * 7;
const CREDENTIAL_FILE = "admin-auth.json";

type StoredCredential = {
  version: 1;
  salt: string;
  hash: string;
  updatedAt: string;
};

function adminPassword(): string {
  return (
    process.env.ADMIN_PASSWORD ||
    (process.env.NODE_ENV !== "production" ? "calliper-admin" : "")
  );
}

async function storedCredential(): Promise<StoredCredential | null> {
  const value = await readJson<Partial<StoredCredential> | null>(
    CREDENTIAL_FILE,
    null
  );
  if (
    !value ||
    typeof value.salt !== "string" ||
    typeof value.hash !== "string"
  ) {
    return null;
  }
  return {
    version: 1,
    salt: value.salt,
    hash: value.hash,
    updatedAt: typeof value.updatedAt === "string" ? value.updatedAt : "",
  };
}

function hashPassword(password: string, salt: string): string {
  return scryptSync(password, salt, 64).toString("base64url");
}

function signingSecret(): string {
  return process.env.ADMIN_SECRET || adminPassword();
}

function sign(payload: string): string {
  return createHmac("sha256", signingSecret()).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) {
    timingSafeEqual(right, right);
    return false;
  }
  return timingSafeEqual(left, right);
}

export async function isAdminConfigured(): Promise<boolean> {
  if (process.env.ADMIN_PASSWORD) return true;
  if (process.env.NODE_ENV !== "production") return true;
  return (await storedCredential()) !== null;
}

export async function passwordMatches(input: string): Promise<boolean> {
  const stored = await storedCredential();
  if (stored) {
    return safeEqual(hashPassword(input, stored.salt), stored.hash);
  }
  return safeEqual(input, adminPassword());
}

export async function usesDefaultPassword(): Promise<boolean> {
  if (process.env.ADMIN_PASSWORD) return false;
  if (await storedCredential()) return false;
  return process.env.NODE_ENV !== "production";
}

async function sessionRevision(): Promise<string> {
  const stored = await storedCredential();
  return stored ? `p:${stored.hash.slice(0, 24)}` : "env";
}

export async function updatePassword(newPassword: string): Promise<void> {
  const salt = randomBytes(16).toString("base64url");
  const credential: StoredCredential = {
    version: 1,
    salt,
    hash: hashPassword(newPassword, salt),
    updatedAt: new Date().toISOString(),
  };
  await runExclusive(() => writeJson(CREDENTIAL_FILE, credential));
}

export async function isAuthenticated(): Promise<boolean> {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return false;

  const [version, expires, revision, signature] = token.split(".");
  if (version !== "v2" || !expires || !revision || !signature) return false;
  if (!Number.isFinite(Number(expires)) || Number(expires) < Date.now()) {
    return false;
  }
  if (!safeEqual(revision, await sessionRevision())) return false;
  return safeEqual(signature, sign(`v2.${expires}.${revision}`));
}

export async function createSession(): Promise<void> {
  const expires = Date.now() + SESSION_MS;
  const revision = await sessionRevision();
  const payload = `v2.${expires}.${revision}`;
  const secure =
    process.env.ADMIN_COOKIE_SECURE !== undefined
      ? process.env.ADMIN_COOKIE_SECURE === "true"
      : process.env.NODE_ENV === "production";

  (await cookies()).set(COOKIE_NAME, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: Math.floor(SESSION_MS / 1000),
  });
}

export async function destroySession(): Promise<void> {
  (await cookies()).delete(COOKIE_NAME);
}

export async function requireAdmin(): Promise<void> {
  if (!(await isAuthenticated())) redirect("/admin/login");
}
