import { IUser } from "@/app/lib/interface"; // Import IUser interface
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { FC } from "react";

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  onCreateTask: () => void;
  newTask: string;
  setNewTask: (value: string) => void;
  taskDescription: string;
  setTaskDescription: (value: string) => void;
  taskAssignees: string[]; // Updated to an array
  setTaskAssignees: (value: string[]) => void; // Updated to an array
  taskDueDate: string;
  setTaskDueDate: (value: string) => void;
  taskStatus: string;
  setTaskStatus: (value: string) => void;
  users: IUser[]; // Added to provide the list of users for assignees
  isLoading: boolean; // Changed from Boolean to boolean
}

const TaskModal: FC<TaskModalProps> = ({
  open,
  onClose,
  onCreateTask,
  newTask,
  setNewTask,
  taskDescription,
  setTaskDescription,
  taskAssignees,
  setTaskAssignees,
  taskDueDate,
  setTaskDueDate,
  taskStatus,
  setTaskStatus,
  users,
  isLoading,
}) => {
  const statusOptions = ["To Do", "In Progress", "Completed"]; // Define status options

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box className="modal-box bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto mt-24">
        <Typography variant="h6" className="mb-4 font-semibold text-lg">
          Create New Task
        </Typography>
        <TextField
          label="Task Name"
          fullWidth
          margin="normal"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="border-gray-300"
        />
        <TextField
          label="Description"
          fullWidth
          margin="normal"
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          className="border-gray-300"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel className="text-gray-700">Assignees</InputLabel>
          <Select
            multiple
            value={taskAssignees}
            onChange={(e) => setTaskAssignees(e.target.value as string[])}
            renderValue={(selected) => (
              <div className="flex flex-wrap gap-2">
                {selected
                  .map((value) => users.find((user) => user.id === value)?.name)
                  .filter(Boolean)
                  .join(", ")}
              </div>
            )}
            className="border-gray-300"
          >
            {users.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                <Checkbox
                  checked={user.id ? taskAssignees.includes(user.id) : false}
                />
                <ListItemText primary={user.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Due Date"
          type="date"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          value={taskDueDate}
          onChange={(e) => setTaskDueDate(e.target.value)}
          className="border-gray-300"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel className="text-gray-700">Status</InputLabel>
          <Select
            value={taskStatus}
            onChange={(e) => setTaskStatus(e.target.value as string)}
            className="border-gray-300"
          >
            {statusOptions.map((status) => (
              <MenuItem
                key={status}
                value={status}
                className="hover:bg-gray-100"
              >
                {status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box className="flex justify-end space-x-2 mt-4">
          <Button
            variant="outlined"
            onClick={onClose}
            className="border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={onCreateTask}
            className="bg-blue-500 text-white hover:bg-blue-600"
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default TaskModal;
