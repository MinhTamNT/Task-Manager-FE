import React, { useEffect } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { useSession } from "next-auth/react";
import LoadingSpinner from "../Loading/Loading";

const GET_NOTIFICATIONS = gql`
  query Notifications {
    notifications {
      id
      message
      createdAt
      read
    }
  }
`;

const MARK_NOTIFICATION_AS_READ = gql`
  mutation MarkNotificationAsRead($id: ID!) {
    markNotificationAsRead(id: $id) {
      id
      read
    }
  }
`;

const NotificationList = () => {
  const { data: session } = useSession();
  const { data, loading, error } = useQuery(GET_NOTIFICATIONS, {
    context: {
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    },
  });

  const [markNotificationAsRead] = useMutation(MARK_NOTIFICATION_AS_READ, {
    context: {
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    },
  });

  useEffect(() => {
    if (data) {
      data.notifications.forEach((notification: any) => {
        if (!notification.read) {
          markNotificationAsRead({ variables: { id: notification.id } });
        }
      });
    }
  }, [data, markNotificationAsRead]);

  if (loading) return <LoadingSpinner />;
  if (error)
    return <p className="text-center text-red-500">Error: {error.message}</p>;

  const notifications = data?.notifications || [];

  return (
    <div className="p-6 max-w-full  bg-white rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Notifications</h2>
      {notifications.length === 0 ? (
        <img
          src="https://cdn.dribbble.com/userupload/10956734/file/original-b27d8d4170aeda6c6effa5b3d2c1054d.png?resize=1600x1200"
          alt="notification"
        />
      ) : (
        <ul className="space-y-4">
          {notifications.map((notification: any) => (
            <li
              key={notification.id}
              className={`w-full p-4 border rounded-lg ${
                notification.read
                  ? "bg-gray-200 text-gray-500 line-through"
                  : "bg-white text-gray-800"
              } shadow-sm hover:shadow-md transition-shadow`}
            >
              <p className="text-base">{notification.message}</p>
              <p className="text-sm mt-2 text-gray-500">
                <small>
                  At: {new Date(notification.createdAt).toLocaleString()}
                </small>
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationList;
