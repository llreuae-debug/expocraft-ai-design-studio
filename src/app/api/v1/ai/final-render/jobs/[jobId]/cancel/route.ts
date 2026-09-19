import { NextResponse } from "next/server";
import { ProviderFactory } from "@/providers/ai/provider-factory";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await params;
    const provider = ProviderFactory.getProvider("google");
    const cancelled = await provider.cancel(jobId);

    return NextResponse.json({
      success: cancelled,
      message: cancelled ? "Render job cancelled." : "Job could not be cancelled or already finished.",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to cancel render job." },
      { status: 500 }
    );
  }
}
