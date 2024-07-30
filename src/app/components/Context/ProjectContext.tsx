import React, { createContext, useContext, useState, FC } from "react";

interface ProjectContextType {
  projectID: string;
  setProjectId: (id: string) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [projectID, setProjectId] = useState<string>("");

  return (
    <ProjectContext.Provider value={{ projectID, setProjectId }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
};
