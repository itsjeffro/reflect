import { app, safeStorage } from 'electron';
import fs from 'fs';
import path from 'path';

export class SecureStore<T extends Record<string, unknown>> {
  private filePath: string;
  private data: T;

  public constructor(
    filename = 'secure-store.json',
    defaults: Partial<T> = {} as Partial<T>
  ) {
    this.filePath = path.join(app.getPath('userData'), filename);
    this.data = {} as T;

    if (fs.existsSync(this.filePath)) {
      try {
        const fileData = fs.readFileSync(this.filePath);
        this.data = this.decrypt(fileData);
      } catch (err) {
        console.warn('Failed to decrypt store, using defaults:', err);
        this.data = { ...defaults } as T;
      }
    } else {
      this.data = { ...defaults } as T;
      this.save();
    }
  }

  public get<K extends keyof T>(key: K): T[K] | undefined {
    return this.data[key];
  }

  public set<K extends keyof T>(key: K, value: T[K]): void {
    this.data[key] = value;
    this.save();
  }

  public delete<K extends keyof T>(key: K): void {
    delete this.data[key];
    this.save();
  }

  private save(): void {
    const stringData = JSON.stringify(this.data);

    let buffer: Buffer;
    if (safeStorage.isEncryptionAvailable()) {
      buffer = safeStorage.encryptString(stringData);
    } else {
      console.warn('safeStorage not available, storing in plaintext.');
      buffer = Buffer.from(stringData, 'utf-8');
    }

    fs.writeFileSync(this.filePath, buffer);
  }

  private decrypt(buffer: Buffer): T {
    let decrypted: string;

    if (safeStorage.isEncryptionAvailable()) {
      decrypted = safeStorage.decryptString(buffer);
    } else {
      decrypted = buffer.toString('utf-8');
    }

    return JSON.parse(decrypted) as T;
  }
}
