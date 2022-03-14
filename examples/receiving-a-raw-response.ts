import { rawRequest } from '../src/index.ts'
  ; (async function () {
    const endpoint = 'https://fruits-api.netlify.app/graphql'

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

    const { data, extensions, headers, status } = await rawRequest<TData>(endpoint, query)
    console.log(JSON.stringify({ data, extensions, headers, status }, undefined, 2))
  })().catch((error) => console.error(error))
