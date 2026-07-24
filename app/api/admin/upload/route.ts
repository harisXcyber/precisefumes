import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { adminConfigured, createAdminClient } from "@/lib/supabase/admin";

const BUCKET = "product-images";

export async function POST(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!adminConfigured()) {
    return NextResponse.json(
      { error: "Storage is not configured." },
      { status: 503 }
    );
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json(
      { error: "Image must be under 10 MB." },
      { status: 400 }
    );
  }

  const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase();
  const safeSlug = String(form.get("slug") ?? "product")
    .replace(/[^a-z0-9-]/gi, "-")
    .toLowerCase();
  const path = `${safeSlug}/${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}.${ext}`;

  const supabase = createAdminClient();
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) {
    console.error("Upload failed:", error.message);
    return NextResponse.json({ error: "Upload failed." }, { status: 500 });
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl });
}
