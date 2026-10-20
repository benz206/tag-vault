import { describe, expect, test } from 'bun:test';
import { avatarUrl, defaultAvatarUrl } from './avatars';

const embed = (index: number) =>
  `https://cdn.discordapp.com/embed/avatars/${index}.png`;

describe('defaultAvatarUrl', () => {
  test('new usernames use (id >> 22) % 6', () => {
    const id = '149926720114262016';
    const expected = Number((BigInt(id) >> 22n) % 6n);
    expect(defaultAvatarUrl(id)).toBe(embed(expected));
    expect(defaultAvatarUrl(id, '0')).toBe(embed(expected));
  });

  test('legacy discriminators use discriminator % 5', () => {
    expect(defaultAvatarUrl('149926720114262016', '1337')).toBe(embed(2));
  });

  test('non-numeric ids fall back to the first avatar', () => {
    expect(defaultAvatarUrl('unknown')).toBe(embed(0));
  });
});

describe('avatarUrl', () => {
  test('static avatars are webp', () => {
    expect(avatarUrl('1', 'abc', 64)).toBe(
      'https://cdn.discordapp.com/avatars/1/abc.webp?size=64'
    );
  });

  test('animated avatars are gif', () => {
    expect(avatarUrl('1', 'a_abc', 128)).toBe(
      'https://cdn.discordapp.com/avatars/1/a_abc.gif?size=128'
    );
  });
});
