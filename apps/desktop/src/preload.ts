import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld('store', {
  set: (key: string, value: string) => {
    ipcRenderer.send('store:set', key, value);
  },
  get: (key: string) => {
    return ipcRenderer.invoke('store:get', key);
  }
});
