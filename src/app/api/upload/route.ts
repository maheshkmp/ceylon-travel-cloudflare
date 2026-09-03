import { NextResponse } from "next/server";
import { checkAdmin } from "@/actions/utils";
import { s3Client } from "@/lib/r2";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    // 1. Verify Authentication & Role
    await checkAdmin();

    // 2. Parse FormData
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 3. Prepare File Details
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Generate unique name: timestamp-randomId-safeName
    const randomId = Math.random().toString(36).substring(2, 8);
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const key = `${Date.now()}-${randomId}-${sanitizedName}`;

    // 4. Upload to Cloudflare R2 via standard S3 PutObjectCommand
    const command = new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    });

    await s3Client.send(command);

    // 5. Construct public asset URL
    const publicUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${key}`;

    return NextResponse.json({ url: publicUrl });
  } catch (error: any) {
    console.error("Upload API Error:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong during upload" },
      { status: 500 }
    );
  }
}
