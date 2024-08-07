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

const GET_CONVERSATION = gql`
  query Query {
    getConversationsByUserId {
      id
      participants {
        name
        image
        id
        uuid
      }
    }
  }
`;
export { CREATE_CONVERSATION, GET_CONVERSATION };
