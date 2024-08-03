"use client";
import { IUser } from "@/app/lib/interface";
import { CREATE_CONVERSATION } from "@/app/utils/conversation";
import { SEARCH_USER_BY_NAME } from "@/app/utils/user";
import { useMutation, useQuery } from "@apollo/client";
import { MessageOutlined } from "@mui/icons-material"; // Example icon for conversation
import {
  Avatar,
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

export default function Conversation() {
  const [query, setQuery] = useState("");

  const { data, loading, error, refetch } = useQuery(SEARCH_USER_BY_NAME, {
    variables: { name: query },
    skip: !query,
    fetchPolicy: "network-only",
  });
  const [createConversation] = useMutation(CREATE_CONVERSATION);
  const handleSearch = () => {
    if (query.trim()) {
      refetch();
    }
  };

  const handleCreateConversation = async (userId: string) => {
    try {
      await createConversation({
        variables: {
          participants: userId,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Paper
        elevation={0}
        sx={{
          padding: 1,
          maxWidth: 600,
          margin: "auto",
          borderRadius: "8px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 2,
        }}
      >
        <TextField
          size="small"
          variant="outlined"
          label="Search User..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          sx={{ flexGrow: 1 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          sx={{ flexShrink: 0 }}
        >
          Search
        </Button>
      </Paper>

      {loading && (
        <Typography variant="body2" sx={{ marginTop: 2 }}>
          Loading...
        </Typography>
      )}
      {error && (
        <Typography variant="body2" color="error" sx={{ marginTop: 2 }}>
          Error: {error.message}
        </Typography>
      )}
      {data && (
        <Box mt={2}>
          <List>
            {data.searchUsersByName.map((user: IUser) => (
              <ListItem
                key={user.id}
                sx={{
                  borderBottom: "1px solid #ddd",
                  position: "relative",
                  "&:hover .hover-actions": {
                    opacity: 1,
                  },
                }}
              >
                <ListItemAvatar>
                  <Avatar src={user.image ?? ""} alt={user.name} />
                </ListItemAvatar>
                <ListItemText primary={user.name} />
                <Box
                  className="hover-actions"
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    opacity: 0,
                    transition: "opacity 0.3s",
                  }}
                >
                  <IconButton
                    color="primary"
                    onClick={() => handleCreateConversation(user.id)}
                  >
                    <MessageOutlined />
                  </IconButton>
                </Box>
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
}
