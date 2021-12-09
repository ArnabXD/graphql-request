import { GraphQLClient } from '../mod.ts'
import { setupTestServer } from './__helpers.ts'
import {
  assertEquals,
} from "https://deno.land/std@0.117.0/testing/asserts.ts";

const ctx0 = setupTestServer()
const ctx1 = setupTestServer()

Deno.test('using class', () => {
  Deno.test('.setEndpoint that send request to new server', async () => {
    assertEquals(ctx0.url, ctx1.url)
    const client = new GraphQLClient(ctx0.url)
    const mock0 = ctx0.res()
    const mock1 = ctx1.res()
    await client.request(`{ me { id } }`)
    assertEquals(mock0.requests.length, 1)
    assertEquals(mock1.requests.length, 0)
    client.setEndpoint(ctx1.url)
    await client.request(`{ test }`)
    assertEquals(mock0.requests.length, 1)
    assertEquals(mock1.requests.length, 1)
    await client.request(`{ test }`)
    assertEquals(mock0.requests.length, 1)
    assertEquals(mock1.requests.length, 2)
  })
})
