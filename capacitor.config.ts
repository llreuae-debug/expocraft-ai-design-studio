import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "io.expocraft.app",
  appName: "ExpoCraft AI",
  webDir: "out",
  server: {
    url: "https://expocraft-ai-design-studio.vercel.app",
    cleartext: true,
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true,
  },
  ios: {
    contentInset: "always",
    preferredContentMode: "mobile",
    allowsLinkPreview: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#020617",
      showSpinner: true,
      spinnerColor: "#06b6d4",
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#020617",
    },
  },
};

export default config;
