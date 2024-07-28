"use client";
import React, { lazy, Suspense, useEffect, useState } from "react";
import { AddOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Tooltip,
  Typography,
} from "@mui/material";
import { graphQLRequest } from "../utils/request";
import { ADD_MUTATION_NEW_PORJECT, GET_PROJECT } from "../utils/project";
import { useSession } from "next-auth/react";
import { IProject } from "../lib";
import { useRouter, useSearchParams } from "next/navigation";
const ModalCreateProject = lazy(
  () => import("../components/Modal/ModalCreateProject")
);
const ListProject = lazy(() => import("../components/ListProject/ListProject"));

export default function Project() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nameProject, setNameProject] = useState("");
  const [listProject, setListProject] = useState<IProject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleModalOpen = () => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("popup", "add-project");
    router.push(`${window.location.pathname}?${newParams.toString()}`);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete("popup");
    router.push(`${window.location.pathname}?${newParams.toString()}`);
    setIsModalOpen(false);
  };

  const handleSubmit = async () => {
    setIsCreating(true);
    try {
      const res = await graphQLRequest(
        ADD_MUTATION_NEW_PORJECT,
        { name: nameProject },
        session?.access_token
      );
      if (res) {
        const updatedProjects = await graphQLRequest(
          GET_PROJECT,
          {},
          session?.access_token
        );
        setListProject(updatedProjects?.projects || []);
      }
    } catch (error) {
      console.log("Error creating project:", error);
    } finally {
      setIsCreating(false);
      handleModalClose();
    }
  };

  useEffect(() => {
    const getProject = async () => {
      setIsLoading(true);
      try {
        const res = await graphQLRequest(
          GET_PROJECT,
          {},
          session?.access_token
        );
        setListProject(res?.project || []);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getProject();
  }, [session?.access_token, searchParams]);

  useEffect(() => {
    const popupName = searchParams.get("popup");
    if (popupName === "add-project") {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
  }, [searchParams]);

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
            {isLoading ? (
              <CircularProgress />
            ) : (
              <Suspense fallback={<div>Loading List...</div>}>
                <ListProject listProject={listProject} />
              </Suspense>
            )}
          </div>
        </div>
      </div>
      {isModalOpen && (
        <Suspense
          fallback={
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                flexDirection: "column",
              }}
            >
              <CircularProgress size={60} />
              <Typography variant="h6" sx={{ marginTop: 2 }}>
                Loading Your Project
              </Typography>
            </Box>
          }
        >
          <ModalCreateProject
            nameProject={nameProject}
            setNameProject={setNameProject}
            isModalOpen={isModalOpen}
            handleModalClose={handleModalClose}
            handleSubmit={handleSubmit}
          />
        </Suspense>
      )}
      {isCreating && <div>Creating project...</div>}
    </div>
  );
}
