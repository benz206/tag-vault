// Creates the MongoDB indexes TagVault relies on. Safe to re-run: existing
// indexes with the same definition are left untouched.
// Usage: bun run db:indexes
import { connectToMongo, ensureIndexes } from '@tag-vault/db';

const created = await ensureIndexes();
for (const [collection, names] of Object.entries(created)) {
  console.log(`${collection}: ${names.join(', ')}`);
}
await (await connectToMongo()).close();
