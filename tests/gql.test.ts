import gql from 'graphql-tag'
import { request } from '../mod.ts'
import { setupTestServer } from './__helpers.ts'

const ctx = setupTestServer()

Deno.test('gql', () => {
  Deno.test('passthrough allowing benefits of tooling for gql template tag', async () => {
    const mock = ctx.res({ body: { data: { foo: 1 } } })
    await request(
      ctx.url,
      gql`query allUsers {
  users
}
`
    )
    expect(mock).toMatchSnapshot()
  })
})
