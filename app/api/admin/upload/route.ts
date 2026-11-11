import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { isAuthenticated } from "@/lib/auth";

const MAX_SIZE = 8 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/avif"];

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }
    if (!ALLOWED.includes(file.type)) {
      return NextResponse.json(
        { error: "Use a JPEG, PNG, WebP or AVIF image." },
        { status: 400 }
      );
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Images must be under 8MB." },
        { status: 400 }
      );
    }

    const safeName = `${Date.now()}-${file.name
      .replace(/[^a-zA-Z0-9._-]/g, "")
      .toLowerCase()}`;
    const dir = path.join(process.cwd(), "public", "uploads");
    await mkdir(dir, { recursive: true });
    await writeFile(
      path.join(dir, safeName),
      Buffer.from(await file.arrayBuffer())
    );

    return NextResponse.json({ url: `/uploads/${safeName}` });
  } catch (error) {
    console.error("Admin upload failed:", error);
    return NextResponse.json({ error: "Upload failed." }, { status: 500 });
  }
}
