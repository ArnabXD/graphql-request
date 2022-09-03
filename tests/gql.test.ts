import { gql } from "https://deno.land/x/graphql_tag@0.0.1/mod.ts";
import { request } from "../mod.ts";
import { setupTestServer } from "./__helpers.ts";

const ctx = setupTestServer();

Deno.test("gql", () => {
  Deno.test("passthrough allowing benefits of tooling for gql template tag", async () => {
    const mock = ctx.res({ body: { data: { foo: 1 } } });
    await request(
      ctx.url,
      gql`query allUsers {
  users
}
`,
    );
    expect(mock).toMatchSnapshot();
  });
});
