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
const GET_PROJECT_BY_ID = `

 mutation GetProjectById($getProjectByIdId: ID!) {
  getProjectById(id: $getProjectByIdId) {
    name
    members {
      name
    }
    author {
      name
    }
  }
}
 `;

export {
  ADD_MUTATION_NEW_PORJECT,
  GET_PROJECT,
  DELETE_PROJECT,
  GET_PROJECT_BY_ID,
};
