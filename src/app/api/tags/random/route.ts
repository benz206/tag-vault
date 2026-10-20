import { findRandomTagId } from '@tag-vault/db';

export async function GET() {
  try {
    const id = await findRandomTagId();
    if (id === null) {
      return Response.json({ error: 'No tags found' }, { status: 404 });
    }
    return Response.json({ id }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('random tag error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
