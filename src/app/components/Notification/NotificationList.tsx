import {
  GET_NOTIFICATIONS,
  MARK_NOTIFICATION_AS_READ,
  NOTIFICATION_CREATED_SUBSCRIPTION,
  UPDATE_INVITATION_STATUS,
} from "@/app/utils/notification";
import { useMutation, useQuery, useSubscription } from "@apollo/client";
import {
  CheckCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import LoadingSpinner from "../Loading/Loading";
import { Notification, NotificationCreatedData } from "@/app/lib/interface";

const NotificationList: React.FC = () => {
  const { data } = useQuery<{ notifications: Notification[] }>(
    GET_NOTIFICATIONS
  );
  const [markNotificationAsRead] = useMutation<{
    markNotificationAsRead: Notification;
  }>(MARK_NOTIFICATION_AS_READ);
  const [updateInvitationStatus] = useMutation<{ updateInvitationStatus: any }>(
    UPDATE_INVITATION_STATUS
  );

  const [notifications, setNotifications] = useState<Notification[]>([]);

  const { data: subscriptionData } = useSubscription<NotificationCreatedData>(
    NOTIFICATION_CREATED_SUBSCRIPTION,
    {
      onSubscriptionData: ({ subscriptionData }) => {
        if (subscriptionData && subscriptionData.data) {
          const newNotification = subscriptionData.data.notificationCreated;
          setNotifications((prevNotifications) => [
            ...prevNotifications,
            newNotification,
          ]);
        }
      },
    }
  );

  useEffect(() => {
    if (data) {
      setNotifications(data.notifications);
    }
  }, [data]);

  const handleMouseEnter = async (id: string) => {
    try {
      await markNotificationAsRead({ variables: { id } });
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  };

  const handleAccept = async (notificationId: string, projectId: string) => {
    try {
      await updateInvitationStatus({
        variables: { projectId, status: "ACCEPTED" },
      });
      await markNotificationAsRead({ variables: { id: notificationId } });
    } catch (error) {
      console.error("Failed to accept invitation", error);
    }
  };

  const handleDecline = async (notificationId: string, projectId: string) => {
    try {
      await updateInvitationStatus({
        variables: { projectId, status: "DECLINED" },
      });
      await markNotificationAsRead({ variables: { id: notificationId } });
    } catch (error) {
      console.error("Failed to decline invitation", error);
    }
  };

  if (!notifications) return <LoadingSpinner />;

  return (
    <div className="p-4 bg-white shadow-md rounded-lg w-full">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Notifications</h2>
      {notifications.length === 0 ? (
        <p className="text-center text-gray-600">No notifications available</p>
      ) : (
        notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 mb-3 rounded-lg border ${
              notification.read
                ? "bg-gray-50 border-gray-200"
                : "bg-blue-50 border-blue-300"
            } transition duration-300 ease-in-out hover:bg-blue-100 cursor-pointer relative flex items-start`}
            onMouseEnter={() => handleMouseEnter(notification.id)}
          >
            <div className="w-6 h-6 mr-3 flex-shrink-0">
              {notification.read ? (
                <InformationCircleIcon className="text-gray-500 w-full h-full" />
              ) : (
                <CheckCircleIcon className="text-blue-500 w-full h-full" />
              )}
            </div>
            <div className="flex-grow">
              <p className="text-sm text-gray-700">{notification.message}</p>
              {notification.message.includes(
                "You have been invited to join the project"
              ) && (
                <div className="mt-3 flex space-x-2">
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    onClick={() =>
                      handleAccept(notification.id, notification.projectId)
                    }
                  >
                    Accept
                  </button>
                  <button
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                    onClick={() =>
                      handleDecline(notification.id, notification.projectId)
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
  );
};

export default NotificationList;
