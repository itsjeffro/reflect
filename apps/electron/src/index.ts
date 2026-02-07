import { app, BrowserWindow, ipcMain, net, protocol } from 'electron';
import Store from 'electron-store';
import path from 'path';
import { pathToFileURL } from 'url';

const isDev = process.env.VITE_SERVER;
const DIST_DIR = isDev ? path.join(process.resourcesPath, 'dist') : path.join(__dirname, '../../../frontend/dist');

type StoreSchema = {
  token: string | null;
};

const store = new Store<StoreSchema>();

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;
const CUSTOM_PROTOCOL = 'vite'; 

const createWindow = () => {
  const preload = path.join(
    app.getAppPath(),
    '.webpack/renderer/main_window/preload.js'
  );

  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload,
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
    },
  });

  if (isDev) {
    mainWindow.loadURL("http://localhost:5174");

    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadURL(`${CUSTOM_PROTOCOL}://index.html`);
  }

};

const setupIpcHandlers = () => {
  ipcMain.handle('store:get', (_event, key: string) => {
    return store.get(key);
  });

  ipcMain.handle('store:set', (_event, key: string, value: unknown) => {
    store.set(key, value);
  });
}

const handleCustomProtocol = () => {
  protocol.handle(CUSTOM_PROTOCOL, (request) => {
    const requestUrl = new URL(request.url);
    const { pathname } = requestUrl;

    let filePath = pathname.replace(/\/+$/, '');
    
    if (pathname === '/') {
      filePath = 'index.html'
    } else if (path.extname(filePath)) {
      filePath = filePath.replace('index.html/', '')
    }

    let fullPath = path.join(DIST_DIR, filePath);

    fullPath = pathToFileURL(fullPath).toString();

    console.log('protocol handle', {pathname, fullPath, filePath });

    return net.fetch(fullPath);
  })
}

protocol.registerSchemesAsPrivileged([
  {
    scheme: CUSTOM_PROTOCOL,
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      corsEnabled: true,
    },
  },
]);

app.whenReady().then(() => {
  if (!isDev) {
    handleCustomProtocol();
  }

  setupIpcHandlers();

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
