import { gql } from "@apollo/client";

const GET_TASK_LIST = gql`
  query Query($projectId: ID!) {
    getTaskByProject(projectId: $projectId) {
      id
      title
      status
      dueDate
      description
      assignee {
        image
        id
        name
      }
    }
  }
`;

const ADD_NEW_TASK = gql`
  mutation AddTask(
    $title: String!
    $project: ID!
    $description: String
    $assignedTo: [ID!]
    $dueDate: Date
    $status: String
  ) {
    addTask(
      title: $title
      project: $project
      description: $description
      assignedTo: $assignedTo
      dueDate: $dueDate
      status: $status
    ) {
      title
      status
      project
      id
      dueDate
      description
      assignee {
        name
        id
      }
    }
  }
`;

export { GET_TASK_LIST, ADD_NEW_TASK };
