import { rawRequest } from '../src/index.ts'
;(async function () {
  const endpoint = 'https://api.graph.cool/simple/v1/cixos23120m0n0173veiiwrjr'

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

  const { data, extensions, headers, status } = await rawRequest<TData>(endpoint, query)
  console.log(JSON.stringify({ data, extensions, headers, status }, undefined, 2))
})().catch((error) => console.error(error))
