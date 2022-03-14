import { GraphQLClient } from '../src/index.ts'
import { wrapFetch } from 'https://deno.land/x/fetch_goody@v5.0.0/mod.ts';

const start = async () => {
  const endpoint = 'https://api.graph.cool/simple/v1/cixos23120m0n0173veiiwrjr'

  const graphQLClient = new GraphQLClient(endpoint, { fetch: wrapFetch() })

  const query = /* GraphQL */ `
    {
      Movie(title: "Inception") {
        releaseDate
        actors {
          name
        }
      }
    }
  `

  interface TData {
    Movie: { releaseDate: string; actors: Array<{ name: string }> }
  }

  const data = await graphQLClient.rawRequest<TData>(query)
  console.log(JSON.stringify(data, undefined, 2))
}

start().catch((error) => console.error(error))
