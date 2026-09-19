import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;
    // Returns any project final renders stored
    return NextResponse.json({
      projectId,
      finalRenders: [],
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch project final renders." },
      { status: 500 }
    );
  }
}
