"use client";
import { AddOutlined } from "@mui/icons-material";
import { Box, Button, Tooltip, Typography } from "@mui/material";
import { useState } from "react";
import { ModalCreateProject } from "../components/Modal/ModalCreateProject";
import { ListProject } from "../components/ListProject/ListProject";
export default function Project() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "Project 1",
      owner: "User 1",
      status: "Active",
      lastModified: "2024-07-15",
    },
    {
      id: 2,
      name: "Project 2",
      owner: "User 2",
      status: "Inactive",
      lastModified: "2024-07-14",
    },
    {
      id: 3,
      name: "Project 3",
      owner: "User 3",
      status: "Active",
      lastModified: "2024-07-13",
    },
  ]);
  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="text-black">
      <div className="title-page">
        <div className="md:flex justify-between items-center">
          <span className="uppercase font-semibold">Your Project</span>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Tooltip title="Create new project">
              <Button
                sx={{
                  display: "flex",
                  alignItems: "center",
                  width: "150px",
                  backgroundColor: "#3f51b5",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#303f9f",
                  },
                }}
                variant="contained"
                startIcon={<AddOutlined sx={{ color: "white" }} />}
                onClick={handleModalOpen}
              >
                <Typography variant="caption">New Project</Typography>
              </Button>
            </Tooltip>
            <Tooltip title="Share project">
              <Button
                sx={{
                  display: "flex",
                  alignItems: "center",
                  width: "150px",
                  backgroundColor: "#4caf50",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#388e3c",
                  },
                }}
                variant="contained"
              >
                <Typography variant="caption">Share</Typography>
              </Button>
            </Tooltip>
          </Box>
        </div>
        <div className="content-project">
          <div className="sort-list md:block hidden mb-2"></div>
          <div className="list-project">
            <ListProject />
          </div>
        </div>
      </div>
      {isModalOpen && (
        <ModalCreateProject
          isModalOpen={isModalOpen}
          handleModalClose={handleModalClose}
          handleSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
