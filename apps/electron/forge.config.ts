import MakerDeb from "@electron-forge/maker-deb";
import MakerRpm from "@electron-forge/maker-rpm";
import MakerSquirrel from "@electron-forge/maker-squirrel";
import MakerZIP from "@electron-forge/maker-zip";
import AutoUnpackNativesPlugin from "@electron-forge/plugin-auto-unpack-natives";
import { FusesPlugin } from '@electron-forge/plugin-fuses';
import { FuseV1Options, FuseVersion } from '@electron/fuses';
import { WebpackPlugin } from '@electron-forge/plugin-webpack';
import path, { join } from 'path';
import { spawn, exec, ChildProcess } from 'child_process';
import { promisify } from 'util';
import { cp } from 'fs/promises';

const FRONTEND_PATH = '../frontend';
const execAsync = promisify(exec);

import { mainConfig } from './webpack.main.config';
import { rendererConfig } from './webpack.renderer.config';

module.exports = {
  packagerConfig: {
    asar: true,
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({}),
    new MakerZIP({}, ['darwin']),
    new MakerRpm({}),
    new MakerDeb({}),
  ],
  plugins: [
    new AutoUnpackNativesPlugin({}),
    new WebpackPlugin({
      mainConfig,
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            html: './src/index.html',
            js: './src/renderer.ts',
            name: 'main_window',
            preload: {
              js: './src/preload.ts',
            },
          },
        ],
      },
    }),
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
  hooks: {
    preStart: async () => {
      const isDev = process.env.VITE_SERVER;

      console.log(`[Vite] Starting up server on platform: ${process.platform}`);

      if (!isDev) {
        return;
      }

      let viteProcess: ChildProcess | null = null;

      const startServer = new Promise<void>((resolve, reject) => {
        const viteProjectDir = path.resolve(__dirname, FRONTEND_PATH);

        viteProcess = spawn('pnpm', ['dev', '--port 5174'], {
          cwd: viteProjectDir,
          shell: true,
          stdio: 'pipe',
          detached: process.platform === 'win32' ? false : true,
        });

        viteProcess.stdout?.on('data', (data) => {
          const output = data.toString().trim();

          if (output.includes('ready in') || output.includes('Local:')) {
            resolve();
          }
        });

        process.on('exit', () => viteProcess?.kill());

        setTimeout(() => {
          reject(new Error('[Vite] Starting up server has timed out!'));
        }, 30000);
      });

      await startServer;
    },
     generateAssets: async () => {
      const isDev = process.env.VITE_SERVER;

      if (isDev) {
        console.log(`Skipping generateAssets hook.`);

        return;
      }

      await execAsync('cd ../frontend && pnpm build');

      const src = path.resolve(__dirname, FRONTEND_PATH, 'dist');
      const dest = path.resolve(__dirname, 'renderer');

      await cp(src, dest, { recursive: true, force: true });
    }
  }
};
