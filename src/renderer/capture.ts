import { desktopCapturer, DesktopCapturerSource } from "electron";

export async function getSources(): Promise<DesktopCapturerSource[]> {
  return await desktopCapturer.getSources({
    types: ['window'],
  }) as any;
}
