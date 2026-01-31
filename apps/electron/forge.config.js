const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');
const { spawn } = require('child_process');
const path = require('path');

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
        const viteProjectDir = path.resolve(__dirname, '../frontend');

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
    }
  }
};
