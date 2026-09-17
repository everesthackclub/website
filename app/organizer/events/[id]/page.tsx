"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Attendee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isCheckedIn: boolean;
  createdAt: string;
}

interface Event {
  id: string;
  name: string;
  description?: string;
  eventDate: string;
  time: string;
  location: string;
  isActive: boolean;
  _count: {
    attendees: number;
  };
  attendees: Attendee[];
}

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [eventId, setEventId] = useState<string>("");
  const [event, setEvent] = useState<Event | null>(null);
  const [checkedInCount, setCheckedInCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { id } = await params;
      setEventId(id);
      await loadEvent(id);
    };
    init();
  }, [params]);

  const loadEvent = async (id: string) => {
    try {
      const response = await fetch(`/api/organizer/events/${id}`);
      const data = await response.json();

      if (response.ok && data.event) {
        setEvent(data.event);
        
        // Count checked in attendees
        const checkedIn = data.event.attendees.filter((a: Attendee) => a.isCheckedIn).length;
        setCheckedInCount(checkedIn);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Load event error:", error);
      setIsLoading(false);
    }
  };

  const handleToggleActive = async () => {
    if (!event) return;
    
    setIsToggling(true);
    try {
      const response = await fetch(`/api/organizer/events/${event.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !event.isActive }),
      });

      if (response.ok) {
        await loadEvent(event.id); // Reload event data
      }
    } catch (error) {
      console.error("Toggle active error:", error);
    }
    setIsToggling(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-[#5e6fe5] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-lg font-medium text-[#57534e]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#1c1917] mb-2">Event Not Found</h1>
          <Link href="/organizer/events" className="text-[#5e6fe5] font-medium hover:text-[#5167dd]">
            ← Back to Events
          </Link>
        </div>
      </div>
    );
  }

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
            <Link href="/organizer/events" className="text-[#57534e] hover:text-[#1c1917] font-medium mb-4 inline-block">
              ← Back to Events
            </Link>
          </div>

          {/* Event Header */}
          <div className="bg-white rounded-xl p-6 border border-[#e7e5e4] mb-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-black text-[#1c1917]">{event.name}</h1>
                  {event.isActive && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-bold rounded-full">
                      Active
                    </span>
                  )}
                </div>
                {event.description && (
                  <p className="text-[#57534e] mb-4">{event.description}</p>
                )}
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/organizer/events/${event.id}/edit`}
                  className="px-4 py-2 bg-white border border-[#e7e5e4] text-[#1c1917] font-bold rounded-full hover:border-[#1c1917] text-sm"
                >
                  Edit
                </Link>
                <button
                  onClick={handleToggleActive}
                  disabled={isToggling}
                  className={`px-4 py-2 font-bold rounded-full text-sm disabled:opacity-50 ${
                    event.isActive
                      ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      : "bg-green-100 text-green-700 hover:bg-green-200"
                  }`}
                >
                  {isToggling ? "..." : event.isActive ? "Mark Complete" : "Set Active"}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div>
                <p className="text-sm text-[#57534e]">Date</p>
                <p className="font-bold text-[#1c1917]">
                  {new Date(event.eventDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-[#57534e]">Time</p>
                <p className="font-bold text-[#1c1917]">{event.time}</p>
              </div>
              <div>
                <p className="text-sm text-[#57534e]">Location</p>
                <p className="font-bold text-[#1c1917]">{event.location}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Link
                href={`/organizer/events/${event.id}/attendees`}
                className="px-6 py-3 bg-[#5e6fe5] text-white font-bold rounded-full hover:bg-[#5167dd]"
              >
                View All Attendees ({event._count.attendees})
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl p-6 border border-[#e7e5e4]">
              <p className="text-3xl font-black text-[#5e6fe5]">{event._count.attendees}</p>
              <p className="text-sm text-[#57534e] mt-1">Total RSVPs</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-[#e7e5e4]">
              <p className="text-3xl font-black text-[#65c3b5]">{checkedInCount}</p>
              <p className="text-sm text-[#57534e] mt-1">Checked In</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-[#e7e5e4]">
              <p className="text-3xl font-black text-[#ec3750]">
                {event._count.attendees - checkedInCount}
              </p>
              <p className="text-sm text-[#57534e] mt-1">Pending</p>
            </div>
          </div>

          {/* Recent Attendees */}
          <div className="bg-white rounded-xl border border-[#e7e5e4] p-6">
            <h2 className="text-2xl font-black text-[#1c1917] mb-4">
              Recent Registrations
            </h2>
            {event.attendees.length === 0 ? (
              <p className="text-[#57534e]">No registrations yet</p>
            ) : (
              <div className="space-y-3">
                {event.attendees.map((attendee) => (
                  <div key={attendee.id} className="flex items-center justify-between p-4 bg-[#fafaf9] rounded-lg">
                    <div>
                      <p className="font-bold text-[#1c1917]">
                        {attendee.firstName} {attendee.lastName}
                      </p>
                      <p className="text-sm text-[#57534e]">{attendee.email}</p>
                    </div>
                    {attendee.isCheckedIn ? (
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                        Checked In
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                        Registered
                      </span>
                    )}
                  </div>
                ))}
                {event._count.attendees > 10 && (
                  <Link
                    href={`/organizer/events/${event.id}/attendees`}
                    className="block text-center text-[#5e6fe5] font-bold hover:text-[#5167dd] mt-4"
                  >
                    View all {event._count.attendees} attendees →
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
