export function defaultAvatarUrl(
  userId: string,
  discriminator?: string
): string {
  const index =
    discriminator && discriminator !== '0'
      ? Number(discriminator) % 5
      : /^\d+$/.test(userId)
        ? Number((BigInt(userId) >> 22n) % 6n)
        : 0;
  return `https://cdn.discordapp.com/embed/avatars/${index}.png`;
}

export function avatarUrl(userId: string, hash: string, size: number): string {
  const ext = hash.startsWith('a_') ? 'gif' : 'webp';
  return `https://cdn.discordapp.com/avatars/${userId}/${hash}.${ext}?size=${size}`;
}
