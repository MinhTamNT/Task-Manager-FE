export const SEARCH_USER = `
query Query($name: String!) {
  searchUsersByName(name: $name) {
    name
    uuid
    id
    image
  }
}`;
