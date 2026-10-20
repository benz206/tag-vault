# Environment variables

Copy `.env.example` to `.env.local` and fill it in.

| Variable                | Required   | Purpose                                                                     |
| ----------------------- | ---------- | --------------------------------------------------------------------------- |
| `MONGODB_URI`           | Yes        | MongoDB connection string. The path selects the database (default `TagDB`). |
| `DISCORD_CLIENT_ID`     | Yes        | Discord OAuth application ID used for sign-in.                              |
| `DISCORD_CLIENT_SECRET` | Yes        | Discord OAuth application secret.                                           |
| `DISCORD_BOT_TOKEN`     | Yes        | Bot token used to look up tag owners' names and avatars.                    |
| `NEXTAUTH_SECRET`       | Yes        | Signs session cookies. Generate with `openssl rand -base64 32`.             |
| `NEXTAUTH_URL`          | Production | Public site URL, used for OAuth redirects.                                  |

## Renamed variables

| Old name       | New name                       |
| -------------- | ------------------------------ |
| `MONGO_DB_URL` | `MONGODB_URI`                  |
| `Bot_Token`    | `DISCORD_BOT_TOKEN`            |
| `SECRET`       | removed, use `NEXTAUTH_SECRET` |

Update these in your hosting provider's environment settings as well.
