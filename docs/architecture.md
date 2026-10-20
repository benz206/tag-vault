# Architecture

TagVault is a Next.js App Router app backed by MongoDB, organised as a bun
workspace.

```
src/            Next.js app
  app/          routes, layouts, route handlers and server actions
  components/   UI components (client components are marked 'use client')
  lib/          app-level server helpers (auth, owner resolution)
  utils/        small pure helpers (dates, tag colors)
packages/
  db/           @tag-vault/db: Mongo client, types and every query/mutation
  tagscript/    @tag-vault/tagscript: TagScript tokenizer used for highlighting
scripts/        one-off maintenance scripts (run with bun)
docs/           this documentation
```

## Rendering

- Pages are server components that call `@tag-vault/db` directly. There are
  no client-side data fetches for page content.
- `/` is statically rendered and revalidated every five minutes.
- `/search`, `/dashboard` and `/tags/[id]` render per request. `/search`
  reads `?q=` on the server and the search box updates the URL as you type.
  Search is open to everyone and limited to 30 searches a minute per signed-in
  user or per IP (`src/lib/rateLimit.ts`), shared by the page and the command
  menu's `/api/tags/search/[search]`.
- Mutations (favorite, hide, delete) are server actions in
  `src/app/tags/[id]/actions.ts` and re-check ownership on the server.
- The remaining route handlers serve the browser only: next-auth, `/api/alive`,
  `/api/tags/search/[search]` for the command menu and `/api/tags/random`.

## Tag owners

Owner names and avatars come from Discord and are cached in the `Users`
collection (`packages/db/src/owners.ts`):

- Owners are resolved in one query per page and attached to each tag.
- Uncached owners are fetched inline within an 800ms budget; stale entries
  (older than three days) are refreshed after the response with `after()`.
- Concurrent lookups for the same user are deduplicated, Discord 404s are
  cached as unknown users and 429s pause lookups until `retry-after`.
- The avatar component falls back to the user's default avatar if a cached
  avatar hash no longer exists.

## Removed and hidden tags

See [data-model.md](data-model.md). Public lists exclude tombstoned and hidden
tag IDs as well as Carl-bot's "tag was not found" placeholder content.
