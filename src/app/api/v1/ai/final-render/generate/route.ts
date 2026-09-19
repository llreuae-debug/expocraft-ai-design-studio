import { NextResponse } from "next/server";
import { ProviderFactory } from "@/providers/ai/provider-factory";
import { FinalRenderInput } from "@/providers/ai/image-generation.provider";

export async function POST(req: Request) {
  try {
    const input: FinalRenderInput = await req.json();

    if (!input || !input.project) {
      return NextResponse.json(
        { error: "Invalid payload: Project details are required for final architectural render." },
        { status: 400 }
      );
    }

    const provider = ProviderFactory.getProvider("google");
    const job = await provider.generate(input);

    return NextResponse.json({
      success: true,
      jobId: job.jobId,
      status: job.status,
      currentStep: job.currentStep,
      progressPercent: job.progressPercent,
      message: "8K Architectural Presentation Render job initialized.",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to initialize render job." },
      { status: 500 }
    );
  }
}
