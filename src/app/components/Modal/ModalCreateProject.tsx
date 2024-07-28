import React from "react";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";

interface IProp {
  isModalOpen: boolean;
  handleModalClose: () => void;
  handleSubmit: () => void;
  nameProject: string;
  setNameProject: React.Dispatch<React.SetStateAction<string>>;
}

const ModalCreateProject: React.FC<IProp> = ({
  isModalOpen,
  handleModalClose,
  handleSubmit,
  nameProject,
  setNameProject,
}) => {
  return (
    <Modal
      open={isModalOpen}
      onClose={handleModalClose}
      aria-labelledby="create-project-modal"
      aria-describedby="create-new-project-form"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 4,
        }}
      >
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Create New Project
        </Typography>
        <TextField
          id="project-name"
          label="Project Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={nameProject}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setNameProject(e.target.value)
          }
        />
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            backgroundColor: "#3f51b5",
            color: "white",
            "&:hover": { backgroundColor: "#303f9f" },
            mt: 2,
          }}
        >
          Create
        </Button>
      </Box>
    </Modal>
  );
};

export default ModalCreateProject;
