import { FinalRenderProvider } from "./image-generation.provider";
import { GoogleImageProvider } from "./google-image.provider";

export class ProviderFactory {
  private static googleProviderInstance: GoogleImageProvider | null = null;

  public static getProvider(providerType: "google" | "default" = "google"): FinalRenderProvider {
    if (!this.googleProviderInstance) {
      this.googleProviderInstance = new GoogleImageProvider();
    }
    return this.googleProviderInstance;
  }
}
