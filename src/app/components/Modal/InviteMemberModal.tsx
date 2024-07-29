import { Box, Typography, Button, Modal } from "@mui/material";
import React, { FC } from "react";
import { styleModal } from "../Style/Mui/Mui";

interface InviteMemberModalProps {
  open: boolean;
  onClose: () => void;
  onInviteMember: () => void;
}

const InviteMemberModal: FC<InviteMemberModalProps> = ({
  open,
  onClose,
  onInviteMember,
}) => (
  <Modal
    open={open}
    onClose={onClose}
    aria-labelledby="modal-title"
    aria-describedby="modal-description"
  >
    <Box className="modal-box" sx={{ ...styleModal }}>
      <Typography variant="h6" className="mb-4">
        Invite Team Member
      </Typography>
      <Box className="flex justify-end space-x-2 mt-4">
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={onInviteMember}>
          Invite
        </Button>
      </Box>
    </Box>
  </Modal>
);

export default InviteMemberModal;
