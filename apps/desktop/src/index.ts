import { app, BrowserWindow, ipcMain, protocol } from 'electron';
import { SecureStore } from './services/store';
import path from 'path';
import { createLogger, transports } from 'winston';
import fs from 'fs';
import { getMimeType } from './utils/mime.utils';

declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

const isDev = process.env.VITE_SERVER;

const customProtocol = 'vite'; 

const logFile = path.join(app.getPath('userData'), 'main.log');

const logger = createLogger({
  level: 'info',
  transports: [
    new transports.File({ filename: logFile }),
  ],
});

const getAppPath = () => {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, 'renderer');
  }

  if (isDev) {
    return path.join(process.resourcesPath, 'dist');
  }

  return path.join(__dirname, '../../../frontend/dist');
}

if (require('electron-squirrel-startup')) {
  app.quit();
}

const handleCustomProtocol = () => {
  protocol.handle(customProtocol, async (request) => {
    try {
      const url = new URL(request.url);
      const filePath = url.pathname.replace(/^\/+/, '') || 'index.html';
      const fullPath = path.join(getAppPath(), filePath);

      logger.info('protocol handle', {filePath, fullPath, url });

      // return net.fetch(fullPath);
      const data = await fs.promises.readFile(fullPath);

      return new Response(data, {
        status: 200,
        headers: { 'content-type': getMimeType(fullPath) },
      })
    } catch (err) {
      return new Response('File not found', {
        status: 404,
        headers: { 'Content-Type': 'text/plain' },
      });
    }
  })
}

const createWindow = (): void => {
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  if (isDev) {
    mainWindow.loadURL("http://localhost:5174");
  } else {
    mainWindow.loadURL(`${customProtocol}://index.html`);
  }

  mainWindow.webContents.openDevTools();
};

protocol.registerSchemesAsPrivileged([
  {
    scheme: customProtocol,
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      corsEnabled: true,
    },
  },
]);

app.on('ready', () => {
  const store = new SecureStore();

  ipcMain.on('store:set', (event, key, value) => {
    store.set(key, value);
  });

  ipcMain.handle('store:get', async (event, key) => {
    return store.get(key);
  });

  handleCustomProtocol();

  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
