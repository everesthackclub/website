import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/app/lib/prisma";
import { verifyOrganizerJWT } from "@/app/lib/auth";

export default async function HackersPage() {
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

  // Get all attendees with their event info
  const attendees = await prisma.attendee.findMany({
    orderBy: [
      { createdAt: "desc" },
    ],
    include: {
      event: {
        select: {
          name: true,
          date: true,
        },
      },
    },
  });

  const totalCount = attendees.length;
  const checkedInCount = attendees.filter(a => a.isCheckedIn).length;

  return (
    <main className="flex-1 overflow-auto">
        <div className="lg:hidden bg-white border-b border-[#e7e5e4] p-4">
          <h1 className="text-2xl font-black text-[#1c1917]">Hackers</h1>
        </div>

        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-black text-[#1c1917] mb-2">
              All Hackers
            </h1>
            <p className="text-[#57534e]">Everyone who has registered for events</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-xl p-6 border border-[#e7e5e4]">
              <p className="text-3xl font-black text-[#5e6fe5]">{totalCount}</p>
              <p className="text-sm text-[#57534e] mt-1">Total Registered</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-[#e7e5e4]">
              <p className="text-3xl font-black text-[#65c3b5]">{checkedInCount}</p>
              <p className="text-sm text-[#57534e] mt-1">Ever Checked In</p>
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
                      <th className="px-4 py-3 text-left font-bold text-[#1c1917]">Name</th>
                      <th className="px-4 py-3 text-left font-bold text-[#1c1917]">Email</th>
                      <th className="px-4 py-3 text-left font-bold text-[#1c1917]">Phone</th>
                      <th className="px-4 py-3 text-left font-bold text-[#1c1917]">Class</th>
                      <th className="px-4 py-3 text-left font-bold text-[#1c1917]">Event</th>
                      <th className="px-4 py-3 text-left font-bold text-[#1c1917]">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendees.map((attendee) => (
                      <tr key={attendee.id} className="border-b border-[#f5f5f4]">
                        <td className="px-4 py-3 font-bold text-[#1c1917]">
                          {attendee.firstName} {attendee.lastName}
                        </td>
                        <td className="px-4 py-3 text-[#57534e]">{attendee.email}</td>
                        <td className="px-4 py-3 text-[#57534e]">{attendee.phone}</td>
                        <td className="px-4 py-3 text-[#57534e]">
                          {attendee.class}-{attendee.section}
                        </td>
                        <td className="px-4 py-3 text-[#57534e]">
                          {attendee.event.name}
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
              href="/organizer/events"
              className="px-4 py-3 bg-white border border-[#e7e5e4] rounded-lg text-center font-bold text-[#1c1917]"
            >
              Events
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
  );
}
