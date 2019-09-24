import { app } from 'electron';
import loadDevTool from 'electron-load-devtool';
import MuninnWindow from './MuninnWindow';

app.on('ready', () => {
  new MuninnWindow();
  loadDevTool(loadDevTool.VUEJS_DEVTOOLS);
});
