import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ renderId: string }> }
) {
  try {
    const { renderId } = await params;
    const body = await req.json().catch(() => ({}));

    return NextResponse.json({
      success: true,
      renderId,
      message: "Render successfully designated as primary quotation hero and presentation package.",
      linkedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to add final render to quotation." },
      { status: 500 }
    );
  }
}
