import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import React from "react";

interface IProp {
  isModalOpen: boolean;
  handleModalClose: React.Dispatch<React.SetStateAction<boolean>>;
  handleSubmit: () => void;
}

export const ModalCreateProject: React.FC<IProp> = ({
  isModalOpen,
  handleModalClose,
  handleSubmit,
}) => {
  return (
    <>
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
          />
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              backgroundColor: "#3f51b5",
              color: "white",
              "&:hover": { backgroundColor: "#303f9f" },
            }}
          >
            Create
          </Button>
        </Box>
      </Modal>
    </>
  );
};
