const ADD_MUTATION_NEW_PORJECT = `
mutation AddProject($name: String!) {
  addProject(name: $name) {
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

export { ADD_MUTATION_NEW_PORJECT, GET_PROJECT };
