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

export { INVITATION_RECEIVED_SUBSCRIPTION };
