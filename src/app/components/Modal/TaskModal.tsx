import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { FC } from "react";
import { styleModal } from "../Style/Mui/Mui";

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  onCreateTask: () => void;
  newTask: string;
  setNewTask: (value: string) => void;
  taskDescription: string;
  setTaskDescription: (value: string) => void;
  taskAssignee: string;
  setTaskAssignee: (value: string) => void;
  taskDueDate: string;
  setTaskDueDate: (value: string) => void;
  taskStatus: string;
  setTaskStatus: (value: string) => void;
}

const TaskModal: FC<TaskModalProps> = ({
  open,
  onClose,
  onCreateTask,
  newTask,
  setNewTask,
  taskDescription,
  setTaskDescription,
  taskAssignee,
  setTaskAssignee,
  taskDueDate,
  setTaskDueDate,
  taskStatus,
  setTaskStatus,
}) => (
  <Modal
    open={open}
    onClose={onClose}
    aria-labelledby="modal-title"
    aria-describedby="modal-description"
  >
    <Box className="modal-box" sx={{ ...styleModal }}>
      <Typography variant="h6" className="mb-4">
        Create New Task
      </Typography>
      <TextField
        label="Task Name"
        fullWidth
        margin="normal"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
      />
      <TextField
        label="Description"
        fullWidth
        margin="normal"
        value={taskDescription}
        onChange={(e) => setTaskDescription(e.target.value)}
      />
      <TextField
        label="Assignee"
        fullWidth
        margin="normal"
        value={taskAssignee}
        onChange={(e) => setTaskAssignee(e.target.value)}
      />
      <TextField
        label="Due Date"
        type="date"
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
        value={taskDueDate}
        onChange={(e) => setTaskDueDate(e.target.value)}
      />
      <TextField
        label="Status"
        fullWidth
        margin="normal"
        value={taskStatus}
        onChange={(e) => setTaskStatus(e.target.value)}
      />
      <Box className="flex justify-end space-x-2 mt-4">
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={onCreateTask}>
          Create
        </Button>
      </Box>
    </Box>
  </Modal>
);

export default TaskModal;
