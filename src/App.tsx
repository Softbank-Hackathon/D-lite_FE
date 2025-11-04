import { Outlet } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';
import { ProjectProvider } from './contexts/ProjectContext';

function App() {
  return (
    <AuthProvider>
      <ProjectProvider>
        <Outlet />
      </ProjectProvider>
    </AuthProvider>
  );
}

export default App;
