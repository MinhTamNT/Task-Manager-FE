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

export { INVITATION_RECEIVED_SUBSCRIPTION, NOTIFICATION_CREATED_SUBSCRIPTION };
