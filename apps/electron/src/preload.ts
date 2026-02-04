import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('store', {
  get: (key: string) => {
    return ipcRenderer.invoke('store:get', key);
  },
  set: (key: string, value: unknown) => {
    return ipcRenderer.invoke('store:set', key, value);
  }
});
