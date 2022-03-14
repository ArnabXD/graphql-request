import { GraphQLClient } from '../mod.ts'
  ; (async function () {
    const endpoint = 'https://fruits-api.netlify.app/graphql'

    const graphQLClient = new GraphQLClient(endpoint, {
      headers: {
        authorization: 'Bearer MY_TOKEN',
      },
    })

    const query = /* GraphQL */ `
    {
      filterFruitsFam(family: "Rosaceae") {
        id
        tree_name
        fruit_name
        family
      }
    }
  `

    interface Fruit {
      "id": string;
      "tree_name": string;
      "fruit_name": string;
      "family": string;
    }

    interface TData {
      filterFruitsFam: Fruit[]
    }

    const data = await graphQLClient.request<TData>(query)
    console.log(JSON.stringify(data, undefined, 2))
  })().catch((error) => console.error(error))
