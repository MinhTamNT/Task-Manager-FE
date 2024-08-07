import { Notification, NotificationCreatedData } from "@/app/lib/interface";
import {
  GET_NOTIFICATIONS,
  NOTIFICATION_CREATED_SUBSCRIPTION,
  UPDATE_INVITATION_STATUS,
} from "@/app/utils/notification";
import { useMutation, useQuery, useSubscription } from "@apollo/client";
import {
  CheckCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { NotificationsOutlined } from "@mui/icons-material";
import { Badge, Box, IconButton, Menu, Tooltip } from "@mui/material";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

export default function NewNotification() {
  const { data } = useQuery<{ notifications: Notification[] }>(
    GET_NOTIFICATIONS
  );
  const { data: sessionData } = useSession();
  const [updateInvitationStatus] = useMutation<{ updateInvitationStatus: any }>(
    UPDATE_INVITATION_STATUS
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const open = Boolean(anchorEl);
  const { data: subscriptionData } = useSubscription<NotificationCreatedData>(
    NOTIFICATION_CREATED_SUBSCRIPTION,
    {
      onSubscriptionData: ({ subscriptionData }) => {
        console.log("Subscription Data:", subscriptionData);
        if (subscriptionData && subscriptionData.data) {
          const newNotification = subscriptionData.data.notificationCreated;
          console.log("New Notification:", newNotification);

          const currentUserId = sessionData?.user.id;
          console.log(currentUserId);
          console.log(newNotification.userId);
          if (currentUserId && newNotification.userId === currentUserId) {
            setNotifications((prevNotifications) => {
              const updatedNotifications = [
                ...prevNotifications,
                newNotification,
              ];
              setNotificationCount(updatedNotifications.length);
              return updatedNotifications;
            });
          }
        }
      },
    }
  );

  useEffect(() => {
    if (data) {
      setNotifications(data.notifications);
      setNotificationCount(data.notifications.length);
    }
  }, [data]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);

    if (notificationCount > 0) {
      setNotificationCount(0);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAccept = async (notificationId: string, projectId: string) => {
    try {
      await updateInvitationStatus({
        variables: { projectId, status: "ACCEPTED" },
      });
    } catch (error) {
      console.error("Failed to accept invitation", error);
    }
  };

  const handleDecline = async (notificationId: string, projectId: string) => {
    try {
      await updateInvitationStatus({
        variables: { projectId, status: "DECLINED" },
      });
    } catch (error) {
      console.error("Failed to decline invitation", error);
    }
  };

  return (
    <Box>
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
        <div className="p-4 bg-white shadow-md rounded-lg w-full">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Notifications
          </h2>
          {notifications.length === 0 ? (
            <p className="text-center text-gray-600">
              No notifications available
            </p>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 mb-3 rounded-lg border ${
                  notification.read
                    ? "bg-gray-50 border-gray-200"
                    : "bg-blue-50 border-blue-300"
                } transition duration-300 ease-in-out hover:bg-blue-100 cursor-pointer relative flex items-start`}
              >
                <div className="w-6 h-6 mr-3 flex-shrink-0">
                  {notification.read ? (
                    <InformationCircleIcon className="text-gray-500 w-full h-full" />
                  ) : (
                    <CheckCircleIcon className="text-blue-500 w-full h-full" />
                  )}
                </div>
                <div className="flex-grow">
                  <p className="text-sm text-gray-700">
                    {notification.message}
                  </p>
                  {notification.message.includes(
                    "You have been invited to join the project"
                  ) &&
                    !notification?.read && (
                      <div className="mt-3 flex space-x-2">
                        <button
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                          onClick={() =>
                            handleAccept(
                              notification.id,
                              notification.projectId
                            )
                          }
                        >
                          Accept
                        </button>
                        <button
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                          onClick={() =>
                            handleDecline(
                              notification.id,
                              notification.projectId
                            )
                          }
                        >
                          Decline
                        </button>
                      </div>
                    )}
                </div>
                {!notification.read && (
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                )}
              </div>
            ))
          )}
        </div>
      </Menu>
    </Box>
  );
}
