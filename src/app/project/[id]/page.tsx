"use client";
import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useSubscription } from "@apollo/client";
import {
  Avatar,
  AvatarGroup,
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
import { GrAdd, GrProjects } from "react-icons/gr";
import LoadingSpinner from "@/app/components/Loading/Loading";
import InviteMemberModal from "@/app/components/Modal/InviteMemberModal";
import TaskModal from "@/app/components/Modal/TaskModal";
import { Task } from "@/app/lib/interface";
import { GET_PROJECT_BY_ID, PROJECT_UPDATED } from "@/app/utils/project";
import { ADD_NEW_TASK, GET_TASK_LIST } from "@/app/utils/task";

const useProjectQuery = (projectId: string | undefined) => {
  return useQuery(GET_PROJECT_BY_ID, {
    variables: { getProjectByIdId: projectId },
    skip: !projectId,
  });
};

const useProjectSubscription = (projectId: string | undefined) => {
  return useSubscription(PROJECT_UPDATED, {
    variables: { projectId },
    skip: !projectId,
  });
};

function ProjectInfor({ params }: { params: { id: string } }) {
  const { data: listTask, refetch: refetchTasks } = useQuery<{
    getTaskByProject: Task[];
  }>(GET_TASK_LIST, {
    variables: { projectId: params?.id },
  });

  const [openTaskModal, setOpenTaskModal] = useState<boolean>(false);
  const [openInviteModal, setOpenInviteModal] = useState<boolean>(false);
  const [newTask, setNewTask] = useState<string>("");
  const [taskDescription, setTaskDescription] = useState<string>("");
  const [taskAssignees, setTaskAssignees] = useState<string[]>([]);
  const [taskDueDate, setTaskDueDate] = useState<string>("");
  const [taskStatus, setTaskStatus] = useState<string>("");
  const [taskList, setTaskList] = useState<Task[]>(
    listTask?.getTaskByProject || []
  );
  const [expandedTaskIds, setExpandedTaskIds] = useState<Set<string>>(
    new Set()
  );
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");

  const [assignmentTo] = useMutation(ADD_NEW_TASK);
  const {
    data: projectData,
    loading: projectLoading,
    error: projectError,
  } = useProjectQuery(params?.id);

  const { data: subscriptionData } = useProjectSubscription(params?.id);

  useEffect(() => {
    if (subscriptionData?.projectUpdated) {
      refetchTasks(); // Refetch tasks when project updates
    }
  }, [subscriptionData, refetchTasks]);

  useEffect(() => {
    if (listTask) {
      setTaskList(listTask.getTaskByProject || []);
    }
  }, [listTask]);

  if (projectLoading) {
    return (
      <Box className="flex items-center justify-center h-60">
        <LoadingSpinner />
      </Box>
    );
  }

  if (projectError) {
    return (
      <div className="text-red-500">
        Error loading project: {projectError.message}
      </div>
    );
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

  const handleCreateTask = async () => {
    if (
      newTask.trim() === "" ||
      taskDescription.trim() === "" ||
      taskAssignees.length === 0 ||
      taskDueDate.trim() === "" ||
      taskStatus.trim() === ""
    ) {
      setSnackbarMessage("All fields are required");
      setSnackbarOpen(true);
      return;
    }

    try {
      await assignmentTo({
        variables: {
          title: newTask,
          description: taskDescription,
          assignedTo: taskAssignees,
          dueDate: taskDueDate,
          status: taskStatus,
          project: params?.id,
        },
      });

      setOpenTaskModal(false);
      setNewTask("");
      setTaskDescription("");
      setTaskAssignees([]);
      setTaskDueDate("");
      setTaskStatus("");
    } catch (error) {
      console.error("Error creating task:", error);
      setSnackbarMessage("Error creating task");
      setSnackbarOpen(true);
    }
  };

  const handleInviteMember = () => {
    setOpenInviteModal(false);
  };

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
            <Button
              onClick={() => handleToggleExpand(task.id)}
              className="text-blue-500"
            >
              {expandedTaskIds.has(task.id) ? "-" : "+"}
            </Button>
            {task.title}
          </TableCell>
          <TableCell>{task.description}</TableCell>
          <TableCell>
            <AvatarGroup max={4}>
              {task.assignee.map((assignee: any) => (
                <Avatar
                  key={assignee.uuid}
                  src={assignee?.image}
                  alt="member-picture"
                />
              ))}
            </AvatarGroup>
          </TableCell>
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
          <Box className="mt-4">
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
          <Box className="mt-4">
            <Typography
              variant="h6"
              className="text-gray-800 font-semibold mb-2"
            >
              Team Members
            </Typography>
            <div className="flex flex-wrap gap-2">
              {project?.members?.length > 0 ? (
                <AvatarGroup max={10}>
                  {project.members.map((member: any) => (
                    <Avatar
                      key={member.uuid}
                      alt={member.name}
                      src={member?.image}
                    />
                  ))}
                </AvatarGroup>
              ) : (
                <Typography className="text-gray-600">
                  No members assigned
                </Typography>
              )}
            </div>
          </Box>
          <Box className="flex space-x-4 mt-4">
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
                  <TableCell>Assignee(s)</TableCell>
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
        taskAssignees={taskAssignees}
        setTaskAssignees={setTaskAssignees}
        taskDueDate={taskDueDate}
        setTaskDueDate={setTaskDueDate}
        taskStatus={taskStatus}
        setTaskStatus={setTaskStatus}
        users={projectData?.getProjectById?.members}
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
