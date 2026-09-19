import { FinalRenderInput, FinalRenderJob, FinalRenderStatus } from "./image-generation.provider";
import { GoogleImageProvider } from "./google-image.provider";

export class FinalRenderOrchestrator {
  private provider: GoogleImageProvider;

  constructor() {
    this.provider = new GoogleImageProvider();
  }

  public async getProviderStatus() {
    const isConfigured = await this.provider.isConfigured();
    const test = await this.provider.testConnection();
    return {
      isConfigured,
      connectionResult: test,
    };
  }

  public async triggerFinalRender(input: FinalRenderInput): Promise<FinalRenderJob> {
    return this.provider.generate(input);
  }

  public async getJobStatus(jobId: string): Promise<FinalRenderStatus> {
    return this.provider.getStatus(jobId);
  }

  public async cancelJob(jobId: string): Promise<boolean> {
    return this.provider.cancel(jobId);
  }

  public async retryJob(jobId: string): Promise<FinalRenderJob> {
    return this.provider.retry(jobId);
  }
}
