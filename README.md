# Everest Hack Club Website

Official website for Everest Hack Club - a student-led Hack Club chapter in Biratnagar, Nepal.

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- 🎉 **Event Management**: Display upcoming and past events with images
- 📱 **RSVP System**: Allow students to register for events
- 🎫 **Digital Tickets**: Generate QR code tickets for attendees
- 📊 **Organizer Dashboard**: Manage events, view attendees, scan tickets
- 🖼️ **Event Showcase**: Beautiful gallery of past events on landing page

## Managing Events & Images

### Adding Images to Events

See **[HOW_TO_ADD_EVENT_IMAGES.md](./HOW_TO_ADD_EVENT_IMAGES.md)** for detailed instructions.

**Quick start:**

1. Add image to `/public/events/past/your-image.jpg`
2. Run: `node scripts/update-event-images.js --list` to find event IDs
3. Update event with image URL using Prisma Studio or the helper scripts

### Helper Scripts

Located in `/scripts/`:

- `update-event-images.js` - Add images to existing events
- `seed-example-events.js` - Create sample events for testing

See [scripts/README.md](./scripts/README.md) for full documentation.

## Database

This project uses PostgreSQL with Prisma ORM.

### Setup Database

1. Copy `.env.example` to `.env` and add your `DATABASE_URL`
2. Run migrations: `npx prisma migrate dev`
3. (Optional) Open Prisma Studio: `npx prisma studio`

### Key Models

- **Event**: Events with dates, locations, descriptions, and images
- **Attendee**: Student registrations and check-ins
- **Organizer**: Admin users who manage events

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: PostgreSQL + Prisma
- **Styling**: Tailwind CSS
- **Authentication**: JWT tokens (for organizers)
- **Deployment**: Vercel

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
