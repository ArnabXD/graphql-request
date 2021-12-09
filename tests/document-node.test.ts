import graphqlTag from 'graphql-tag'
import { request } from '../mod.ts'
import { setupTestServer } from './__helpers.ts'

const ctx = setupTestServer()

Deno.test('accepts graphql DocumentNode as alternative to raw string', async () => {
  const mock = ctx.res({ body: { data: { foo: 1 } } })
  await request(
    ctx.url,
    graphqlTag`
        {
          query {
            users
          }
        }
      `
  )
  expect(mock).toMatchSnapshot()
})
