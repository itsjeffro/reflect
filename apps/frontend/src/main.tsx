import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "@radix-ui/themes/styles.css";
import { Theme } from '@radix-ui/themes';
import { createBrowserRouter, createHashRouter, RouterProvider } from 'react-router';

import App from './pages/App.tsx'
import Login from './pages/Login.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Global } from '@emotion/react';
import { globalStyles } from './styles.ts';
import { Layout } from './Layout.tsx';
import { AuthProvider } from './common/context/auth/AuthProvider.tsx';
import { List } from './pages/List.tsx';

const routes = [
  {
    path: "/",
    Component: Layout,
    children: [
      { path: '/', Component: App },
      { path: '/List', Component: List },
    ]
  },
  {
    path: '/login',
    Component: Login,
  }
];

const router = window?.store ? createHashRouter(routes) : createBrowserRouter(routes);

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Global styles={globalStyles} />
    <QueryClientProvider client={queryClient}>
      <Theme>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </Theme>
    </QueryClientProvider>
  </StrictMode>,
)
