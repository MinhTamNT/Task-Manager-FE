import {
  Box,
  Typography,
  Button,
  Modal,
  TextField,
  List,
  ListItem,
  ListItemText,
  Avatar,
} from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import { graphQLRequest } from "@/app/utils/request";
import { SEARCH_USER } from "@/app/utils/user";
import { useSession } from "next-auth/react";
import { styleModalInvite } from "../Style/Mui/Mui";

interface InviteMemberModalProps {
  open: boolean;
  onClose: () => void;
  onInviteMember: (userId: string) => void;
  projectId: string;
}

const InviteMemberModal: FC<InviteMemberModalProps> = ({
  open,
  onClose,
  onInviteMember,
  projectId,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const { data: session } = useSession();

  const handleSearch = async () => {
    if (searchTerm.trim() === "") return;
    try {
      const response = await graphQLRequest(
        SEARCH_USER,
        { name: searchTerm },
        session?.access_token
      );
      setSearchResults(response?.searchUsersByName || []);
      console.log(response?.searchUsersByName);
    } catch (error) {
      console.error("Error searching for users:", error);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [searchTerm]);

  const handleSelectUser = (userId: string) => {
    setSelectedUser(userId);
  };

  const handleInvite = () => {
    if (selectedUser) {
      console.log(selectedUser);
      onInviteMember(selectedUser);
      setSelectedUser("");
      setSearchTerm("");
      setSearchResults([]);
    }
  };

  

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        className="modal-box"
        sx={{
          ...styleModalInvite,
        }}
      >
        <Typography variant="h6" className="mb-4">
          Invite Team Member
        </Typography>
        <TextField
          label="Search User"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          fullWidth
        />

        <List>
          {searchTerm.length > 0 ? (
            searchResults.map((user) => (
              <ListItem
                key={user.id}
                onClick={() => handleSelectUser(user.id)}
                sx={{
                  backgroundColor:
                    selectedUser === user.uuid ? "#e0e0e0" : "inherit",
                  borderRadius: "10px",
                  "&:hover": {
                    backgroundColor:
                      selectedUser !== user.uuid ? "#f5f5f5" : "#e0e0e0",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <Avatar src={user?.image} />
                  <ListItemText primary={user.name} />
                </Box>
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="Search something ......" />
            </ListItem>
          )}
        </List>
        <Box className="flex justify-end space-x-2 mt-4">
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleInvite}
            disabled={!selectedUser}
          >
            Invite
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default InviteMemberModal;
