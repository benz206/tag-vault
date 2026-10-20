import type { MetadataRoute } from 'next';
import { findPublicTagIds } from '@tag-vault/db';
import { siteUrl } from '@/lib/site';

export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const tags = await findPublicTagIds();
  return [
    { url: siteUrl, changeFrequency: 'daily', priority: 1 },
    ...tags.map((tag) => ({
      url: `${siteUrl}/tags/${tag.id}`,
      lastModified: tag.last_fetched || undefined
    }))
  ];
}
