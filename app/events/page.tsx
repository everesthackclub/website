import Image from "next/image";
import Link from "next/link";
import NavMenu from "../components/NavMenu";
import { prisma } from "@/app/lib/prisma";

export const metadata = {
  title: 'Events & Announcements - Everest Hack Club',
  description: 'Check out upcoming events, workshops, and announcements from Everest Hack Club',
};

// Shown in the expandable "what to expect" panel on the event card
const eventDetails = [
  {
    q: 'What should I bring?',
    a: 'Bring your own laptop and charger - all the work happens on your machine. A notebook helps too, but the laptop is the one thing you really need.',
  },
  {
    q: 'What happens in this session?',
    a: 'This is the first onboarding meeting. Club members will walk you through the club setup - accounts, tools, and everything you need to start building - and help you directly if you get stuck.',
  },
  {
    q: 'Do I need any experience?',
    a: 'No. All beginners are welcome. You do not need to have written a line of code before - just show up curious and we will take it from there.',
  },
];

export default async function EventsPage() {
  let upcomingEvents: Awaited<ReturnType<typeof prisma.event.findMany>> = [];
  let pastEvents: Awaited<ReturnType<typeof prisma.event.findMany>> = [];
  
  try {
    upcomingEvents = await prisma.event.findMany({
      where: { 
        isActive: true,
        date: { gte: new Date() }
      },
      orderBy: { date: 'asc' }
    });

    pastEvents = await prisma.event.findMany({
      where: { 
        OR: [
          { isActive: false },
          { date: { lt: new Date() } }
        ]
      },
      orderBy: { date: 'desc' }
    });
  } catch (error) {
    console.error('Database connection error:', error);
    // Continue with empty arrays if database is unavailable
  }

  return (
    <div className="min-h-screen bg-grid">
      {/* Top Bar */}
      <Image
        src="/topbar-everest.svg"
        alt=""
        role="presentation"
        width={1920}
        height={80}
        className="h-auto w-full"
        priority
      />

      {/* Header */}
      <div className="bg-grid relative">
        <NavMenu />

        {/* Page Header */}
        <div className="px-6 sm:px-12 py-16 max-w-6xl mx-auto">
          <h1 className="text-6xl sm:text-7xl font-black text-[#473b47] mb-4">
            events &
          </h1>
          <h1 className="text-6xl sm:text-7xl font-black text-[#e11d48] mb-6">
            announcements
          </h1>
          <p className="text-xl text-[#473b47] max-w-2xl">
            Stay updated with our latest events, workshops, and community announcements.
          </p>
        </div>
      </div>

      {/* Upcoming Event Cards */}
      <section className="px-6 sm:px-12 py-16 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-black text-[#473b47] mb-8">
            upcoming events
          </h2>
          {upcomingEvents.length === 0 ? (
            <div className="text-center p-12 bg-gradient-to-br from-[#f3faff] to-[#e8f3ff] rounded-2xl border-4 border-[#473b47]">
              <h3 className="text-2xl font-black text-[#473b47] mb-2">
                No active events right now
              </h3>
              <p className="text-[#473b47]">
                Check back regularly for new workshops, hackathons, and community events.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="bg-gradient-to-br from-[#c3e6f3] to-[#abc8f4] border-4 border-[#473b47] rounded-2xl overflow-hidden shadow-xl">
                  {/* Event Image (if available) */}
                  {event.imageUrl && (
                    <div className="relative h-64 w-full">
                      <Image
                        src={event.imageUrl}
                        alt={event.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  
                  {/* Event Details */}
                  <div className="p-8 sm:p-12">
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                      <span className="px-4 py-2 bg-[#e11d48] text-white rounded-full text-sm font-bold uppercase">
                        upcoming event
                      </span>
                      <span className="px-4 py-2 bg-[#65c3b5] text-white rounded-full text-sm font-bold uppercase">
                        beginners welcome
                      </span>
                    </div>

                    <h2 className="text-4xl sm:text-5xl font-black text-[#473b47] mb-6">
                      {event.name}
                    </h2>
                    
                    <div className="space-y-4 mb-8 text-lg text-[#473b47]">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 bg-[#ec3750] rounded-full flex-shrink-0"></span>
                        <span className="font-bold">{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 bg-[#5e6fe5] rounded-full flex-shrink-0"></span>
                        <span className="font-bold">{event.time}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 bg-[#65c3b5] rounded-full flex-shrink-0"></span>
                        <span className="font-bold">{event.location}</span>
                      </div>
                    </div>

                    {event.description && (
                      <p className="text-[#473b47] text-lg leading-relaxed mb-8">
                        {event.description}
                      </p>
                    )}

                    {/* Expandable details */}
                    <div className="space-y-3 mb-8">
                      {eventDetails.map((detail, index) => (
                        <details
                          key={index}
                          className="group bg-white border-4 border-[#473b47] rounded-xl overflow-hidden"
                        >
                          <summary className="cursor-pointer p-4 sm:p-5 font-bold text-base sm:text-lg text-[#473b47] hover:bg-[#f3faff] transition-colors flex justify-between items-center gap-4">
                            <span>{detail.q}</span>
                            <span className="text-xl group-open:rotate-180 transition-transform shrink-0">
                              ▼
                            </span>
                          </summary>
                          <div className="px-4 sm:px-5 pb-5 pt-1 text-[#473b47] leading-relaxed border-t-4 border-[#f3faff]">
                            {detail.a}
                          </div>
                        </details>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-4">
                      <Link
                        href={`/events/${event.id}/rsvp`}
                        className="inline-block px-8 py-4 bg-[#5e6fe5] text-white font-bold text-xl rounded-xl hover:bg-[#5167dd] transition-colors"
                      >
                        RSVP Now
                      </Link>
                      <Link
                        href="/"
                        className="inline-block px-8 py-4 bg-[#65c3b5] text-white font-bold text-xl rounded-xl hover:bg-[#5ab8a8] transition-colors"
                      >
                        Back to Home
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* More events coming soon */}
          {upcomingEvents.length > 0 && (
            <div className="mt-12 text-center p-12 bg-gradient-to-br from-[#f3faff] to-[#e8f3ff] rounded-2xl border-4 border-[#473b47]">
              <h3 className="text-2xl font-black text-[#473b47] mb-2">
                More events coming soon!
              </h3>
              <p className="text-[#473b47]">
                Check back regularly for new workshops, hackathons, and community events.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Past Events Section */}
      {pastEvents.length > 0 && (
        <section className="px-6 sm:px-12 py-16 bg-gradient-to-br from-[#f3faff] to-[#e8f3ff]">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-black text-[#473b47] mb-8 text-center">
              what we&apos;ve done
            </h2>
            <p className="text-xl text-[#473b47] text-center mb-12 max-w-2xl mx-auto">
              A look back at the amazing events, workshops, and hackathons we&apos;ve hosted.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pastEvents.map((event) => (
                <div 
                  key={event.id} 
                  className="bg-white border-4 border-[#473b47] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                >
                  {/* Event Image */}
                  {event.imageUrl && (
                    <div className="relative h-48 w-full">
                      <Image
                        src={event.imageUrl}
                        alt={event.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  
                  {/* Event Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-3 h-3 bg-[#e11d48] rounded-full"></span>
                      <span className="text-sm font-bold text-[#473b47]">
                        {new Date(event.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </span>
                    </div>
                    
                    <h3 className="text-2xl font-black text-[#473b47] mb-2">
                      {event.name}
                    </h3>
                    
                    {event.description && (
                      <p className="text-[#473b47] line-clamp-3 mb-4">
                        {event.description}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-2 text-sm text-[#473b47]">
                      <span className="w-2 h-2 bg-[#65c3b5] rounded-full"></span>
                      <span className="font-semibold">{event.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="px-6 sm:px-12 py-8 bg-white border-t-4 border-[#1F2D3D] text-center pointer-events-auto">
        <p className="text-[#1F2D3D] font-medium">
          © 2026 Everest Hack Club • <Link href="/" className="text-[#EC3750] hover:underline">Back to Home</Link>
        </p>
      </footer>
    </div>
  );
}
