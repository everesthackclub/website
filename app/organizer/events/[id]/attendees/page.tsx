"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Attendee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  class: string;
  section: string;
  isCheckedIn: boolean;
  isApproved: boolean;
  checkedInAt: Date | null;
  createdAt: Date;
}

interface Event {
  id: string;
  name: string;
  date: Date;
  time: string;
  location: string;
  isActive: boolean;
}

export default function EventAttendeesPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [eventId, setEventId] = useState<string>("");
  const [event, setEvent] = useState<Event | null>(null);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actioningAttendeeId, setActioningAttendeeId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter attendees based on search query
  const filteredAttendees = attendees.filter((attendee) => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      attendee.firstName.toLowerCase().includes(query) ||
      attendee.lastName.toLowerCase().includes(query) ||
      attendee.email.toLowerCase().includes(query) ||
      attendee.phone.toLowerCase().includes(query) ||
      attendee.class.toLowerCase().includes(query) ||
      attendee.section.toLowerCase().includes(query)
    );
  });

  useEffect(() => {
    const init = async () => {
      const { id } = await params;
      setEventId(id);
      await loadData(id);
    };
    init();
  }, [params]);

  const loadData = async (id: string) => {
    try {
      // Check auth
      const authRes = await fetch("/api/organizer/me");
      if (!authRes.ok) {
        router.push("/organizer/login");
        return;
      }

      // Load event
      const eventRes = await fetch(`/api/organizer/events/${id}`);
      const eventData = await eventRes.json();
      
      if (eventRes.ok && eventData.event) {
        setEvent(eventData.event);
        setAttendees(eventData.event.attendees || []);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error("Load data error:", error);
      setIsLoading(false);
    }
  };

  const handleApproveAttendee = async (attendeeId: string, currentStatus: boolean) => {
    setActioningAttendeeId(attendeeId);
    try {
      const response = await fetch(`/api/attendee/${attendeeId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: !currentStatus }),
      });

      if (response.ok) {
        await loadData(eventId);
      } else {
        const data = await response.json();
        alert(data.error || "Failed to update attendee");
      }
    } catch (error) {
      console.error("Approve attendee error:", error);
      alert("Failed to update attendee");
    }
    setActioningAttendeeId(null);
  };

  const handleDeleteAttendee = async (attendeeId: string) => {
    setActioningAttendeeId(attendeeId);
    try {
      const response = await fetch(`/api/attendee/${attendeeId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await loadData(eventId);
        setDeleteConfirmId(null);
      } else {
        const data = await response.json();
        alert(data.error || "Failed to delete attendee");
      }
    } catch (error) {
      console.error("Delete attendee error:", error);
      alert("Failed to delete attendee");
    }
    setActioningAttendeeId(null);
  };

  if (!event) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#1c1917] mb-2">Event Not Found</h1>
          <Link href="/organizer/events" className="text-[#5e6fe5] font-medium hover:text-[#5167dd]">
            ← Back to Events
          </Link>
        </div>
      </main>
    );
  }

  const checkedInCount = attendees.filter(a => a.isCheckedIn).length;

  return (
    <main className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          <div className="mb-6">
            <Link href={`/organizer/events/${event.id}`} className="text-[#57534e] hover:text-[#1c1917] font-medium mb-4 inline-block">
              ← Back to Event
            </Link>
          </div>

          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black text-[#1c1917] mb-2">
                Attendees: {event.name}
              </h1>
              <p className="text-[#57534e]">
                {new Date(event.date).toLocaleDateString()} • {event.time}
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search attendees..."
                className="w-64 px-4 py-2 pr-10 border-2 border-[#e7e5e4] rounded-lg text-[#1c1917] placeholder:text-[#a8a29e] focus:outline-none focus:ring-2 focus:ring-[#5e6fe5] focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#57534e] hover:text-[#1c1917]"
                >
                  ✕
                </button>
              )}
            </div>
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
            {filteredAttendees.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-[#57534e]">
                  {searchQuery ? `No attendees found matching "${searchQuery}"` : "No attendees yet"}
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
                      <th className="px-4 py-3 text-left font-bold text-[#1c1917]">Check-in Time</th>
                      <th className="px-4 py-3 text-left font-bold text-[#1c1917]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAttendees.map((attendee, index) => (
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
                            <span className="inline-block px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
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
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            {!attendee.isCheckedIn && (
                              <button
                                onClick={() => handleApproveAttendee(attendee.id, attendee.isApproved)}
                                disabled={actioningAttendeeId === attendee.id}
                                className={`px-2 py-1 text-xs font-bold rounded transition-colors disabled:opacity-50 ${
                                  attendee.isApproved
                                    ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                    : "bg-[#5e6fe5] text-white hover:bg-[#5167dd]"
                                }`}
                                title={attendee.isApproved ? "Unapprove" : "Approve"}
                              >
                                {actioningAttendeeId === attendee.id ? "..." : attendee.isApproved ? "✓" : "Approve"}
                              </button>
                            )}
                            
                            {deleteConfirmId === attendee.id ? (
                              <>
                                <button
                                  onClick={() => handleDeleteAttendee(attendee.id)}
                                  disabled={actioningAttendeeId === attendee.id}
                                  className="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded hover:bg-red-700 disabled:opacity-50"
                                >
                                  {actioningAttendeeId === attendee.id ? "..." : "Yes"}
                                </button>
                                <button
                                  onClick={() => setDeleteConfirmId(null)}
                                  className="px-2 py-1 bg-gray-200 text-gray-700 text-xs font-bold rounded hover:bg-gray-300"
                                >
                                  No
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => setDeleteConfirmId(attendee.id)}
                                className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded hover:bg-red-200"
                                title="Delete attendee"
                              >
                                ✕
                              </button>
                            )}
                          </div>
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
  );
}
