/**
 * Example script to seed past events with images
 * This demonstrates how to create past events that will show up on the website
 * 
 * Usage: node scripts/seed-example-events.js
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedExampleEvents() {
  console.log('Creating example past events...\n');

  // Example past events - modify these as needed
  const exampleEvents = [
    {
      name: 'First Hack Club Meeting',
      description: 'Our inaugural meetup where we introduced Hack Club, set up accounts, and helped everyone get started with their first projects.',
      date: new Date('2025-01-15'),
      time: '4:00 PM - 6:00 PM',
      location: 'Biratnagar Community Center',
      imageUrl: '/events/past/first-meeting.jpg', // Add your image here
      isActive: false // Mark as past event
    },
    {
      name: 'Web Development Workshop',
      description: 'Hands-on workshop where students built their first websites using HTML, CSS, and JavaScript.',
      date: new Date('2025-02-10'),
      time: '2:00 PM - 5:00 PM',
      location: 'Everest School Lab',
      imageUrl: '/events/past/web-workshop.jpg', // Add your image here
      isActive: false
    },
    {
      name: 'Mini Hackathon',
      description: 'Our first mini hackathon! Teams had 4 hours to build projects around the theme "Solving Local Problems".',
      date: new Date('2025-03-20'),
      time: '10:00 AM - 4:00 PM',
      location: 'Biratnagar Tech Hub',
      imageUrl: '/events/past/mini-hackathon.jpg', // Add your image here
      isActive: false
    }
  ];

  for (const eventData of exampleEvents) {
    try {
      const event = await prisma.event.create({
        data: eventData
      });
      
      console.log(`✅ Created: ${event.name}`);
      console.log(`   Date: ${event.date.toLocaleDateString()}`);
      console.log(`   Image: ${event.imageUrl}\n`);
    } catch (error) {
      console.error(`❌ Error creating event:`, error.message, '\n');
    }
  }

  console.log('Done! Remember to:');
  console.log('1. Add actual images to /public/events/past/');
  console.log('2. Update the imageUrl fields if needed');
  console.log('3. Run: node scripts/update-event-images.js --list');
}

seedExampleEvents()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
