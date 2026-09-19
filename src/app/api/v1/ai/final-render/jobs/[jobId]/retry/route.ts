import { NextResponse } from "next/server";
import { ProviderFactory } from "@/providers/ai/provider-factory";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await params;
    const provider = ProviderFactory.getProvider("google");
    const retriedJob = await provider.retry(jobId);

    return NextResponse.json({
      success: true,
      job: retriedJob,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to retry render job." },
      { status: 500 }
    );
  }
}
