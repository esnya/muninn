import { remote } from "electron";
import EventEmitter from 'eventemitter3';

import * as NodeFS from 'fs';
import { diffLines } from "diff";
const fs = remote.require('fs') as typeof NodeFS;
const detect = remote.require('./remote/detect').default as (filename: string) => Promise<string>;

export default class TextRecognizer extends EventEmitter {
  private async saveImage(blob: Blob): Promise<void> {
    const png: ArrayBuffer = await new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = () => resolve(fileReader.result as ArrayBuffer);
      fileReader.onerror = () => reject(fileReader.error);
      fileReader.readAsArrayBuffer(blob);
    });
    await fs.promises.writeFile('data/image.png', Buffer.from(png));
  }

  private prevResult?: string;
  private async recognize(): Promise<void> {
    const result = await detect('data/image.png');

    const diff = diffLines(this.prevResult || '', result);
    console.log(diff);
    this.prevResult = result;

    diff.filter(d => d.added).map(d => d.value.replace(/\n$/, '').split(/\n+/g).filter(a => a !== '')).reduce((p, c) => p.concat(c), []).reverse().forEach((line) => {
      this.emit('add', line);
    });
  }

  private busy: boolean = false;
  private queue: Blob | null = null;
  public async putImage(blob: Blob): Promise<void> {
    if (this.busy) {
      this.queue = blob;
      return;
    }
    this.busy = true;

    try {
      await this.saveImage(blob);
      await this.recognize();
    } finally {
      this.busy = false;
      if (this.queue) {
        this.putImage(this.queue);
        this.queue = null;
      }
    }
  }
}
