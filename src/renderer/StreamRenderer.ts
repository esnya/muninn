import * as NodeCrypto from 'crypto';
import { remote } from 'electron';
import EventEmitter from 'eventemitter3';
import BoundingBox from "../types/BoundingBox";

const crypto = remote.require('crypto') as typeof NodeCrypto;

export default class StreamRenderer extends EventEmitter {
  private _dirty: boolean = true;
  private _video: HTMLVideoElement = document.createElement('video');

  private _canvas: HTMLCanvasElement = document.createElement('canvas');
  public get canvas(): HTMLCanvasElement {
    return this._canvas;
  }

  private _stream: MediaStream | null = null;
  public get stream(): MediaStream | null {
    return this._stream;
  }
  public set stream(stream: MediaStream | null) {
    this._stream = stream;
    this._video.srcObject = stream;
    this._video.play();
    this._dirty = true;
  }

  private _cropping: BoundingBox = {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  };
  public get cropping(): BoundingBox {
    return this._cropping;
  }
  public set cropping(cropping: BoundingBox) {
    this._dirty = true;
    this._cropping = cropping;
  }

  private _context: CanvasRenderingContext2D;
  private _interval: ReturnType<typeof setInterval>
  constructor() {
    super();

    const context = this._canvas.getContext('2d');
    if (!context) throw new Error('Failed to get rendering context');
    this._context = context;

    this._video.addEventListener('timeupdate', () => this._dirty = true);
    this._interval = setInterval(() => this.onUpdate(), 1000 / 30);
  }

  private render(): string | null {
    if (!this._stream) return null;

    const {
      top,
      left,
      bottom,
      right,
    } = this._cropping;
    const width = right - left;
    const height = bottom - top;

    this._canvas.width = width;
    this._canvas.height = height;

    this._context.drawImage(this._video, left, top, width, height, 0, 0, width, height);
    
    const imageData = this._context.getImageData(0, 0, width, height);
    return crypto.createHash('sha1').update(imageData.data).digest('hex');
  }

  private async getBlob(): Promise<Blob> {
    return await new Promise((resolve, reject) => {
      this._canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject();
      }, 'image/png');
    });
  }

  private _prevDigest: string | null = null;
  private async onUpdate(): Promise<void> {
    if (!this._dirty) return;

    try {
      const digest = this.render();
      if (digest && digest !== this._prevDigest) {
        this._prevDigest = digest;
        this.emit('update', await this.getBlob());
      }
    } finally {
      this._dirty = false;
    }
  }

  public destroy() {
    if (this._interval) clearInterval(this._interval);
  }
}
