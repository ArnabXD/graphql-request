# graphql-request

[graphql-request](https://github.com/prisma-labs/graphql-request/) is a GraphQL
client supporting Node and browsers for scripts or simple apps.

Now it also supports Deno 🦕

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [graphql-request](#graphql-request)
  - [Features](#features)
  - [Quickstart](#quickstart)
  - [Usage](#usage)
  - [Community](#community)
    - [GraphQL Code Generator's GraphQL-Request TypeScript Plugin](#graphql-code-generators-graphql-request-typescript-plugin)
  - [Examples](#examples)
    - [Authentication via HTTP header](#authentication-via-http-header)
      - [Incrementally setting headers](#incrementally-setting-headers)
      - [Set endpoint](#set-endpoint)
      - [passing-headers-in-each-request](#passing-headers-in-each-request)
    - [Passing more options to `fetch`](#passing-more-options-to-fetch)
    - [Using GraphQL Document variables](#using-graphql-document-variables)
    - [GraphQL Mutations](#graphql-mutations)
    - [Error handling](#error-handling)
    - [Using a custom `fetch` method](#using-a-custom-fetch-method)
    - [Receiving a raw response](#receiving-a-raw-response)
    - [File Upload](#file-upload)
      - [Browser](#browser)
      - [Node](#node)
      - [Deno](#deno)
    - [Batching](#batching)
    - [Cancellation](#cancellation)
  - [FAQ](#faq)
      - [Why do I have to install `graphql`?](#why-do-i-have-to-install-graphql)
      - [Do I need to wrap my GraphQL documents inside the `gql` template exported by `graphql-request`?](#do-i-need-to-wrap-my-graphql-documents-inside-the-gql-template-exported-by-graphql-request)
      - [What's the difference between `graphql-request`, Apollo and Relay?](#whats-the-difference-between-graphql-request-apollo-and-relay)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Features

- Most **simple & lightweight** GraphQL client
- Promise-based API (works with `async` / `await`)
- TypeScript support
- Isomorphic (works with Node / browsers)

## Quickstart

Send a GraphQL query with a single line of code. ▶️
[Try it out](https://runkit.com/593130bdfad7120012472003/593130bdfad7120012472004).

```ts
import { gql, request } from "https://deno.land/x/graphql_request/mod.ts";

const query = gql`
  {
    Movie(title: "Inception") {
      releaseDate
      actors {
        name
      }
    }
  }
`;

const data = await request("https://api.graph.cool/simple/v1/movies", query);

console.log(data);
```

## Usage

```ts
import {
  GraphQLClient,
  request,
} from "https://deno.land/x/graphql_request/mod.ts";

// Run GraphQL queries/mutations using a static function
const data = await request(endpoint, query, variables);
console.log(data);

// ... or create a GraphQL client instance to send requests
const client = new GraphQLClient(endpoint, { headers: {} });
const data = client.request(query, variables);
console.log(data);
```

## Community

### GraphQL Code Generator's GraphQL-Request TypeScript Plugin

A
[GraphQL-Codegen plugin](https://graphql-code-generator.com/docs/plugins/typescript-graphql-request)
that generates a `graphql-request` ready-to-use SDK, which is fully-typed.

## Examples

### Authentication via HTTP header

```ts
import { gql, GraphQLClient } from "https://deno.land/x/graphql_request/mod.ts";

const main = async () => {
  const endpoint = "https://api.graph.cool/simple/v1/cixos23120m0n0173veiiwrjr";

  const graphQLClient = new GraphQLClient(endpoint, {
    headers: {
      authorization: "Bearer MY_TOKEN",
    },
  });

  const query = gql`
    {
      Movie(title: "Inception") {
        releaseDate
        actors {
          name
        }
      }
    }
  `;

  const data = await graphQLClient.request(query);
  console.log(JSON.stringify(data, undefined, 2));
};

try {
  main();
} catch (error) {
  console.error(error);
}
```

[TypeScript Source](examples/authentication-via-http-header.ts)

```bash
deno run --allow-net examples/authentication-via-http-header.ts
```

#### Incrementally setting headers

If you want to set headers after the GraphQLClient has been initialised, you can
use the `setHeader()` or `setHeaders()` functions.

```ts
import { GraphQLClient } from "https://deno.land/x/graphql_request/mod.ts";

const client = new GraphQLClient(endpoint);

// Set a single header
client.setHeader("authorization", "Bearer MY_TOKEN");

// Override all existing headers
client.setHeaders({
  authorization: "Bearer MY_TOKEN",
  anotherheader: "header_value",
});
```

#### Set endpoint

If you want to change the endpoint after the GraphQLClient has been initialized,
you can use the `setEndpoint()` function.

```ts
import { GraphQLClient } from "https://deno.land/x/graphql_request/mod.ts";

const client = new GraphQLClient(endpoint);

client.setEndpoint(newEndpoint);
```

#### passing-headers-in-each-request

It is possible to pass custom headers for each request. `request()` and
`rawRequest()` accept a header object as the third parameter

```ts
import { GraphQLClient } from "https://deno.land/x/graphql_request/mod.ts";

const client = new GraphQLClient(endpoint);

const query = gql`
  query getMovie($title: String!) {
    Movie(title: $title) {
      releaseDate
      actors {
        name
      }
    }
  }
`;

const variables = {
  title: "Inception",
};

const requestHeaders = {
  authorization: "Bearer MY_TOKEN",
};

// Overrides the clients headers with the passed values
const data = await client.request(query, variables, requestHeaders);
```

### Passing more options to `fetch`

```ts
import { gql, GraphQLClient } from "https://deno.land/x/graphql_request/mod.ts";

const main = async () => {
  const endpoint = "https://api.graph.cool/simple/v1/cixos23120m0n0173veiiwrjr";

  const graphQLClient = new GraphQLClient(endpoint, {
    credentials: "include",
    mode: "cors",
  });

  const query = gql`
    {
      Movie(title: "Inception") {
        releaseDate
        actors {
          name
        }
      }
    }
  `;

  const data = await graphQLClient.request(query);
  console.log(JSON.stringify(data, undefined, 2));
};

try {
  main();
} catch (error) {
  console.error(error);
}
```

[TypeScript Source](examples/passing-more-options-to-fetch.ts)

```bash
deno run --allow-net examples/passing-more-options-to-fetch.ts
```

### Using GraphQL Document variables

```ts
import { gql, request } from "https://deno.land/x/graphql_request/mod.ts";

const main = async () => {
  const endpoint = "https://api.graph.cool/simple/v1/cixos23120m0n0173veiiwrjr";

  const query = gql`
    query getMovie($title: String!) {
      Movie(title: $title) {
        releaseDate
        actors {
          name
        }
      }
    }
  `;

  const variables = {
    title: "Inception",
  };

  const data = await request(endpoint, query, variables);
  console.log(JSON.stringify(data, undefined, 2));
};

try {
  main();
} catch (error) {
  console.error(error);
}
```

### GraphQL Mutations

```ts
import { gql, GraphQLClient } from "https://deno.land/x/graphql_request/mod.ts";

const main = async () => {
  const endpoint = "https://api.graph.cool/simple/v1/cixos23120m0n0173veiiwrjr";

  const graphQLClient = new GraphQLClient(endpoint, {
    headers: {
      authorization: "Bearer MY_TOKEN",
    },
  });

  const mutation = gql`
    mutation AddMovie($title: String!, $releaseDate: Int!) {
      insert_movies_one(object: { title: $title, releaseDate: $releaseDate }) {
        title
        releaseDate
      }
    }
  `;

  const variables = {
    title: "Inception",
    releaseDate: 2010,
  };
  const data = await graphQLClient.request(mutation, variables);

  console.log(JSON.stringify(data, undefined, 2));
};

try {
  main();
} catch (error) {
  console.error(error);
}
```

[TypeScript Source](examples/using-variables.ts)

```bash
deno run --allow-net examples/using-variables.ts
```

### Error handling

```ts
import { gql, request } from "https://deno.land/x/graphql_request/mod.ts";

const main = async () => {
  const endpoint = "https://api.graph.cool/simple/v1/cixos23120m0n0173veiiwrjr";

  const query = gql`
    {
      Movie(title: "Inception") {
        releaseDate
        actors {
          fullname # "Cannot query field 'fullname' on type 'Actor'. Did you mean 'name'?"
        }
      }
    }
  `;

  try {
    const data = await request(endpoint, query);
    console.log(JSON.stringify(data, undefined, 2));
  } catch (error) {
    console.error(JSON.stringify(error, undefined, 2));
    process.exit(1);
  }
};

try {
  main();
} catch (error) {
  console.error(error);
}
```

[TypeScript Source](examples/error-handling.ts)

```bash
deno run --allow-net examples/error-handling.ts
```

### Using a custom `fetch` method

```ts
import { GraphQLClient } from "https://deno.land/x/graphql_request/mod.ts";
import { wrapFetch } from "https://deno.land/x/fetch_goody@v5.0.0/mod.ts";

const main = async () => {
  const endpoint = "https://api.graph.cool/simple/v1/cixos23120m0n0173veiiwrjr";

  const graphQLClient = new GraphQLClient(endpoint, { fetch: wrapFetch() });

  const query = /* GraphQL */ `
    {
      Movie(title: "Inception") {
        releaseDate
        actors {
          name
        }
      }
    }
  `;

  interface TData {
    Movie: { releaseDate: string; actors: Array<{ name: string }> };
  }

  const data = await graphQLClient.rawRequest<TData>(query);
  console.log(JSON.stringify(data, undefined, 2));
};

try {
  main();
} catch (error) {
  console.error(error);
}
```

### Receiving a raw response

The `request` method will return the `data` or `errors` key from the response.
If you need to access the `extensions` key you can use the `rawRequest` method:

```ts
import { gql, rawRequest } from "https://deno.land/x/graphql_request/mod.ts";

const main = async () => {
  const endpoint = "https://api.graph.cool/simple/v1/cixos23120m0n0173veiiwrjr";

  const query = gql`
    {
      Movie(title: "Inception") {
        releaseDate
        actors {
          name
        }
      }
    }
  `;

  const { data, errors, extensions, headers, status } = await rawRequest(
    endpoint,
    query,
  );
  console.log(
    JSON.stringify({ data, errors, extensions, headers, status }, undefined, 2),
  );
};

try {
  main();
} catch (error) {
  console.error(error);
}
```

[TypeScript Source](examples/receiving-a-raw-response.ts)

```bash
deno run --allow-net examples/receiving-a-raw-response.ts
```

### File Upload

#### Browser

```ts
import { request } from "graphql-request";

const UploadUserAvatar = gql`
  mutation uploadUserAvatar($userId: Int!, $file: Upload!) {
    updateUser(id: $userId, input: { avatar: $file })
  }
`;

request("/api/graphql", UploadUserAvatar, {
  userId: 1,
  file: document.querySelector("input#avatar").files[0],
});
```

#### Node

```ts
import { createReadStream } from "fs";
import { request } from "graphql-request";

const UploadUserAvatar = gql`
  mutation uploadUserAvatar($userId: Int!, $file: Upload!) {
    updateUser(id: $userId, input: { avatar: $file })
  }
`;

request("/api/graphql", UploadUserAvatar, {
  userId: 1,
  file: createReadStream("./avatar.img"),
});
```

#### Deno

```ts
import { readableStreamFromReader as toStream } from "https://deno.land/std/io/mod.ts";
import { request } from "https://deno.land/x/graphql_request/mod.ts";

const UploadUserAvatar = gql`
  mutation uploadUserAvatar($userId: Int!, $file: Upload!) {
    updateUser(id: $userId, input: { avatar: $file })
  }
`;

request("/api/graphql", UploadUserAvatar, {
  userId: 1,
  file: toStream(await Deno.open(("./avatar.img")),
});
```

### Batching

It is possible with `graphql-request` to use
[batching](https://github.com/graphql/graphql-over-http/blob/main/rfcs/Batching.md)
via the `batchRequests()` function. Example available at
[examples/batching-requests.ts](examples/batching-requests.ts)

```ts
import { batchRequests } from "https://deno.land/x/graphql_request/mod.ts";

const main = async () => {
  const endpoint = "https://api.spacex.land/graphql/";

  const query1 = /* GraphQL */ `
    query ($id: ID!) {
      capsule(id: $id) {
        id
        landings
      }
    }
  `;

  const query2 = /* GraphQL */ `
    {
      rockets(limit: 10) {
        active
      }
    }
  `;

  const data = await batchRequests(endpoint, [
    { document: query1, variables: { id: "C105" } },
    { document: query2 },
  ]);
  console.log(JSON.stringify(data, undefined, 2));
};

try {
  main();
} catch (error) {
  console.error(error);
}
```

[TypeScript Source](examples/batching-requests.ts)

```bash
deno run --allow-net examples/batching-requests.ts
```

### Cancellation

It is possible to cancel a request using an `AbortController` signal.

You can define the `signal` in the `GraphQLClient` constructor:

```ts
const abortController = new AbortController();

const client = new GraphQLClient(endpoint, { signal: abortController.signal });
client.request(query);

abortController.abort();
```

You can also set the signal per request (this will override an existing
GraphQLClient signal):

```ts
const abortController = new AbortController();

const client = new GraphQLClient(endpoint);
client.request({ document: query, signal: abortController.signal });

abortController.abort();
```

In Node environment, `AbortController` is supported since version v14.17.0. For
Node.js v12 you can use
[abort-controller](https://github.com/mysticatea/abort-controller) polyfill.

```
 import 'abort-controller/polyfill'

 const abortController = new AbortController()
```

## FAQ

#### Why do I have to install `graphql`?

`graphql-request` uses methods exposed by the `graphql` package to handle some
internal logic. On top of that, for TypeScript users, some types are used from
the `graphql` package to provide better typings.

#### Do I need to wrap my GraphQL documents inside the `gql` template exported by `graphql-request`?

No. It is there for convenience so that you can get the tooling support like
prettier formatting and IDE syntax highlighting. You can use `gql` from
`graphql-tag` if you need it for some reason too.

#### What's the difference between `graphql-request`, Apollo and Relay?

`graphql-request` is the most minimal and simplest to use GraphQL client. It's
perfect for small scripts or simple apps.

Compared to GraphQL clients like Apollo or Relay, `graphql-request` doesn't have
a built-in cache and has no integrations for frontend frameworks. The goal is to
keep the package and API as minimal as possible.
