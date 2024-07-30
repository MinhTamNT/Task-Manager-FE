import { gql } from "@apollo/client";

const INVITATION_RECEIVED_SUBSCRIPTION = gql`
  subscription Subscription($projectId: ID!) {
    invitationReceived(projectId: $projectId) {
      id
      name
      invitations {
        userId
        status
      }
      author {
        name
        id
        image
      }
    }
  }
`;

const NOTIFICATION_CREATED_SUBSCRIPTION = gql`
  subscription OnNotificationCreated {
    notificationCreated {
      userId
      message
      createdAt
    }
  }
`;

const GET_NOTIFICATIONS = gql`
  query Notifications {
    notifications {
      id
      message
      createdAt
      read
      projectId
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
const UPDATE_INVITATION_STATUS_WS = gql`
  subscription UpdateInvitationStatus($projectId: ID!, $userId: ID!) {
    invitationStatusChanged(projectId: $projectId, userId: $userId) {
      id
      status
      updatedAt
    }
  }
`;
const UPDATE_INVITATION_STATUS = gql`
  mutation Mutation($projectId: ID!, $status: InvitationStatus!) {
    updateInvitationStatus(projectId: $projectId, status: $status) {
      status
    }
  }
`;

export {
  INVITATION_RECEIVED_SUBSCRIPTION,
  NOTIFICATION_CREATED_SUBSCRIPTION,
  GET_NOTIFICATIONS,
  MARK_NOTIFICATION_AS_READ,
  UPDATE_INVITATION_STATUS,
  UPDATE_INVITATION_STATUS_WS,
};
