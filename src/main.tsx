import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';
import { ProjectProvider } from './contexts/ProjectContext'; // ProjectProvider import 추가
import { router } from './router';

// Import AOS
import AOS from 'aos';
import 'aos/dist/aos.css';

// MSW (Mock Service Worker) setup
async function enableMocking() {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  const { worker } = await import('./mocks/browser');

  // `worker.start()` returns a Promise that resolves
  // once the Service Worker is up and running.
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
      <ProjectProvider> {/* ProjectProvider로 감싸기 */}
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </ProjectProvider>
    </React.StrictMode>
  );
});