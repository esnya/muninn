import { exec } from 'child_process';
import { promises as fs } from 'fs'; 

const command = 'tesseract-ocr\\tesseract.exe';

export default async function detect(src: string): Promise<string> {
  return await new Promise((resolve, reject) => {
    const tesseract = exec([
      command,
      '-l', 'jpn',
      '--psm', '6',
      src,
      'data/ocr',
    ].join(' '));

    if (tesseract.stdout) tesseract.stdout.pipe(process.stdout);
    if (tesseract.stderr) tesseract.stderr.pipe(process.stderr);

    tesseract.on('exit', async (code: number) => {
      if (code) reject(code);
      else {
        const ocr = await fs.readFile('data/ocr.txt');
        resolve(ocr.toString());
      }
    });
  });
}
