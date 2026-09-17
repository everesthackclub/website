import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/app/lib/prisma";
import { verifyOrganizerJWT } from "@/app/lib/auth";

export default async function EventsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("organizer_token")?.value;
  if (!token) redirect("/organizer/login");

  const request = new Request("http://localhost", {
    headers: { cookie: `organizer_token=${token}` },
  });
  const payload = verifyOrganizerJWT(request);
  if (!payload) redirect("/organizer/login");

  const organizer = await prisma.organizer.findUnique({
    where: { id: payload.organizerId },
    select: { name: true, email: true },
  });

  const events = await prisma.event.findMany({
    orderBy: { date: "desc" },
    include: {
      _count: {
        select: {
          attendees: true,
        },
      },
    },
  });

  return (
    <div className="min-h-screen bg-[#fafaf9] flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-[#e7e5e4]">
        <div className="p-6 border-b border-[#e7e5e4]">
          <h2 className="text-2xl font-black text-[#1c1917]">Everest HC</h2>
          <p className="text-sm text-[#57534e] mt-1">Organizer</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <Link
            href="/organizer/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#57534e] hover:bg-[#f5f5f4] font-medium"
          >
            Dashboard
          </Link>
          <Link
            href="/organizer/hackers"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#57534e] hover:bg-[#f5f5f4] font-medium"
          >
            Hackers
          </Link>
          <Link
            href="/organizer/events"
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#ec3750] text-white font-bold"
          >
            Events
          </Link>
          <Link
            href="/organizer/scan"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#57534e] hover:bg-[#f5f5f4] font-medium"
          >
            Scanner
          </Link>
        </nav>

        <div className="p-4 border-t border-[#e7e5e4]">
          <div className="px-4 py-3 bg-[#f5f5f4] rounded-lg mb-2">
            <p className="text-sm font-bold text-[#1c1917]">{organizer?.name}</p>
            <p className="text-xs text-[#57534e]">{organizer?.email}</p>
          </div>
          <form action="/api/organizer/logout" method="POST">
            <button className="w-full px-4 py-2 text-sm text-[#57534e] hover:text-[#ec3750] font-medium">
              Logout
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="lg:hidden bg-white border-b border-[#e7e5e4] p-4">
          <h1 className="text-2xl font-black text-[#1c1917]">Events</h1>
        </div>

        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-black text-[#1c1917] mb-2">
                Events
              </h1>
              <p className="text-[#57534e]">Manage your hack sessions</p>
            </div>
            <Link
              href="/organizer/events/new"
              className="px-6 py-3 bg-[#ec3750] text-white font-bold rounded-full hover:bg-[#d11941]"
            >
              Create Event
            </Link>
          </div>

          {/* Events List */}
          <div className="space-y-4">
            {events.length === 0 ? (
              <div className="bg-white rounded-xl p-12 border border-[#e7e5e4] text-center">
                <p className="text-[#57534e] mb-4">No events created yet</p>
                <Link
                  href="/organizer/events/new"
                  className="inline-block px-6 py-3 bg-[#ec3750] text-white font-bold rounded-full hover:bg-[#d11941]"
                >
                  Create Your First Event
                </Link>
              </div>
            ) : (
              events.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-xl p-6 border border-[#e7e5e4] hover:border-[#1c1917] transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-black text-[#1c1917]">
                          {event.name}
                        </h3>
                        {event.isActive && (
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                            Active
                          </span>
                        )}
                      </div>
                      {event.description && (
                        <p className="text-[#57534e] mb-3">{event.description}</p>
                      )}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-[#57534e]">Date & Time</p>
                          <p className="font-bold text-[#1c1917]">
                            {new Date(event.date).toLocaleDateString()} • {event.time}
                          </p>
                        </div>
                        <div>
                          <p className="text-[#57534e]">Location</p>
                          <p className="font-bold text-[#1c1917]">{event.location}</p>
                        </div>
                        <div>
                          <p className="text-[#57534e]">RSVPs</p>
                          <p className="font-bold text-[#5e6fe5]">
                            {event._count.attendees} registered
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Link
                      href={`/organizer/events/${event.id}`}
                      className="px-4 py-2 bg-[#5e6fe5] text-white font-bold rounded-full hover:bg-[#5167dd] text-sm"
                    >
                      View Details
                    </Link>
                    <Link
                      href={`/organizer/events/${event.id}/attendees`}
                      className="px-4 py-2 bg-white border border-[#e7e5e4] text-[#1c1917] font-bold rounded-full hover:border-[#1c1917] text-sm"
                    >
                      Attendees ({event._count.attendees})
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Mobile Nav */}
          <div className="lg:hidden grid grid-cols-3 gap-3 mt-6">
            <Link
              href="/organizer/dashboard"
              className="px-4 py-3 bg-white border border-[#e7e5e4] rounded-lg text-center font-bold text-[#1c1917]"
            >
              Dashboard
            </Link>
            <Link
              href="/organizer/hackers"
              className="px-4 py-3 bg-white border border-[#e7e5e4] rounded-lg text-center font-bold text-[#1c1917]"
            >
              Hackers
            </Link>
            <Link
              href="/organizer/scan"
              className="px-4 py-3 bg-[#ec3750] text-white rounded-lg text-center font-bold"
            >
              Scan
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
