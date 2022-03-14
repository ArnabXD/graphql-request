import { GraphQLClient, rawRequest, request } from '../mod.ts'
import { setupTestServer } from './__helpers.ts'
import {
  assertEquals
} from "https://deno.land/std@0.129.0/testing/asserts.ts";
import { gql } from 'https://deno.land/x/graphql_tag@0.0.1/mod.ts'
import * as Dom from '../src/types.dom.ts'

const ctx = setupTestServer()

Deno.test('minimal query', async () => {
  const { data } = ctx.res({
    body: {
      data: {
        me: {
          id: 'some-id',
        },
      },
    },
  }).spec.body!

  assertEquals(await request(ctx.url, `{ me { id } }`), data)
})

Deno.test('minimal raw query', async () => {
  const { extensions, data } = ctx.res({
    body: {
      data: {
        me: {
          id: 'some-id',
        },
      },
      extensions: {
        version: '1',
      },
    },
  }).spec.body!
  const { headers, ...result } = await rawRequest(ctx.url, `{ me { id } }`)
  assertEquals(result, { data, extensions, status: 200 })
})

Deno.test('minimal raw query with response headers', async () => {
  const { headers: reqHeaders, body } = ctx.res({
    headers: {
      'Content-Type': 'application/json',
      'X-Custom-Header': 'test-custom-header',
    },
    body: {
      data: {
        me: {
          id: 'some-id',
        },
      },
      extensions: {
        version: '1',
      },
    },
  }).spec

  const { headers, ...result } = await rawRequest(ctx.url, `{ me { id } }`)

  assertEquals(result, { ...body, status: 200 })
  assertEquals(headers.get('X-Custom-Header'), reqHeaders!['X-Custom-Header'])
})

Deno.test('content-type with charset', async () => {
  const { data } = ctx.res({
    // headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: {
      data: {
        me: {
          id: 'some-id',
        },
      },
    },
  }).spec.body!

  assertEquals(await request(ctx.url, `{ me { id } }`), data)
})

Deno.test('basic error', async () => {
  ctx.res({
    body: {
      errors: {
        message: 'Syntax Error GraphQL request (1:1) Unexpected Name "x"\n\n1: x\n   ^\n',
        locations: [
          {
            line: 1,
            column: 1,
          },
        ],
      },
    },
  })

  const res = await request(ctx.url, `x`).catch((x) => x)

  // toMatchInlineSnapshot
  assertEquals(res,
    `[Error: GraphQL Error (Code: 200): {"response":{"errors":{"message":"Syntax Error GraphQL request (1:1) Unexpected Name \\"x\\"\\n\\n1: x\\n   ^\\n","locations":[{"line":1,"column":1}]},"status":200,"headers":{}},"request":{"query":"x"}}]`
  )
})

Deno.test('basic error with raw request', async () => {
  ctx.res({
    body: {
      errors: {
        message: 'Syntax Error GraphQL request (1:1) Unexpected Name "x"\n\n1: x\n   ^\n',
        locations: [
          {
            line: 1,
            column: 1,
          },
        ],
      },
    },
  })
  const res = await rawRequest(ctx.url, `x`).catch((x) => x)
  // toMatchInlineSnapshot
  assertEquals(res,
    `[Error: GraphQL Error (Code: 200): {"response":{"errors":{"message":"Syntax Error GraphQL request (1:1) Unexpected Name \\"x\\"\\n\\n1: x\\n   ^\\n","locations":[{"line":1,"column":1}]},"status":200,"headers":{}},"request":{"query":"x"}}]`
  )
})

// todo needs to be tested in browser environment
// the options under test here aren't used by node-fetch
Deno.test('extra fetch options', async () => {
  const options: Dom.RequestInit = {
    credentials: 'include',
    mode: 'cors',
    cache: 'reload',
  }

  const client = new GraphQLClient(ctx.url, options)
  const { requests } = ctx.res({
    body: { data: { test: 'test' } },
  })
  await client.request('{ test }')
  // toMatchInlineSnapshot
  assertEquals(requests, `
    Array [
      Object {
        "body": Object {
          "query": "{ test }",
        },
        "headers": Object {
          "accept": "*/*",
          "accept-encoding": "gzip,deflate",
          "connection": "close",
          "content-length": "20",
          "content-type": "application/json",
          "host": "localhost:3210",
          "user-agent": "node-fetch/1.0 (+https://github.com/bitinn/node-fetch)",
        },
        "method": "POST",
      },
    ]
  `)
})

Deno.test('case-insensitive content-type header for custom fetch', async () => {
  const testData = { data: { test: 'test' } }
  const testResponseHeaders = new Map()
  testResponseHeaders.set('ConTENT-type', 'apPliCatiON/JSON')

  const options: Dom.RequestInit = {
    fetch: function (url: string) {
      return Promise.resolve({
        headers: testResponseHeaders,
        data: testData,
        json: function () {
          return testData
        },
        text: function () {
          return JSON.stringify(testData)
        },
        ok: true,
        status: 200,
        url,
      })
    },
  }

  const client = new GraphQLClient(ctx.url, options)
  const result = await client.request('{ test }')

  assertEquals(result, testData.data)
})

Deno.test('operationName parsing', () => {
  Deno.test('should work for gql documents', async () => {
    const mock = ctx.res({ body: { data: { foo: 1 } } })
    await request(
      ctx.url,
      gql`
        query myGqlOperation {
          users
        }
      `
    )

    const requestBody = mock.requests[0].body
    assertEquals(requestBody.operationName, 'myGqlOperation')
  })

  Deno.test('should work for string documents', async () => {
    const mock = ctx.res({ body: { data: { foo: 1 } } })
    await request(
      ctx.url,
      `
        query myStringOperation {
          users
        }
      `
    )

    const requestBody = mock.requests[0].body
    assertEquals(requestBody.operationName, 'myStringOperation')
  })
})
