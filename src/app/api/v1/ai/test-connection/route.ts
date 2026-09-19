import { NextResponse } from "next/server";
import { ProviderFactory } from "@/providers/ai/provider-factory";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { apiKey } = body;

    // Temporarily test key if provided
    if (apiKey && typeof apiKey === "string" && apiKey.trim().length > 0) {
      (global as any).__GOOGLE_API_KEY_OVERRIDE = apiKey.trim();
    }

    const provider = ProviderFactory.getProvider("google");
    const testResult = await provider.testConnection();

    return NextResponse.json({
      connected: testResult.success,
      status: testResult.success ? "CONNECTED" : (testResult.message.includes("Quota") ? "QUOTA_ERROR" : (testResult.message.includes("Invalid") ? "INVALID_KEY" : "CONNECTION_FAILED")),
      message: testResult.message,
      details: testResult.details,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        connected: false,
        status: "CONNECTION_FAILED",
        message: err.message || "Failed to execute connection test.",
      },
      { status: 500 }
    );
  }
}
