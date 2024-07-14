import { AddOutlined } from "@mui/icons-material";
import { Button, Tooltip, Typography } from "@mui/material";
import React from "react";

export default function Project() {
  return (
    <div className="text-black">
      <div className="title-page">
        <div className="flex justify-between items-center">
          <span className="uppercase font-semibold">Your Project</span>
          <Tooltip title="Create new project">
            <Button
              sx={{ display: "flex", alignItems: "center" }}
              variant="contained"
            >
              <AddOutlined sx={{ color: "white" }} />
              <Typography variant="button">Create new project</Typography>
            </Button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
