import React from "react";
import { Box, List, ListItemButton, Typography, useTheme } from "@mui/material";
import VisibilityChip from "./VisibilityChip";

// 외부에서 Repo 타입을 import 할 수 있도록 export 합니다.
export interface Repo {
  id: number;
  fullName: string;
  isPrivate: boolean;
}

interface RepoListProps {
  repos: Repo[];
  selectedId: number | null;
  onSelect: (repo: Repo) => void;
}

const RepoList: React.FC<RepoListProps> = ({ repos, selectedId, onSelect }) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        height: "320px",
        overflowY: "auto",
        border: `1px solid ${theme.palette.custom.border}`,
        //borderRadius: '12px',
        mt: 2,
      }}
    >
      <List role="listbox" aria-label="Repository list" sx={{ p: 0 }}>
        {repos.map((repo) => (
          <ListItemButton
            key={repo.id}
            role="option"
            aria-selected={selectedId === repo.id}
            selected={selectedId === repo.id}
            onClick={() => onSelect(repo)}
            sx={{
              height: "64px",
              "&.Mui-selected": {
                outline: `2px solid ${theme.palette.primary.main}`,
                outlineOffset: "-2px",
                backgroundColor: "action.selected",
              },
            }}
          >
            <Typography sx={{ flexGrow: 1, color: "text.primary" }}>
              {repo.fullName}
            </Typography>
            <VisibilityChip isPrivate={repo.isPrivate} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
};

export default RepoList;
