# Database Setup Instructions

## Step 1: Get your Neon Postgres connection string

1. Go to [Neon Console](https://console.neon.tech/)
2. Create a new project or select an existing one
3. Copy the connection string (it looks like: `postgresql://user:password@host/dbname?sslmode=require`)

## Step 2: Update .env with your database URL

Edit `.env` in the project root and replace the `DATABASE_URL` with your actual Neon connection string:

```env
DATABASE_URL="postgresql://your-actual-connection-string"
```

Also update the organizer credentials:

```env
ORGANIZER_EMAIL="your-email@example.com"
ORGANIZER_PASSWORD="your-secure-password"
ORGANIZER_NAME="Your Name"
```

And set a secure JWT secret:

```env
JWT_SECRET="a-long-random-secret-string-here"
```

## Step 3: Run the migration

Once you've updated `.env`, run:

```bash
npx prisma migrate dev --name init
```

This will:
- Create the database tables (`Attendee` and `Organizer`)
- Generate the Prisma Client

## Step 4: Seed the organizer account

```bash
npm run db:seed
```

This creates the first organizer account using the credentials from your `.env` file.

## Done!

You can now:
- View the database: `npx prisma studio`
- Check the schema: `cat prisma/schema.prisma`
- Run migrations: `npx prisma migrate dev`
