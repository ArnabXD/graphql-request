import * as Dom from '../src/types.dom.ts'
import { GraphQLClient, request } from '../mod.ts'
import { setupTestServer } from './__helpers.ts'

import {
  assertEquals,
} from "https://deno.land/std@0.129.0/testing/asserts.ts";

const ctx = setupTestServer()
const H = Headers;

Deno.test('using class', () => {
  Deno.test('.setHeader() sets a header that get sent to server', async () => {
    const client = new GraphQLClient(ctx.url)
    client.setHeader('x-foo', 'bar')
    const mock = ctx.res()
    await client.request(`{ me { id } }`)
    assertEquals(mock.requests[0].headers['x-foo'], 'bar')
  })

  Deno.test('.setHeaders() sets headers that get sent to the server', () => {
    Deno.test('with headers instance', async () => {
      const client = new GraphQLClient(ctx.url)
      client.setHeaders(new H({ 'x-foo': 'bar' }))
      const mock = ctx.res()
      await client.request(`{ me { id } }`)
      assertEquals(mock.requests[0].headers['x-foo'], 'bar')
    })
    Deno.test('with headers object', async () => {
      const client = new GraphQLClient(ctx.url)
      client.setHeaders({ 'x-foo': 'bar' })
      const mock = ctx.res()
      await client.request(`{ me { id } }`)
      assertEquals(mock.requests[0].headers['x-foo'], 'bar')
    })
    Deno.test('with header tuples', async () => {
      const client = new GraphQLClient(ctx.url)
      client.setHeaders([['x-foo', 'bar']])
      const mock = ctx.res()
      await client.request(`{ me { id } }`)
      assertEquals(mock.requests[0].headers['x-foo'], 'bar')
    })
  })

  Deno.test('custom header in the request', () => {
    describe.each([
      [new H({ 'x-request-foo': 'request-bar' })],
      [{ 'x-request-foo': 'request-bar' }],
      [[['x-request-foo', 'request-bar']]]
    ])('request unique header with request', (headerCase: Dom.RequestInit['headers']) => {

      Deno.test('with request method', async () => {
        const client = new GraphQLClient(ctx.url)

        client.setHeaders(new H({ 'x-foo': 'bar' }))
        const mock = ctx.res()
        await client.request(`{ me { id } }`, {}, headerCase)

        assertEquals(mock.requests[0].headers['x-foo'], 'bar')
        assertEquals(mock.requests[0].headers['x-request-foo'], 'request-bar')
      })

      Deno.test('with rawRequest method', async () => {
        const client = new GraphQLClient(ctx.url)

        client.setHeaders(new H({ 'x-foo': 'bar' }))
        const mock = ctx.res()
        await client.rawRequest(`{ me { id } }`, {}, headerCase)

        assertEquals(mock.requests[0].headers['x-foo'], 'bar')
        assertEquals(mock.requests[0].headers['x-request-foo'], 'request-bar')
      })
    })

    describe.each([
      [new H({ 'x-foo': 'request-bar' })],
      [{ 'x-foo': 'request-bar' }],
      [[['x-foo', 'request-bar']]]
    ])('request header overriding the client header', (headerCase: Dom.RequestInit['headers']) => {
      Deno.test('with request method', async () => {
        const client = new GraphQLClient(ctx.url)
        client.setHeader('x-foo', 'bar')
        const mock = ctx.res()
        await client.request(`{ me { id } }`, {}, headerCase);
        assertEquals(mock.requests[0].headers['x-foo'], 'request-bar')
      });

      Deno.test('with rawRequest method', async () => {
        const client = new GraphQLClient(ctx.url)
        client.setHeader('x-foo', 'bar')
        const mock = ctx.res()
        await client.rawRequest(`{ me { id } }`, {}, headerCase);
        assertEquals(mock.requests[0].headers['x-foo'], 'request-bar')
      });

    })
  })
})

Deno.test('using request function', () => {
  describe.each([
    [new H({ 'x-request-foo': 'request-bar' })],
    [{ 'x-request-foo': 'request-bar' }],
    [[['x-request-foo', 'request-bar']]]
  ])('request unique header with request', (headerCase: Dom.RequestInit['headers']) => {
    Deno.test('sets header', async () => {
      const mock = ctx.res()
      await request(ctx.url, `{ me { id } }`, {}, headerCase)

      assertEquals(mock.requests[0].headers['x-request-foo'], 'request-bar')
    });
  })
})
