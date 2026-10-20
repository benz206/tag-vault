import { connectToMongo } from '@tag-vault/db';

export async function GET() {
  try {
    await connectToMongo();
    return Response.json({ alive: true });
  } catch {
    return Response.json({ alive: false }, { status: 503 });
  }
}
