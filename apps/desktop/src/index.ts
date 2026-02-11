import { app, BrowserWindow, net, ipcMain, protocol } from 'electron';
import { SecureStore } from './services/store';
import { pathToFileURL } from 'url';
import path from 'path';

declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

const isDev = process.env.VITE_SERVER;
const CUSTOM_PROTOCOL = 'vite'; 

const getAppPath = () => {
  if (app.isPackaged) {
    return path.join(app.getAppPath(), 'renderer');
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
  protocol.handle(CUSTOM_PROTOCOL, (request) => {
    const requestUrl = new URL(request.url);
    const { pathname } = requestUrl;

    let filePath = pathname.replace(/\/+$/, '');
    
    if (pathname === '/') {
      filePath = 'index.html'
    } else if (path.extname(filePath)) {
      filePath = filePath.replace('index.html/', '')
    }

    let fullPath = path.join(getAppPath(), filePath);

    fullPath = pathToFileURL(fullPath).toString();

    console.log('protocol handle', {pathname, fullPath, filePath });

    return net.fetch(fullPath);
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

  // mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  if (isDev) {
    mainWindow.loadURL("http://localhost:5174");
  } else {
    mainWindow.loadURL(`${CUSTOM_PROTOCOL}://index.html`);
  }

  mainWindow.webContents.openDevTools();
};

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
