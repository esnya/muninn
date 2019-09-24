export default class Recorder {
  static async create(): Promise<Recorder> {
    const stream = await navigator.mediaDevices.getDisplayMedia();
    return new Recorder(stream);
  }

  private constructor(stream: MediaStream) {
    this.stream = stream;
  }

  readonly stream: MediaStream;
}
