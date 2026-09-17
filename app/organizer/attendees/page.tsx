import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/app/lib/prisma";
import { verifyOrganizerJWT } from "@/app/lib/auth";

export default async function AttendeesPage() {
  // Server-side auth check
  const cookieStore = await cookies();
  const token = cookieStore.get("organizer_token")?.value;

  if (!token) {
    redirect("/organizer/login");
  }

  // Verify the token (optional additional check since middleware already protects the route)
  const request = new Request("http://localhost", {
    headers: { cookie: `organizer_token=${token}` },
  });

  const payload = verifyOrganizerJWT(request);
  if (!payload) {
    redirect("/organizer/login");
  }

  // Fetch all attendees
  const attendees = await prisma.attendee.findMany({
    orderBy: [
      { isCheckedIn: "desc" }, // Checked-in first
      { createdAt: "desc" }, // Then by registration time
    ],
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      class: true,
      section: true,
      isCheckedIn: true,
      checkedInAt: true,
      createdAt: true,
    },
  });

  const totalAttendees = attendees.length;
  const checkedInCount = attendees.filter((a) => a.isCheckedIn).length;

  return (
    <div className="min-h-screen bg-[#fafaf9] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-black text-[#1c1917] mb-6">
            Attendees
          </h1>
          
          {/* Stats */}
          <div className="flex gap-3 justify-center mb-6 flex-wrap">
            <div className="bg-white rounded-xl px-6 py-4 shadow-sm border border-[#e7e5e4]">
              <p className="text-3xl font-black text-[#1c1917]">{totalAttendees}</p>
              <p className="text-sm text-[#57534e]">Total</p>
            </div>
            <div className="bg-green-50 rounded-xl px-6 py-4 shadow-sm border border-green-200">
              <p className="text-3xl font-black text-green-700">{checkedInCount}</p>
              <p className="text-sm text-green-600">Checked In</p>
            </div>
            <div className="bg-gray-50 rounded-xl px-6 py-4 shadow-sm border border-gray-200">
              <p className="text-3xl font-black text-gray-700">
                {totalAttendees - checkedInCount}
              </p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex gap-3 justify-center">
            <Link
              href="/organizer/scan"
              className="px-5 py-2.5 bg-[#5e6fe5] text-white font-bold rounded-full hover:bg-[#5167dd] hover:scale-105 active:scale-100 transition-all text-sm"
            >
              ← Scanner
            </Link>
            <Link
              href="/"
              className="px-5 py-2.5 bg-white border border-[#e7e5e4] text-[#1c1917] font-bold rounded-full hover:border-[#1c1917] hover:scale-105 active:scale-100 transition-all text-sm"
            >
              Home
            </Link>
          </div>
        </div>

        {/* Attendees Table */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#e7e5e4]">
          {attendees.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-lg text-[#57534e]">
                No attendees yet. RSVPs will appear here.
              </p>
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
                      <td className="px-4 py-3 text-[#57534e]">
                        {attendee.email}
                      </td>
                      <td className="px-4 py-3 text-[#57534e]">
                        {attendee.phone}
                      </td>
                      <td className="px-4 py-3 text-[#57534e]">
                        {attendee.class}-{attendee.section}
                      </td>
                      <td className="px-4 py-3">
                        {attendee.isCheckedIn ? (
                          <span className="inline-block px-2.5 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                            ✓ In
                          </span>
                        ) : (
                          <span className="inline-block px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                            Pending
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

        {/* Print tip */}
        <div className="mt-6 text-center">
          <p className="text-sm text-[#57534e]">
            💡 Tip: Use browser print (Cmd/Ctrl + P) to export as PDF
          </p>
        </div>
      </div>
    </div>
  );
}
