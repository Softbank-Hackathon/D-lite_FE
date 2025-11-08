import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import './index.css';
import { router } from './router';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';

// Import AOS
import AOS from 'aos';
import 'aos/dist/aos.css';

// MSW (Mock Service Worker) setup
async function enableMocking() {
  // MSW는 개발 환경에서만, 그리고 VITE_USE_MSW=true일 때만 활성화
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  // 환경 변수에서 MSW 활성화 여부 확인
  const useMSW = import.meta.env.VITE_USE_MSW === 'true';
  
  if (!useMSW) {
    console.log('[MSW] Mock Service Worker is disabled by VITE_USE_MSW environment variable');
    return;
  }

  const { worker } = await import('./mocks/browser');

  // `worker.start()` returns a Promise that resolves
  // once the Service Worker is up and running.
  console.log('[MSW] Mock Service Worker is starting...');
  return worker.start();
}

// Initialize AOS
AOS.init({
  duration: 1000, // Animation duration in milliseconds
  once: false,    // Whether animation should happen only once - while scrolling down and up
});

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </React.StrictMode>
  );
});