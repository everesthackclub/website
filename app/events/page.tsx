import Image from "next/image";
import Link from "next/link";
import NavMenu from "../components/NavMenu";

export const metadata = {
  title: 'Events & Announcements - Everest Hack Club',
  description: 'Check out upcoming events, workshops, and announcements from Everest Hack Club',
};

// Next scheduled session
const event = {
  title: 'Weekly Hack Session',
  date: 'Friday, September 4',
  time: '9:00 AM - 11:00 AM',
  location: 'Everest College, Biratnagar',
  description: 'Our first hack session of the season. We kick off with onboarding, get everyone set up, then spend the rest of the morning building. Come as you are - beginners are exactly who this is for.',
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

export default function EventsPage() {
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

      {/* Event Card */}
      <section className="px-6 sm:px-12 py-16 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-[#c3e6f3] to-[#abc8f4] border-4 border-[#473b47] rounded-2xl overflow-hidden shadow-xl">
            {/* Event Details */}
            <div className="p-8 sm:p-12">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="px-4 py-2 bg-[#e11d48] text-white rounded-full text-sm font-bold uppercase">
                  next session
                </span>
                <span className="px-4 py-2 bg-[#65c3b5] text-white rounded-full text-sm font-bold uppercase">
                  beginners welcome
                </span>
              </div>

              <h2 className="text-4xl sm:text-5xl font-black text-[#473b47] mb-6">
                {event.title}
              </h2>
              
              <div className="space-y-4 mb-8 text-lg text-[#473b47]">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📅</span>
                  <span className="font-bold">{event.date}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🕐</span>
                  <span className="font-bold">{event.time}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📍</span>
                  <span className="font-bold">{event.location}</span>
                </div>
              </div>

              <p className="text-[#473b47] text-lg leading-relaxed mb-8">
                {event.description}
              </p>

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

              <Link
                href="/"
                className="inline-block px-8 py-4 bg-[#5e6fe5] text-white font-bold text-xl rounded-xl hover:bg-[#5167dd] transition-colors"
              >
                Join Us on September 4
              </Link>
            </div>
          </div>

          {/* More events coming soon */}
          <div className="mt-12 text-center p-12 bg-gradient-to-br from-[#f3faff] to-[#e8f3ff] rounded-2xl border-4 border-[#473b47]">
            <h3 className="text-2xl font-black text-[#473b47] mb-2">
              More events coming soon!
            </h3>
            <p className="text-[#473b47]">
              Check back regularly for new workshops, hackathons, and community events.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 sm:px-12 py-8 bg-white border-t-4 border-[#1F2D3D] text-center pointer-events-auto">
        <p className="text-[#1F2D3D] font-medium">
          © 2026 Everest Hack Club • <Link href="/" className="text-[#EC3750] hover:underline">Back to Home</Link>
        </p>
      </footer>
    </div>
  );
}
