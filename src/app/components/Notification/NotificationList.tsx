import {
  GET_NOTIFICATIONS,
  MARK_NOTIFICATION_AS_READ,
  UPDATE_INVITATION_STATUS,
} from "@/app/utils/notification";
import { useMutation, useQuery } from "@apollo/client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import LoadingSpinner from "../Loading/Loading";

const NotificationList = () => {
  const { data, loading, error } = useQuery(GET_NOTIFICATIONS);
  const [markNotificationAsRead] = useMutation(MARK_NOTIFICATION_AS_READ);
  const [updateInvitationStatus] = useMutation(UPDATE_INVITATION_STATUS);
  // const { data: subscriptionData } = useSubscription(
  //   UPDATE_INVITATION_STATUS_WS,
  //   {
  //     variables: { projectId: projectID, userId: session?.user?.id || "" },
  //     onSubscriptionData: ({ subscriptionData }) => {
  //       if (subscriptionData?.data) {
  //         const { invitationStatusChanged } = subscriptionData.data;
  //         console.log("Invitation status changed: ", invitationStatusChanged);
  //       }
  //     },
  //   }
  // );

  const [hoveredNotificationId, setHoveredNotificationId] = useState<
    string | null
  >(null);

  const handleMouseEnter = async (id: string) => {
    setHoveredNotificationId(id);
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

  if (loading) return <LoadingSpinner />;
  if (error)
    return <p className="text-center text-red-500">Error: {error.message}</p>;

  const notifications = data?.notifications || [];

  return (
    <div className="p-6 w-full min-h-screen mx-auto bg-white rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">
        Notifications
      </h2>
      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-80">
          <img
            src="https://cdn.dribbble.com/userupload/10956734/file/original-b27d8d4170aeda6c6effa5b3d2c1054d.png?resize=1600x1200"
            alt="No notifications"
            className="object-cover w-full max-w-xl rounded-md"
          />
          <span className="text-red-300 text-3xl uppercase">
            No new notifications
          </span>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification: any) => (
            <div
              key={notification.id}
              className={`p-4 border rounded-lg shadow-sm transition-transform  hover:scale-105 hover:shadow-md`}
              onMouseEnter={() => handleMouseEnter(notification.id)}
              role="button"
              tabIndex={0}
            >
              <p className="text-base">{notification.message}</p>
              <p className="text-sm mt-2 text-gray-500">
                <small>
                  At: {new Date(notification.createdAt).toLocaleString()}
                </small>
              </p>
              {notification.message.includes(
                "You have been invited to join the project"
              ) &&
                notification.read && (
                  <div className="mt-4 flex space-x-4">
                    <button
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                      onClick={() =>
                        handleAccept(notification.id, notification.projectId)
                      }
                    >
                      Accept
                    </button>
                    <button
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                      onClick={() =>
                        handleDecline(notification.id, notification.projectId)
                      }
                    >
                      Decline
                    </button>
                  </div>
                )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationList;
