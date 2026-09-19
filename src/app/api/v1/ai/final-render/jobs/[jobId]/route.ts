import { NextResponse } from "next/server";
import { ProviderFactory } from "@/providers/ai/provider-factory";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await params;
    const provider = ProviderFactory.getProvider("google");
    const status = await provider.getStatus(jobId);

    return NextResponse.json(status);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to retrieve job status." },
      { status: 500 }
    );
  }
}
