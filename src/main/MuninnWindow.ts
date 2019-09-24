import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron';

export default class MuninnWindow extends BrowserWindow {
  constructor(options: BrowserWindowConstructorOptions = {}) {
    super({
      ...options,
      darkTheme: true,
      webPreferences: {
        enableRemoteModule: true,
        nodeIntegration: true,
      },
    });
    if (process.env.NODE_ENV !== 'production') {
      this.webContents.openDevTools();
    }
    this.removeMenu();
    this.loadFile('dist/index.html');
  }
}
