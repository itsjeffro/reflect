import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "@radix-ui/themes/styles.css";
import { Theme } from '@radix-ui/themes';
import { createBrowserRouter, RouterProvider } from 'react-router';

import App from './pages/App.tsx'
import Login from './pages/Login.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Global } from '@emotion/react';
import { globalStyles } from './styles.ts';

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
  },
  {
    path: '/login',
    Component: Login,
  }
]);

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Global styles={globalStyles} />
    <QueryClientProvider client={queryClient}>
      <Theme>
        <RouterProvider router={router} />
      </Theme>
    </QueryClientProvider>
  </StrictMode>,
)
