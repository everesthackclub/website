# Event Images Directory

Store event images here to display on the website.

## Directory Structure

- `/past/` - Images for past/completed events
- `/landing/` - Images used in the carousel on the landing page
- `/upcoming/` - Images for upcoming events (optional)

## Image Guidelines

- **Format**: `.jpg`, `.png`, or `.webp`
- **Recommended size**: 1200x630px (2:1 ratio) for event cards
- **Naming**: Use descriptive names like `hackathon-jan-2025.jpg`

## How to Add Images to Events

1. Place your image in the appropriate folder (e.g., `/public/events/past/hackathon.jpg`)
2. Update the event in the database with the image path
3. Use the path relative to `/public/` (e.g., `/events/past/hackathon.jpg`)

See the main README at `/HOW_TO_ADD_EVENT_IMAGES.md` for detailed instructions.
