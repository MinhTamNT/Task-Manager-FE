"use client";

import LoadingSpinner from "@/app/components/Loading/Loading";
import InviteMemberModal from "@/app/components/Modal/InviteMemberModal";
import TaskModal from "@/app/components/Modal/TaskModal";
import { Task } from "@/app/lib/interface";
import { GET_PROJECT_BY_ID, PROJECT_UPDATED } from "@/app/utils/project";
import { useQuery, useSubscription } from "@apollo/client";
import {
  Box,
  Button,
  Collapse,
  Paper,
  Snackbar,
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
import React, { useEffect, useState } from "react";
import { GrAdd, GrProjects } from "react-icons/gr";

const useProjectQuery = (
  projectId: string | undefined,
  token: string | undefined
) => {
  return useQuery(GET_PROJECT_BY_ID, {
    variables: { getProjectByIdId: projectId },
    context: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    skip: !projectId || !token,
  });
};

const useProjectSubscription = (projectId: string | undefined) => {
  return useSubscription(PROJECT_UPDATED, {
    variables: { projectId },
    skip: !projectId,
  });
};

function ProjectInfor({ params }: Readonly<{ params: { id: string } }>) {
  // States
  const [openTaskModal, setOpenTaskModal] = useState<boolean>(false);
  const [openInviteModal, setOpenInviteModal] = useState<boolean>(false);
  const [newTask, setNewTask] = useState<string>("");
  const [taskDescription, setTaskDescription] = useState<string>("");
  const [taskAssignee, setTaskAssignee] = useState<string>("");
  const [taskDueDate, setTaskDueDate] = useState<string>("");
  const [taskStatus, setTaskStatus] = useState<string>("");
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [expandedTaskIds, setExpandedTaskIds] = useState<Set<string>>(
    new Set()
  );
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");

  const { data: session } = useSession();

  // Hooks
  const {
    data: projectData,
    loading: projectLoading,
    error: projectError,
  } = useProjectQuery(params?.id, session?.access_token);

  const { data: subscriptionData } = useProjectSubscription(params?.id);

  // Handle project update subscription
  useEffect(() => {
    if (subscriptionData?.projectUpdated) {
    }
  }, [subscriptionData]);

  if (projectLoading) {
    return (
      <Box className="flex items-center justify-center h-60">
        <LoadingSpinner />
      </Box>
    );
  }

  if (projectError) {
    return <div>Error loading project: {projectError.message}</div>;
  }

  const project = projectData?.getProjectById;

  const getProgressPercentage = (status: string): number => {
    switch (status) {
      case "Not Started":
        return 0;
      case "In Progress":
        return 50;
      case "Completed":
        return 100;
      default:
        return 0;
    }
  };

  const handleCreateTask = () => {
    if (
      newTask.trim() === "" ||
      taskDescription.trim() === "" ||
      taskAssignee.trim() === "" ||
      taskDueDate.trim() === "" ||
      taskStatus.trim() === ""
    ) {
      setSnackbarMessage("All fields are required");
      setSnackbarOpen(true);
      return;
    }
    setTaskList((prevTaskList) => [
      ...prevTaskList,
      {
        id: Date.now().toString(),
        name: newTask,
        description: taskDescription,
        assignee: taskAssignee,
        dueDate: taskDueDate,
        status: taskStatus,
      },
    ]);
    setOpenTaskModal(false);
    setNewTask("");
    setTaskDescription("");
    setTaskAssignee("");
    setTaskDueDate("");
    setTaskStatus("");
  };

  const handleInviteMember = () => {
    setOpenInviteModal(false);
  };

  // Toggle task expansion
  const handleToggleExpand = (taskId: string) => {
    setExpandedTaskIds((prev) => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(taskId)) {
        newExpanded.delete(taskId);
      } else {
        newExpanded.add(taskId);
      }
      return newExpanded;
    });
  };

  const renderTaskRows = (tasks: Task[]): React.ReactNode => {
    return tasks.map((task) => (
      <React.Fragment key={task.id}>
        <TableRow>
          <TableCell>
            <Button onClick={() => handleToggleExpand(task.id)}>
              {expandedTaskIds.has(task.id) ? "-" : "+"}
            </Button>
            {task.name}
          </TableCell>
          <TableCell>{task.description}</TableCell>
          <TableCell>{task.assignee}</TableCell>
          <TableCell>{task.dueDate}</TableCell>
          <TableCell>{task.status}</TableCell>
          <TableCell>
            <div className="flex items-center space-x-2">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full ${
                    getProgressPercentage(task.status) === 100
                      ? "bg-green-500"
                      : "bg-blue-500"
                  }`}
                  style={{ width: `${getProgressPercentage(task.status)}%` }}
                ></div>
              </div>
              <span className="text-gray-600">
                {getProgressPercentage(task.status)}%
              </span>
            </div>
          </TableCell>
        </TableRow>
        {expandedTaskIds.has(task.id) && task.subTasks && (
          <TableRow>
            <TableCell colSpan={6}>
              <Collapse in={expandedTaskIds.has(task.id)}>
                <Table>
                  <TableBody>{renderTaskRows(task.subTasks)}</TableBody>
                </Table>
              </Collapse>
            </TableCell>
          </TableRow>
        )}
      </React.Fragment>
    ));
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg min-h-screen w-full">
      {project && (
        <>
          <Box className="flex items-center space-x-4">
            <Tooltip title="Project Name">
              <Box className="flex items-center space-x-2">
                <GrProjects className="text-gray-600" size={24} />
                <Typography
                  variant="h6"
                  className="text-gray-800 font-semibold"
                >
                  {project?.name ?? "No project name"}
                </Typography>
              </Box>
            </Tooltip>
          </Box>
          <Box>
            <Typography
              variant="h6"
              className="text-gray-800 font-semibold mb-2"
            >
              Description
            </Typography>
            <Typography variant="body1" className="text-gray-700">
              {project?.description ?? "No description available"}
            </Typography>
          </Box>
          <Box>
            <Typography
              variant="h6"
              className="text-gray-800 font-semibold mb-2"
            >
              Team Members
            </Typography>
            <div className="flex flex-wrap gap-2">
              {project?.members?.length ? (
                project.members.map((member: any) => (
                  <Button
                    key={member.uuid}
                    variant="outlined"
                    className="text-gray-700 border-gray-300 hover:bg-gray-100"
                  >
                    {member.name}
                  </Button>
                ))
              ) : (
                <Typography className="text-gray-600">
                  No members assigned
                </Typography>
              )}
            </div>
          </Box>
          <Box className="flex space-x-4">
            <Button
              variant="contained"
              color="primary"
              startIcon={<GrAdd />}
              onClick={() => setOpenTaskModal(true)}
            >
              Create Task
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setOpenInviteModal(true)}
            >
              Invite Member
            </Button>
          </Box>
          <TableContainer component={Paper} className="mt-4">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Task Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Assignee</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Progress</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{renderTaskRows(taskList)}</TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      <TaskModal
        open={openTaskModal}
        onClose={() => setOpenTaskModal(false)}
        onCreateTask={handleCreateTask}
        newTask={newTask}
        setNewTask={setNewTask}
        taskDescription={taskDescription}
        setTaskDescription={setTaskDescription}
        taskAssignee={taskAssignee}
        setTaskAssignee={setTaskAssignee}
        taskDueDate={taskDueDate}
        setTaskDueDate={setTaskDueDate}
        taskStatus={taskStatus}
        setTaskStatus={setTaskStatus}
      />

      <InviteMemberModal
        open={openInviteModal}
        onClose={() => setOpenInviteModal(false)}
        onInviteMember={handleInviteMember}
        projectId={params?.id}
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </div>
  );
}

export default ProjectInfor;
