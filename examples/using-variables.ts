import { request } from "../mod.ts";
(async function () {
  const endpoint = "https://fruits-api.netlify.app/graphql";

  const query = /* GraphQL */ `
    query filterFruit($family: String!) {
      filterFruitsFam(family: $family) {
        id
        tree_name
        fruit_name
        family
      }
    }`;

  const variables = {
    family: "Rosaceae",
  };

  interface Fruit {
    "id": string;
    "tree_name": string;
    "fruit_name": string;
    "family": string;
  }

  interface TData {
    filterFruitsFam: Fruit[];
  }

  const data = await request<TData>(endpoint, query, variables);
  console.log(JSON.stringify(data, undefined, 2));
})().catch((error) => console.error(error));
