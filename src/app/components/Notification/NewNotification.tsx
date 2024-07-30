import React, { useState, useEffect } from "react";
import { NotificationsOutlined } from "@mui/icons-material";
import {
  IconButton,
  Tooltip,
  Badge,
  Menu,
  MenuItem,
  ListItemText,
  Avatar,
  Divider,
} from "@mui/material";
import { useProject } from "../Context/ProjectContext";
import { INVITATION_RECEIVED_SUBSCRIPTION } from "@/app/utils/notification";
import { useSubscription } from "@apollo/client";

interface Invitation {
  userId: string;
  status: string;
}

export default function NewNotification() {
  const { projectID } = useProject();
  const { data, loading, error } = useSubscription(
    INVITATION_RECEIVED_SUBSCRIPTION,
    {
      variables: { projectId: projectID },
    }
  );

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const open = Boolean(anchorEl);

  useEffect(() => {
    if (data && data.invitationReceived) {
      setNotificationCount(data.invitationReceived.invitations.length);
    }
  }, [data]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);

    // Reset notification count when menu is opened
    if (notificationCount > 0) {
      setNotificationCount(0);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const { invitationReceived } = data || {
    invitationReceived: { invitations: [] },
  };

  return (
    <div>
      <Tooltip title="New Notification">
        <IconButton onClick={handleClick} className="relative">
          <Badge
            badgeContent={notificationCount}
            color="error"
            className="absolute top-0 right-0"
          >
            <NotificationsOutlined />
          </Badge>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            width: "300px",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        className="w-72 md:w-80 lg:w-96"
      >
        {loading && <MenuItem className="text-center">Loading...</MenuItem>}
        {error && (
          <MenuItem className="text-center">Error: {error.message}</MenuItem>
        )}
        {invitationReceived?.invitations.length === 0 ? (
          <MenuItem className="text-center">No new notifications</MenuItem>
        ) : (
          <>
            {invitationReceived?.invitations.map((notification: Invitation) => (
              <div key={notification.userId} className="flex items-center p-2">
                <Avatar
                  src={invitationReceived?.author?.image}
                  className="w-8 h-8"
                />
                <div className="ml-2">
                  <ListItemText
                    primary={`${invitationReceived?.author?.name} has an invitation with status ${notification.status}`}
                    className="text-sm"
                  />
                </div>
                <Divider className="my-2" />
              </div>
            ))}
          </>
        )}
      </Menu>
    </div>
  );
}
