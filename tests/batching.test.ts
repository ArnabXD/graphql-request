import { batchRequests } from '../mod.ts'
import { setupTestServer, MockSpecBatch } from './__helpers.ts'
import {
  assertEquals,
} from "https://deno.land/std@0.117.0/testing/asserts.ts";

const ctx = setupTestServer<MockSpecBatch>()

Deno.test('minimal double query', async () => {
  const firstResult = { me: { id: 'some-id' } }
  const secondResult = { me: { id: 'another-id' } }
  const okq = ctx.res({
    body: [{ data: firstResult }, { data: secondResult }],
  })

  const [firstResponse, secondResponse] = await batchRequests(ctx.url, [
    { document: `{ me { id } }` },
    { document: `{ me { id } }` },
  ])

  assertEquals(firstResponse.data, firstResult)
  assertEquals(secondResponse.data, secondResult)
})

Deno.test('basic error', async () => {
  ctx.res({
    body: [
      {
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
    ],
  })

  await expect(batchRequests(ctx.url, [{ document: `x` }])).rejects.toMatchInlineSnapshot(
    `[Error: GraphQL Error (Code: 200): {"response":{"0":{"errors":{"message":"Syntax Error GraphQL request (1:1) Unexpected Name \\"x\\"\\n\\n1: x\\n   ^\\n","locations":[{"line":1,"column":1}]}},"status":200,"headers":{}},"request":{"query":["x"],"variables":[null]}}]`
  )
})

Deno.test('successful query with another which make an error', async () => {
  const firstResult = { data: { me: { id: 'some-id' } } }
  const secondResult = {
    errors: {
      message: 'Syntax Error GraphQL request (1:1) Unexpected Name "x"\n\n1: x\n   ^\n',
      locations: [
        {
          line: 1,
          column: 1,
        },
      ],
    },
  }

  ctx.res({
    body: [firstResult, secondResult],
  })

  await expect(
    batchRequests(ctx.url, [{ document: `{ me { id } }` }, { document: `x` }])
  ).rejects.toMatchInlineSnapshot(
    `[Error: GraphQL Error (Code: 200): {"response":{"0":{"data":{"me":{"id":"some-id"}}},"1":{"errors":{"message":"Syntax Error GraphQL request (1:1) Unexpected Name \\"x\\"\\n\\n1: x\\n   ^\\n","locations":[{"line":1,"column":1}]}},"status":200,"headers":{}},"request":{"query":["{ me { id } }","x"],"variables":[null,null]}}]`
  )
})

// test('basic error with raw request', async () => {
//   ctx.res({
//     body: {
//       errors: {
//         message: 'Syntax Error GraphQL request (1:1) Unexpected Name "x"\n\n1: x\n   ^\n',
//         locations: [
//           {
//             line: 1,
//             column: 1,
//           },
//         ],
//       },
//     },
//   })
//   const res = await rawRequest(ctx.url, `x`).catch((x) => x)
//   expect(res).toMatchInlineSnapshot(
//     `[Error: GraphQL Error (Code: 200): {"response":{"errors":{"message":"Syntax Error GraphQL request (1:1) Unexpected Name \\"x\\"\\n\\n1: x\\n   ^\\n","locations":[{"line":1,"column":1}]},"status":200,"headers":{}},"request":{"query":"x"}}]`
//   )
// })
