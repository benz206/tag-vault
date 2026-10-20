import { searchTags } from '@tag-vault/db';
import { getSession } from '@/lib/auth';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ search: string }> }
) {
  const session = await getSession();
  if (!session?.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { search } = await params;
  if (!search) {
    return Response.json({ error: 'Invalid Search Query' }, { status: 400 });
  }
  if (search.length > 30) {
    return Response.json({ error: 'Search query too long' }, { status: 400 });
  }

  try {
    return Response.json({ search: await searchTags(search) });
  } catch (error) {
    console.error('search error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
