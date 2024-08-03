import { IProject } from "@/app/lib";
import {
  ADD_MUTATION_NEW_PORJECT,
  DELETE_PROJECT,
  GET_PROJECT,
} from "@/app/utils/project";
import { graphQLRequest } from "@/app/utils/request";
import { DeleteOutline, EditOutlined } from "@mui/icons-material";
import {
  Button,
  Chip,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ModalCreateProject from "../Modal/ModalCreateProject";
import { columns } from "./ProjectColums";
import { useMutation } from "@apollo/client";

const ListProject: React.FC = () => {
  const [sortOption, setSortOption] = useState<string>("view");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [listProject, setListProject] = useState<IProject[]>([]);
  const { data: session } = useSession();
  const [nameProject, setNameProject] = useState("");
  const [description, setDescription] = useState("");
  const [refresh, setRefresh] = useState<boolean>(false);
  const [deleteProject] = useMutation(DELETE_PROJECT);
  const searchParams = useSearchParams();
  const router = useRouter(); // Use only this

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSortChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setSortOption(e.target.value as string);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredProjects: IProject[] = []; // Replace with actual filtered projects

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
    try {
      await graphQLRequest(
        ADD_MUTATION_NEW_PORJECT,
        { name: nameProject, description },
        session?.access_token
      );
    } catch (error) {
      console.log("Error creating project:", error);
    } finally {
      handleModalClose();
    }
  };

  useEffect(() => {
    const getProject = async () => {
      try {
        const res = await graphQLRequest(
          GET_PROJECT,
          {},
          session?.access_token
        );
        setListProject(res?.project ?? []);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    getProject();
  }, [session?.access_token, searchParams, refresh]);

  const hanlderDeletedProject = async (projectId: string) => {
    try {
      await deleteProject({
        variables: {
          deleteProjectId: projectId,
        },
      });
      setRefresh((prev) => !prev);
      toast.success("Deleted the project successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const hanlerNextPageDetail = (projectId: string) => {
    router.push(`/project/${projectId}`);
  };

  return (
    <div className="min-h-screen">
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <div className="md:flex mb-2 md:mb-0 justify-between">
          <Typography
            variant="h5"
            component="h2"
            className="mb-4 font-semibold"
          >
            Project List
          </Typography>
          <div>
            <Button
              variant="contained"
              sx={{ mr: "10px" }}
              onClick={handleModalOpen}
            >
              Create
            </Button>
            <Button variant="contained">Share</Button>
          </div>
        </div>
        <Divider className="mb-4" />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-4 sm:mb-0">
            <FormControl className="mb-2 sm:mb-0 w-full sm:w-auto">
              <input
                id="search"
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search by project name"
                className="p-2 border border-gray-300 rounded-md w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </FormControl>
            <FormControl className="w-full sm:w-auto">
              <InputLabel id="sort">Sort by</InputLabel>
              <Select
                id="sort"
                value={sortOption}
                // onChange={handleSortChange}
                className="bg-white"
              >
                <MenuItem value="view">Most Viewed</MenuItem>
                <MenuItem value="created_at">Created At</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>

        <TableContainer component={Paper} className="shadow-md">
          <Table className="min-w-full">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    className="font-semibold text-gray-700"
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {listProject?.map((project) => (
                <TableRow key={project?.id}>
                  <TableCell
                    className="py-4 text-gray-900"
                    onClick={() => hanlerNextPageDetail(project?.id)}
                    style={{ cursor: "pointer" }}
                  >
                    {project?.name}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={project?.status}
                      color={
                        project?.status === "Completed"
                          ? "success"
                          : project.status === "Active"
                          ? "primary"
                          : "warning"
                      }
                      className={`capitalize`}
                    />
                  </TableCell>
                  <TableCell>{project.members?.length ?? 0}</TableCell>
                  <TableCell>{project.author?.name}</TableCell>
                  <TableCell>{project.description}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Tooltip title="Edit">
                        <IconButton
                          aria-label="edit"
                          color="primary"
                          onClick={() => hanlerNextPageDetail(project?.id)}
                        >
                          <EditOutlined />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          aria-label="delete"
                          color="error"
                          onClick={() => hanlderDeletedProject(project?.id)}
                        >
                          <DeleteOutline />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      {isModalOpen && (
        <ModalCreateProject
          nameProject={nameProject}
          setNameProject={setNameProject}
          isModalOpen={isModalOpen}
          handleModalClose={handleModalClose}
          handleSubmit={handleSubmit}
          setDescription={setDescription}
          description={description}
        />
      )}
    </div>
  );
};

export default ListProject;
