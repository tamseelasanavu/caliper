import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "cc_admin";
const SESSION_MS = 1000 * 60 * 60 * 24 * 7;

function adminPassword(): string {
  return (
    process.env.ADMIN_PASSWORD ||
    (process.env.NODE_ENV !== "production" ? "calliper-admin" : "")
  );
}

export function isAdminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD) || process.env.NODE_ENV !== "production";
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

export function passwordMatches(input: string): boolean {
  return safeEqual(input, adminPassword());
}

export function usesDefaultPassword(): boolean {
  return !process.env.ADMIN_PASSWORD && process.env.NODE_ENV !== "production";
}

export async function isAuthenticated(): Promise<boolean> {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return false;

  const [version, expires, signature] = token.split(".");
  if (version !== "v1" || !expires || !signature) return false;
  if (!Number.isFinite(Number(expires)) || Number(expires) < Date.now()) {
    return false;
  }
  return safeEqual(signature, sign(`v1.${expires}`));
}

export async function createSession(): Promise<void> {
  const expires = Date.now() + SESSION_MS;
  const payload = `v1.${expires}`;
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
