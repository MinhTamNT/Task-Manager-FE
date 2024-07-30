import { gql } from "@apollo/client";

const ADD_MUTATION_NEW_PORJECT = `
mutation AddProject($name: String!,$description: String) {
  addProject(name: $name , description: $description) {
    name
    members {
      name
    }
  }
}
`;

const GET_PROJECT = `
query Query {
  project {
    id
    status
    name
    author {
      name
    }
    description
  }
}
`;

const DELETE_PROJECT = `
mutation DeleteProject($deleteProjectId: ID!) {
  deleteProject(id: $deleteProjectId) {
    name
  }
}
`;
const GET_PROJECT_BY_ID = gql`
  query GetProjectById($getProjectByIdId: ID!) {
    getProjectById(id: $getProjectByIdId) {
      id
      name
      description
    }
  }
`;
const PROJECT_UPDATED = gql`
  subscription OnProjectUpdated($projectId: ID!) {
    projectUpdated(projectId: $projectId) {
      id
      name
      description
    }
  }
`;

const INVITE_USER = gql`
  mutation InviteUser($projectId: ID!, $userId: ID!) {
    inviteUser(projectId: $projectId, userId: $userId) {
      id
      name
      invitations {
        userId
        status
      }
    }
  }
`;
export {
  ADD_MUTATION_NEW_PORJECT,
  GET_PROJECT,
  DELETE_PROJECT,
  GET_PROJECT_BY_ID,
  PROJECT_UPDATED,
  INVITE_USER,
};
