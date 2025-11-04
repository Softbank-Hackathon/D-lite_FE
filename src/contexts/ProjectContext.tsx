import { createContext, useContext, useState, type ReactNode, useCallback } from 'react';

// --- Constants for project options ---
export const FRAMEWORK_OPTIONS = [
  'React',
  'Vue',
  'Angular',
  'Next.js',
  'SvelteKit',
];

export const PROJECT_TYPE_OPTIONS = {
  FRONTEND: 'Frontend Only',
  FULLSTACK: 'Frontend + Backend',
};

// --- Interfaces for project data ---
export interface Repository {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
}

export interface ProjectSettings {
  projectName: string;
  projectType: string | null;
  framework: string | null;
  region: string | null;
  roleArn: string | null;
  externalId: string | null;
}

export interface Project extends ProjectSettings {
  repo: Repository;
}

// --- Context type definition ---
interface ProjectContextType {
  project: Project | null;
  setProjectRepo: (repo: Repository) => void;
  updateProjectSettings: (settings: Partial<ProjectSettings>) => void;
  clearProject: () => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

// --- Provider Component ---
export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const [project, setProject] = useState<Project | null>(null);

  const setProjectRepo = useCallback((repo: Repository) => {
    setProject({
      repo,
      projectName: repo.name, // Default project name to repo name
      projectType: null,
      framework: null,
      region: null,
      roleArn: null,
      externalId: null,
    });
  }, []);

  const updateProjectSettings = useCallback((settings: Partial<ProjectSettings>) => {
    setProject((prevProject) => {
      if (!prevProject) return null;
      return { ...prevProject, ...settings };
    });
  }, []);

  const clearProject = useCallback(() => {
    setProject(null);
  }, []);

  return (
    <ProjectContext.Provider value={{ project, setProjectRepo, updateProjectSettings, clearProject }}>
      {children}
    </ProjectContext.Provider>
  );
};

// --- Custom Hook ---
export const useProject = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};
