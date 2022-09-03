import { GraphQLClient } from "../mod.ts";
(async function () {
  const endpoint = "https://fruits-api.netlify.app/graphql";

  const client = new GraphQLClient(endpoint, {
    headers: {
      authorization: "Bearer MY_TOKEN",
    },
  });

  const query = /* GraphQL */ `
    {
      filterFruitsFam(family: "Rosaceae") {
        id
        tree_name
        fruit_name
        family
      }
    }`;

  const requestHeaders = {
    authorization: "Bearer MY_TOKEN_2",
    "x-custom": "foo",
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

  const data = await client.request<TData>(query, {}, requestHeaders);
  console.log(JSON.stringify(data, undefined, 2));
})().catch((error) => console.error(error));
