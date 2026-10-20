import { searchTags } from '@tag-vault/db';
import { allowSearch } from '@/lib/rateLimit';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ search: string }> }
) {
  const { search } = await params;
  if (!search) {
    return Response.json({ error: 'Invalid Search Query' }, { status: 400 });
  }
  if (search.length > 30) {
    return Response.json({ error: 'Search query too long' }, { status: 400 });
  }

  try {
    if (!(await allowSearch())) {
      return Response.json(
        { error: 'Too many searches' },
        { status: 429, headers: { 'Retry-After': '60' } }
      );
    }
    return Response.json({ search: await searchTags(search) });
  } catch (error) {
    console.error('search error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
