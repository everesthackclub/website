# Event Management Scripts

Helper scripts to manage events and their images.

## Available Scripts

### 1. List All Events

View all events with their IDs and image status:

```bash
node scripts/update-event-images.js --list
```

This will show:
- Event ID (needed for updates)
- Event name
- Date
- Active/Inactive status
- Whether it has an image or not

### 2. Update Event Images

**Step 1:** Find your event IDs using the list command above

**Step 2:** Edit `scripts/update-event-images.js` and add your events to the `EVENT_IMAGES` array:

```javascript
const EVENT_IMAGES = [
  {
    eventId: 'clxxx...',
    imageUrl: '/events/past/hackathon-jan-2025.jpg'
  },
  {
    eventId: 'clyyy...',
    imageUrl: '/events/past/workshop-feb-2025.jpg'
  },
];
```

**Step 3:** Run the script:

```bash
node scripts/update-event-images.js
```

### 3. Seed Example Events (Optional)

Create sample past events for testing:

```bash
node scripts/seed-example-events.js
```

Edit `scripts/seed-example-events.js` to customize the example events.

## Quick Start Guide

### Adding Images to Existing Events

1. **Add your image** to `/public/events/past/` (e.g., `my-event.jpg`)

2. **Find the event ID**:
   ```bash
   node scripts/update-event-images.js --list
   ```

3. **Update the event**:
   - Open `scripts/update-event-images.js`
   - Add your event to the `EVENT_IMAGES` array
   - Run: `node scripts/update-event-images.js`

4. **Verify** on your website!

### Creating New Past Events with Images

Option A: **Using Prisma Studio** (recommended)
```bash
npx prisma studio
```
- Add event details including the `imageUrl` field
- Set `isActive` to `false` for past events

Option B: **Using the seed script**
- Edit `scripts/seed-example-events.js`
- Run: `node scripts/seed-example-events.js`

## Image Path Format

Always use paths relative to `/public/`:

✅ **Correct**: `/events/past/hackathon.jpg`  
❌ **Wrong**: `public/events/past/hackathon.jpg`  
❌ **Wrong**: `/public/events/past/hackathon.jpg`

## Tips

- **Image size**: 1200x630px recommended
- **Format**: Use `.jpg` or `.webp` for smaller files
- **Naming**: Use descriptive names like `workshop-march-2025.jpg`
- **Past events**: Are automatically detected by date OR `isActive = false`
- **Upcoming events**: Have `isActive = true` AND date in the future
