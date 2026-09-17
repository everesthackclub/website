const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkEventData() {
  try {
    const events = await prisma.event.findMany();
    console.log('Events in database:');
    events.forEach(event => {
      console.log({
        id: event.id,
        name: event.name,
        eventDate: event.eventDate,
        eventDateType: typeof event.eventDate,
        isValidDate: event.eventDate && !isNaN(new Date(event.eventDate).getTime())
      });
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkEventData();