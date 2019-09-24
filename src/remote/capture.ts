import * as win from 'windows-interact';

export default async function capture(filename: string): Promise<void> {
  await win.screenshot('full', filename);
}
