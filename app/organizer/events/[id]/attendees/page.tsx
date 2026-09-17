import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/app/lib/prisma";
import { verifyOrganizerJWT } from "@/app/lib/auth";

export default async function EventAttendeesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const cookieStore = await cookies();
  const token = cookieStore.get("organizer_token")?.value;
  if (!token) redirect("/organizer/login");

  const request = new Request("http://localhost", {
    headers: { cookie: `organizer_token=${token}` },
  });
  const payload = verifyOrganizerJWT(request);
  if (!payload) redirect("/organizer/login");

  const event = await prisma.event.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      date: true,
      time: true,
      location: true,
      isActive: true,
    },
  });

  if (!event) notFound();

  const attendees = await prisma.attendee.findMany({
    where: { eventId: id },
    orderBy: [
      { isCheckedIn: "desc" },
      { createdAt: "desc" },
    ],
  });

  const checkedInCount = attendees.filter(a => a.isCheckedIn).length;

  return (
    <div className="min-h-screen bg-[#fafaf9] flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-[#e7e5e4]">
        <div className="p-6 border-b border-[#e7e5e4]">
          <h2 className="text-2xl font-black text-[#1c1917]">Everest HC</h2>
          <p className="text-sm text-[#57534e] mt-1">Organizer</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <Link href="/organizer/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#57534e] hover:bg-[#f5f5f4] font-medium">
            Dashboard
          </Link>
          <Link href="/organizer/hackers" className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#57534e] hover:bg-[#f5f5f4] font-medium">
            Hackers
          </Link>
          <Link href="/organizer/events" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#ec3750] text-white font-bold">
            Events
          </Link>
          <Link href="/organizer/scan" className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#57534e] hover:bg-[#f5f5f4] font-medium">
            Scanner
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          <div className="mb-6">
            <Link href={`/organizer/events/${event.id}`} className="text-[#57534e] hover:text-[#1c1917] font-medium mb-4 inline-block">
              ← Back to Event
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-black text-[#1c1917] mb-2">
              Attendees: {event.name}
            </h1>
            <p className="text-[#57534e]">
              {new Date(event.date).toLocaleDateString()} • {event.time}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl p-6 border border-[#e7e5e4]">
              <p className="text-3xl font-black text-[#5e6fe5]">{attendees.length}</p>
              <p className="text-sm text-[#57534e] mt-1">Total RSVPs</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-[#e7e5e4]">
              <p className="text-3xl font-black text-[#65c3b5]">{checkedInCount}</p>
              <p className="text-sm text-[#57534e] mt-1">Checked In</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-[#e7e5e4]">
              <p className="text-3xl font-black text-[#ec3750]">
                {attendees.length - checkedInCount}
              </p>
              <p className="text-sm text-[#57534e] mt-1">Pending</p>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl overflow-hidden border border-[#e7e5e4]">
            {attendees.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-[#57534e]">No attendees yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#fafaf9] border-b border-[#e7e5e4]">
                    <tr>
                      <th className="px-4 py-3 text-left font-bold text-[#1c1917]">#</th>
                      <th className="px-4 py-3 text-left font-bold text-[#1c1917]">Name</th>
                      <th className="px-4 py-3 text-left font-bold text-[#1c1917]">Email</th>
                      <th className="px-4 py-3 text-left font-bold text-[#1c1917]">Phone</th>
                      <th className="px-4 py-3 text-left font-bold text-[#1c1917]">Class</th>
                      <th className="px-4 py-3 text-left font-bold text-[#1c1917]">Status</th>
                      <th className="px-4 py-3 text-left font-bold text-[#1c1917]">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendees.map((attendee, index) => (
                      <tr
                        key={attendee.id}
                        className={`border-b border-[#f5f5f4] ${
                          attendee.isCheckedIn ? "bg-green-50/50" : ""
                        }`}
                      >
                        <td className="px-4 py-3 text-[#57534e]">{index + 1}</td>
                        <td className="px-4 py-3 font-bold text-[#1c1917]">
                          {attendee.firstName} {attendee.lastName}
                        </td>
                        <td className="px-4 py-3 text-[#57534e]">{attendee.email}</td>
                        <td className="px-4 py-3 text-[#57534e]">{attendee.phone}</td>
                        <td className="px-4 py-3 text-[#57534e]">
                          {attendee.class}-{attendee.section}
                        </td>
                        <td className="px-4 py-3">
                          {attendee.isCheckedIn ? (
                            <span className="inline-block px-2.5 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                              Checked In
                            </span>
                          ) : (
                            <span className="inline-block px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                              Registered
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-[#57534e] text-xs">
                          {attendee.checkedInAt
                            ? new Date(attendee.checkedInAt).toLocaleString("en-US", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-[#57534e]">
              Use browser print (Cmd/Ctrl + P) to export as PDF
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
