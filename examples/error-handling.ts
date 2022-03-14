import { request } from '../src/index.ts'
  ; (async function () {
    const endpoint = 'https://fruits-api.netlify.app/graphql'

    const query = /* GraphQL */ `
    {
      filterFruitsFam(family: "Rosaceae") {
        id
        treename # "Cannot query field 'treename' on type 'Actor'. Did you mean 'tree_name'?"
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

    try {
      const data = await request<TData>(endpoint, query)
      console.log(JSON.stringify(data, undefined, 2))
    } catch (error) {
      console.error(JSON.stringify(error, undefined, 2))
      Deno.exit(1)
    }
  })().catch((error) => console.error(error))
