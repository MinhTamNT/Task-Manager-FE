import { gql } from "@apollo/client";

export const SEARCH_USER = `
query Query($name: String!) {
  searchUsersByName(name: $name) {
    name
    uuid
    id
    image
  }
}`;

export const SEARCH_USER_BY_NAME = gql`
  query Query($name: String!) {
    searchUsersByName(name: $name) {
      name
      uuid
      id
      image
    }
  }
`;
