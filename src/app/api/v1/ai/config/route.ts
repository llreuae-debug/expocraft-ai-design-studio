import { NextResponse } from "next/server";
import { ProviderFactory } from "@/providers/ai/provider-factory";

export async function GET() {
  const provider = ProviderFactory.getProvider("google");
  const isConfigured = await provider.isConfigured();
  const rawKey = process.env.GOOGLE_API_KEY || (global as any).__GOOGLE_API_KEY_OVERRIDE || "";

  let maskedKey = "";
  if (rawKey.length > 8) {
    maskedKey = `AIzaSy••••••••••••${rawKey.substring(rawKey.length - 4)}`;
  } else if (rawKey.length > 0) {
    maskedKey = "••••••••••••";
  }

  let status = isConfigured ? "CONNECTED" : "NOT_CONNECTED";

  return NextResponse.json({
    connected: isConfigured,
    status,
    providerName: provider.providerName,
    model: "Google Imagen 3 (imagen-3.0-generate-002) + Gemini 2.0 Flash Vision",
    maskedKey,
    hasServerKey: Boolean(process.env.GOOGLE_API_KEY),
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { apiKey } = body;

    if (typeof apiKey === "string") {
      (global as any).__GOOGLE_API_KEY_OVERRIDE = apiKey.trim();
    }

    const provider = ProviderFactory.getProvider("google");
    const testResult = await provider.testConnection();

    return NextResponse.json({
      success: testResult.success,
      status: testResult.success ? "CONNECTED" : "INVALID_KEY",
      message: testResult.message,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to update API key." },
      { status: 500 }
    );
  }
}
