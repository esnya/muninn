interface MediaDevices {
  getDisplayMedia(options?: Record<string, any>): Promise<MediaStream>;
}
