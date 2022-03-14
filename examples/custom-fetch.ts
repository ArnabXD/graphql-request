import { GraphQLClient } from '../mod.ts'
import { wrapFetch } from 'https://deno.land/x/fetch_goody@v5.0.1/mod.ts';

const start = async () => {
  const endpoint = 'https://fruits-api.netlify.app/graphql'

  const graphQLClient = new GraphQLClient(endpoint, { fetch: wrapFetch() })

  const query = /* GraphQL */ `
    {
      filterFruitsFam(family: "Rosaceae") {
        id
        tree_name
        fruit_name
        family
      }
    }`

  interface Fruit {
    "id": string;
    "tree_name": string;
    "fruit_name": string;
    "family": string;
  }

  interface TData {
    filterFruitsFam: Fruit[]
  }

  const data = await graphQLClient.rawRequest<TData>(query)
  console.log(JSON.stringify(data, undefined, 2))
}

start().catch((error) => console.error(error))
