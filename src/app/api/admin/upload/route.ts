import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Cloudflare R2 config (S3-compatible). Falls back to baked values so admin
// image uploads work even before env vars are set on the host.
// Baked fallbacks so uploads work zero-config on Vercel; override via env vars.
// SECURITY: this token has broad R2 access. Since it lives in the repo, keep the
// repo private and ideally replace it with a token scoped to only the
// nextstep-media bucket (Object Read & Write). Rotate if the repo goes public.
const ACCOUNT_ID = process.env.R2_ACCOUNT_ID || "82230c21dea4de5a6a881a61b72fd2bb";
const ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || "2152b8b603c95b4363d321f4cb860481";
const SECRET_ACCESS_KEY =
  process.env.R2_SECRET_ACCESS_KEY ||
  "030d85ffc5a3c1089fffbf0f782d59c887be88dc4f043e93baa373cee0febdb8";
const BUCKET = process.env.R2_BUCKET_NAME || "nextstep-media";
const PUBLIC_BASE_URL = (
  process.env.R2_PUBLIC_BASE_URL || "https://media.nextstepinternationals.com"
).replace(/\/+$/, "");

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
});

const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif", "image/svg+xml"];
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

function slugify(name: string): string {
  const dot = name.lastIndexOf(".");
  const base = (dot > 0 ? name.slice(0, dot) : name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || "image";
  const ext = dot > 0 ? name.slice(dot + 1).toLowerCase().replace(/[^a-z0-9]/g, "") : "jpg";
  return `${base}.${ext}`;
}

// POST /api/admin/upload — multipart form with `file`; uploads to R2, returns { url }.
export async function POST(req: NextRequest) {
  if (!ACCESS_KEY_ID || !SECRET_ACCESS_KEY) {
    return NextResponse.json(
      { error: "Image uploads are not configured (missing R2 credentials)." },
      { status: 503 }
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid upload request." }, { status: 400 });
  }

  const file = form.get("file");
  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json(
      { error: `Unsupported file type: ${file.type || "unknown"}. Use JPG, PNG, WebP, AVIF, GIF, or SVG.` },
      { status: 400 }
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File too large (max 10 MB)." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const key = `uploads/${Date.now()}-${slugify(file.name || "image")}`;

  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: buffer,
        ContentType: file.type,
        CacheControl: "public, max-age=31536000, immutable",
      })
    );
  } catch (error) {
    console.error("R2 upload error:", error);
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 502 });
  }

  return NextResponse.json({ url: `${PUBLIC_BASE_URL}/${key}` }, { status: 201 });
}
