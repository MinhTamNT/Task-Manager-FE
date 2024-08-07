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
import { useRouter, useSearchParams } from "next/navigation";

interface IConversation {
  id: string;
  participants: IUser[];
  lastMessage: string;
}

interface IProp {
  listConversation: IConversation[];
}

// Component code
export default function Conversation({ listConversation }: IProp) {
  const [query, setQuery] = useState("");
  const { data, loading, error, refetch } = useQuery(SEARCH_USER_BY_NAME, {
    variables: { name: query },
    skip: !query,
    fetchPolicy: "network-only",
  });
  const [createConversation] = useMutation(CREATE_CONVERSATION);
  const router = useRouter();
  const handleSearch = () => {
    if (query.trim()) {
      refetch();
    }
  };
  const searchParams = useSearchParams();
  const handleCreateConversation = async (userId: string) => {
    try {
      if (!userId) return;
      await createConversation({
        variables: {
          participants: [userId],
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleUserClick = (userId: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("conversation", `${userId}`);
    router.push(`${window.location.pathname}?${newParams.toString()}`);
  };

  return (
    <>
      <Box className="p-4">
        <Paper
          elevation={0}
          className="p-2 max-w-4xl mx-auto rounded-md flex items-center gap-2"
        >
          <TextField
            size="small"
            variant="outlined"
            label="Search User..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-grow"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearch}
            className="flex-shrink-0"
          >
            Search
          </Button>
        </Paper>

        {loading && (
          <Typography variant="body2" className="mt-2">
            Loading...
          </Typography>
        )}
        {error && (
          <Typography variant="body2" color="error" className="mt-2">
            Error: {error.message}
          </Typography>
        )}
        {data && (
          <Box className="mt-4">
            <List>
              {data.searchUsersByName.map((user: IUser) => (
                <ListItem
                  key={user.id}
                  className="border-b border-gray-300 relative hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleUserClick(user.id ?? "")}
                >
                  <ListItemAvatar>
                    <Avatar src={user.image ?? ""} alt={user.name} />
                  </ListItemAvatar>
                  <ListItemText primary={user.name} />
                  <Box className="absolute right-0 top-1/2 transform -translate-y-1/2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <IconButton
                      color="primary"
                      onClick={() => handleCreateConversation(user.id ?? "")}
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

      <div className="mt-5">
        {listConversation?.getConversationsByUserId.map(
          (conversation: IConversation) => {
            const firstParticipant = conversation.participants[1];

            return firstParticipant ? (
              <div
                key={conversation.id}
                className="flex items-center mb-4 p-2 bg-gray-50 rounded-md shadow-md hover:bg-gray-100 cursor-pointer"
                onClick={() => handleUserClick(conversation.id)}
              >
                <Avatar src={firstParticipant.image} />
                <p className="ml-2 text-lg font-medium">
                  {firstParticipant.name}
                </p>
              </div>
            ) : null;
          }
        )}
      </div>
    </>
  );
}
