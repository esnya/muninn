import { DesktopCapturerSource } from "electron";

export async function getStream(source: DesktopCapturerSource): Promise<MediaStream> {
  return await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: ({
      mandatory: {
        chromeMediaSource: 'desktop',
        chromeMediaSourceId: source.id,
      },
    }) as any,
  });
}
