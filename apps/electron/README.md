# Electron (Reflect)

## Getting started

```bash
pnpm install
```

### Running with Vite server

A Vite server will be started during the Forge preStart hook for Electron to wrap.

```bash
pnpm dev
```

### Running a bundled Vite dist

Runs the Electron app using a recent Vite build.

```bash
pnpm start
```

## Building

[See docs](https://www.electronforge.io/#building-distributables)

## Issues when working on project

### VM4 sandbox_bundle:2 Unable to load preload script

> VM4 sandbox_bundle:2 Unable to load preload script: /main_window/preload.js
> VM4 sandbox_bundle:2 VM4 sandbox_bundle:2 ReferenceError: __dirname is not defined

Issue: 

* Issues with `__dirname` and loading `preload.js` (event though the file existed). Due to `@vercel/webpack-asset-relocator-loader` in `webpack.rules.ts` file.

Workaround:

* Comment out default loader included with Electron Forge webpack-typescript template. This way we can have `sandbox: true` in our `index.ts` file for standard security.