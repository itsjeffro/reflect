const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');
const path = require('path');
const { spawn, exec } = require('child_process');
const { promisify } = require('util');
const { cp } = require('fs/promises');

const FRONTEND_PATH = '../frontend';
const execAsync = promisify(exec);

module.exports = {
  packagerConfig: {
    asar: true,
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {},
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
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
      const isDev = process.env.NODE_ENV === 'development';

      console.log(`[Vite] Starting up server on platform: ${process.platform}`);

      if (!isDev) {
        return;
      }

      let viteProcess = null;

      const startServer = new Promise((resolve, reject) => {
        const viteProjectDir = path.resolve(__dirname, FRONTEND_PATH);

        viteProcess = spawn('pnpm', ['dev'], {
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

        process.on('exit', () => viteProcess.kill());

        setTimeout(() => {
          reject(new Error('[Vite] Starting up server has timed out!'));
        }, 30000);
      });

      await startServer;
    },
     generateAssets: async () => {
      const isDev = process.env.NODE_ENV === 'development';

      if (isDev) {
        console.log(`Skipping generateAssets hook.`);

        return;
      }

      await execAsync('cd ../frontend && pnpm build');

      const src = path.join(__dirname, FRONTEND_PATH, 'dist');
      const dest = path.join(__dirname, 'renderer');

      await cp(src, dest, { recursive: true, force: true });
    }
  }
};
