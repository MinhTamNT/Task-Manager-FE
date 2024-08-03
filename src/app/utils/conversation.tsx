import { gql } from "@apollo/client";

const CREATE_CONVERSATION = gql`
  mutation CreateConversation($participants: [ID!]!) {
    createConversation(participants: $participants) {
      id
      createdAt
      participants {
        name
        image
        id
      }
    }
  }
`;

const GET_NOTIFICATION = gql`
  query GetConversationById($getConversationByIdId: ID!) {
    getConversationById(id: $getConversationByIdId) {
      participants {
        name
        id
        image
      }
    }
  }
`;
export { CREATE_CONVERSATION, GET_NOTIFICATION };
