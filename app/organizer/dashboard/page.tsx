import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/app/lib/prisma";
import { verifyOrganizerJWT } from "@/app/lib/auth";

export default async function DashboardPage() {
  // Auth check
  const cookieStore = await cookies();
  const token = cookieStore.get("organizer_token")?.value;
  if (!token) redirect("/organizer/login");

  const request = new Request("http://localhost", {
    headers: { cookie: `organizer_token=${token}` },
  });
  const payload = verifyOrganizerJWT(request);
  if (!payload) redirect("/organizer/login");

  // Get organizer info
  const organizer = await prisma.organizer.findUnique({
    where: { id: payload.organizerId },
    select: { name: true, email: true },
  });

  // Get stats
  const [totalEvents, activeEvents, totalAttendees, checkedInCount] = await Promise.all([
    prisma.event.count(),
    prisma.event.count({ where: { isActive: true } }),
    prisma.attendee.count(),
    prisma.attendee.count({ where: { isCheckedIn: true } }),
  ]);

  // Get active event
  const activeEvent = await prisma.event.findFirst({
    where: { isActive: true },
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
      {/* Sidebar - Desktop only */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-[#e7e5e4]">
        <div className="p-6 border-b border-[#e7e5e4]">
          <h2 className="text-2xl font-black text-[#1c1917]">Everest HC</h2>
          <p className="text-sm text-[#57534e] mt-1">Organizer</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <Link
            href="/organizer/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#ec3750] text-white font-bold"
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
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#57534e] hover:bg-[#f5f5f4] font-medium"
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
              Logout →
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-[#e7e5e4] p-4">
          <h1 className="text-2xl font-black text-[#1c1917]">Dashboard</h1>
        </div>

        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          {/* Welcome */}
          <div className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-black text-[#1c1917] mb-2">
              Welcome back, {organizer?.name?.split(' ')[0]}!
            </h1>
            <p className="text-[#57534e]">Here's what's happening with your events</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-6 border border-[#e7e5e4]">
              <p className="text-3xl font-black text-[#1c1917]">{totalEvents}</p>
              <p className="text-sm text-[#57534e] mt-1">Total Events</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-[#e7e5e4]">
              <p className="text-3xl font-black text-[#ec3750]">{activeEvents}</p>
              <p className="text-sm text-[#57534e] mt-1">Active Now</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-[#e7e5e4]">
              <p className="text-3xl font-black text-[#5e6fe5]">{totalAttendees}</p>
              <p className="text-sm text-[#57534e] mt-1">Total RSVPs</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-[#e7e5e4]">
              <p className="text-3xl font-black text-[#65c3b5]">{checkedInCount}</p>
              <p className="text-sm text-[#57534e] mt-1">Checked In</p>
            </div>
          </div>

          {/* Active Event Card */}
          {activeEvent ? (
            <div className="bg-white rounded-xl p-6 border border-[#e7e5e4] mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-black text-[#1c1917] mb-1">
                    {activeEvent.name}
                  </h2>
                  <p className="text-[#57534e]">{activeEvent.description}</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-bold rounded-full">
                  Active
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-[#57534e]">Date & Time</p>
                  <p className="font-bold text-[#1c1917]">
                    {new Date(activeEvent.date).toLocaleDateString()} • {activeEvent.time}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[#57534e]">Location</p>
                  <p className="font-bold text-[#1c1917]">{activeEvent.location}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Link
                  href={`/organizer/events/${activeEvent.id}`}
                  className="px-4 py-2 bg-[#5e6fe5] text-white font-bold rounded-full hover:bg-[#5167dd] text-sm"
                >
                  View Details
                </Link>
                <Link
                  href="/organizer/scan"
                  className="px-4 py-2 bg-white border border-[#e7e5e4] text-[#1c1917] font-bold rounded-full hover:border-[#1c1917] text-sm"
                >
                  Start Scanning
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl p-12 border border-[#e7e5e4] text-center mb-6">
              <p className="text-[#57534e] mb-4">No active event right now</p>
              <Link
                href="/organizer/events"
                className="inline-block px-6 py-3 bg-[#ec3750] text-white font-bold rounded-full hover:bg-[#d11941]"
              >
                Create Event
              </Link>
            </div>
          )}

          {/* Mobile Nav */}
          <div className="lg:hidden grid grid-cols-3 gap-3">
            <Link
              href="/organizer/hackers"
              className="px-4 py-3 bg-white border border-[#e7e5e4] rounded-lg text-center font-bold text-[#1c1917]"
            >
              👥 Hackers
            </Link>
            <Link
              href="/organizer/events"
              className="px-4 py-3 bg-white border border-[#e7e5e4] rounded-lg text-center font-bold text-[#1c1917]"
            >
              📅 Events
            </Link>
            <Link
              href="/organizer/scan"
              className="px-4 py-3 bg-[#ec3750] text-white rounded-lg text-center font-bold"
            >
              📱 Scan
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
