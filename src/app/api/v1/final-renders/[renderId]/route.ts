import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ renderId: string }> }
) {
  try {
    const { renderId } = await params;
    return NextResponse.json({
      id: renderId,
      status: "COMPLETED",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to retrieve final render." },
      { status: 500 }
    );
  }
}
