import React from "react";
import { Box, List, ListItemButton, Typography, useTheme } from "@mui/material";

import type { GithubBranch } from "../types/api";

interface BranchListProps {
  branches: GithubBranch[];
  selectedBranch: string | null;
  onSelect: (branch: GithubBranch) => void;
  loading?: boolean;
}

const BranchList: React.FC<BranchListProps> = ({
  branches,
  selectedBranch,
  onSelect,
  loading = false,
}) => {
  const theme = useTheme();

  if (loading) {
    return (
      <Box
        sx={{
          height: "200px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: `1px solid ${theme.palette.custom.border}`,
          borderRadius: "0px",
          mt: 2,
        }}
      >
        <Typography color="text.secondary">Loading branches...</Typography>
      </Box>
    );
  }

  if (branches.length === 0) {
    return (
      <Box
        sx={{
          height: "200px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: `1px solid ${theme.palette.custom.border}`,
          borderRadius: "0px",
          mt: 2,
        }}
      >
        <Typography color="text.secondary">
          No branches found for this repository
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: "200px",
        overflowY: "auto",
        border: `1px solid ${theme.palette.custom.border}`,
        borderRadius: "0px",
        mt: 2,
      }}
    >
      <List role="listbox" aria-label="Branch list" sx={{ p: 0 }}>
        {branches.map((branch) => (
          <ListItemButton
            key={branch.name}
            role="option"
            aria-selected={selectedBranch === branch.name}
            selected={selectedBranch === branch.name}
            onClick={() => onSelect(branch)}
            sx={{
              height: "48px",
              "&.Mui-selected": {
                outline: `2px solid ${theme.palette.primary.main}`,
                outlineOffset: "-2px",
                backgroundColor: "action.selected",
              },
            }}
          >
            <Typography sx={{ flexGrow: 1, color: "text.primary" }}>
              {branch.name}
            </Typography>
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
};

export default BranchList;
