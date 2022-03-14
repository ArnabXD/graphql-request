import { GraphQLClient } from '../mod.ts'
import { setupTestServer } from './__helpers.ts'
import {
    assert,
} from "https://deno.land/std@0.129.0/testing/asserts.ts";


const ctx = setupTestServer()

Deno.test('with custom fetch', async () => {
    let touched = false;
    // wrap fetch in a custom method
    const customFetch = function (input: RequestInfo, init?: RequestInit) {
        touched = true
        return fetch(input, init)
    }
    const client = new GraphQLClient(ctx.url, { fetch: customFetch })
    const mock = ctx.res()
    await client.request(`{ me { id } }`)
    assert(touched)
})
