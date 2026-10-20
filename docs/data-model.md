# Data model

All collections live in the database named by `MONGODB_URI` (default `TagDB`).
Run `bun run db:indexes` after setting up a new database.

| Collection    | Written by        | Contents                                                                                  |
| ------------- | ----------------- | ----------------------------------------------------------------------------------------- |
| `Tags`        | Scraper, TagVault | One document per Carl-bot tag. TagVault only deletes from it.                             |
| `Users`       | TagVault          | Discord owner cache: `id`, `username`, `global_name`, `avatar`, `missing`, `lastFetched`. |
| `RemovedTags` | TagVault          | Tombstones: `id`, `owner_id`, `reason` (`not_found` or `owner_request`), `removed_at`.    |
| `HiddenTags`  | TagVault          | Tags their owner hid: `id`, `owner_id`, `hidden_at`.                                      |
| `Favorites`   | TagVault          | `user_id`, `tag_id`, `created_at`. Unique per user and tag.                               |
| `RateLimits`  | TagVault          | Per-minute request counters: `_id` (key and window), `count`, `expires_at` (TTL).         |

## Removal

A tag is removed when its owner deletes it or when its content is Carl-bot's
`Sorry! It doesn't seem like your tag was found...` placeholder (checked when
the tag is opened). Removal deletes the `Tags` document and its favorites and
writes a `RemovedTags` tombstone, so the tag stays hidden even if the scraper
re-adds it. The scraper should skip IDs present in `RemovedTags`.

## Visibility

A tag is shown publicly when it is not deleted, not NSFW, not `not_safe`, not
hidden and not tombstoned. Owners can still open their own deleted, NSFW and
hidden tags.
