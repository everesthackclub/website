/**
 * Helper script to update event images
 * Usage: node scripts/update-event-images.js
 * 
 * Edit the EVENT_IMAGES array below to add images to your events
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Configure your event images here
// Find event IDs using: npx prisma studio
const EVENT_IMAGES = [
  // Example:
  // {
  //   eventId: 'clxxx...', // Get this from Prisma Studio
  //   imageUrl: '/events/past/hackathon-jan-2025.jpg'
  // },
  // {
  //   eventId: 'clyyy...',
  //   imageUrl: '/events/past/workshop-feb-2025.jpg'
  // },
];

async function updateEventImages() {
  console.log('Starting to update event images...\n');

  for (const { eventId, imageUrl } of EVENT_IMAGES) {
    try {
      const event = await prisma.event.update({
        where: { id: eventId },
        data: { imageUrl },
        select: { id: true, name: true, imageUrl: true }
      });
      
      console.log(`✅ Updated: ${event.name}`);
      console.log(`   Image: ${event.imageUrl}\n`);
    } catch (error) {
      console.error(`❌ Error updating event ${eventId}:`, error.message, '\n');
    }
  }

  console.log('Done!');
}

// List all events (helpful for finding IDs)
async function listEvents() {
  console.log('All events in database:\n');
  
  const events = await prisma.event.findMany({
    orderBy: { date: 'desc' },
    select: {
      id: true,
      name: true,
      date: true,
      imageUrl: true,
      isActive: true
    }
  });

  events.forEach(event => {
    const status = event.isActive ? '🟢 Active' : '🔴 Inactive';
    const hasImage = event.imageUrl ? '🖼️  Has image' : '⬜ No image';
    console.log(`${status} ${hasImage}`);
    console.log(`   ID: ${event.id}`);
    console.log(`   Name: ${event.name}`);
    console.log(`   Date: ${event.date.toLocaleDateString()}`);
    if (event.imageUrl) {
      console.log(`   Image: ${event.imageUrl}`);
    }
    console.log('');
  });
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--list') || args.includes('-l')) {
    await listEvents();
  } else {
    if (EVENT_IMAGES.length === 0) {
      console.log('⚠️  No events configured to update.');
      console.log('Edit EVENT_IMAGES array in this script to add images.\n');
      console.log('Run with --list flag to see all events:');
      console.log('   node scripts/update-event-images.js --list\n');
    } else {
      await updateEventImages();
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
