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
  isApproved: boolean;
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
  isCompleted: boolean;
  isFormOpen: boolean;
  _count: {
    attendees: number;
  };
  attendees: Attendee[];
}

function CheckInProgressBar({ checked, total }: { checked: number; total: number }) {
  const pct = total > 0 ? Math.round((checked / total) * 100) : 0;
  const color = pct >= 80 ? "#22c55e" : pct >= 50 ? "#5e6fe5" : "#ec3750";
  return (
    <div className="bg-white rounded-2xl border border-[#e7e5e4] p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-bold text-[#1c1917]">Check-in Progress</p>
        <span className="text-2xl font-black" style={{ color }}>{pct}%</span>
      </div>
      <div className="h-3 bg-[#f5f5f4] rounded-full overflow-hidden mb-3">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <div className="flex justify-between text-xs text-[#78716c]">
        <span>{checked} checked in</span>
        <span>{total - checked} remaining</span>
      </div>
    </div>
  );
}

export default function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [eventId, setEventId] = useState<string>("");
  const [event, setEvent] = useState<Event | null>(null);
  const [checkedInCount, setCheckedInCount] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isToggling, setIsToggling] = useState(false);
  const [actioningAttendeeId, setActioningAttendeeId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmComplete, setConfirmComplete] = useState(false);

  const filteredAttendees =
    event?.attendees.filter((a) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        a.firstName.toLowerCase().includes(q) ||
        a.lastName.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q)
      );
    }) || [];

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
        setCheckedInCount(data.event.attendees.filter((a: Attendee) => a.isCheckedIn).length);
        setApprovedCount(data.event.attendees.filter((a: Attendee) => a.isApproved).length);
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
      const res = await fetch(`/api/organizer/events/${event.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !event.isActive }),
      });
      if (res.ok) await loadEvent(event.id);
    } catch (e) {
      console.error("Toggle active error:", e);
    }
    setIsToggling(false);
  };

  const handleToggleCompleted = async (complete: boolean) => {
    if (!event) return;
    setConfirmComplete(false);
    setIsToggling(true);
    try {
      const res = await fetch(`/api/organizer/events/${event.id}/complete`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isCompleted: complete }),
      });
      if (res.ok) await loadEvent(event.id);
    } catch (e) {
      console.error("Toggle completed error:", e);
    }
    setIsToggling(false);
  };

  const handleToggleForm = async () => {
    if (!event) return;
    setIsToggling(true);
    try {
      const res = await fetch(`/api/organizer/events/${event.id}/form`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFormOpen: !event.isFormOpen }),
      });
      if (res.ok) await loadEvent(event.id);
    } catch (e) {
      console.error("Toggle form error:", e);
    }
    setIsToggling(false);
  };

  const handleApproveAttendee = async (attendeeId: string, currentStatus: boolean) => {
    setActioningAttendeeId(attendeeId);
    try {
      const res = await fetch(`/api/attendee/${attendeeId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: !currentStatus }),
      });
      if (res.ok) await loadEvent(eventId);
      else {
        const data = await res.json();
        alert(data.error || "Failed to update attendee");
      }
    } catch {
      alert("Failed to update attendee");
    }
    setActioningAttendeeId(null);
  };

  const handleDeleteAttendee = async (attendeeId: string) => {
    setActioningAttendeeId(attendeeId);
    try {
      const res = await fetch(`/api/attendee/${attendeeId}`, { method: "DELETE" });
      if (res.ok) {
        await loadEvent(eventId);
        setDeleteConfirmId(null);
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete attendee");
      }
    } catch {
      alert("Failed to delete attendee");
    }
    setActioningAttendeeId(null);
  };

  if (isLoading) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-10 h-10 border-4 border-[#5e6fe5] border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-[#78716c] font-medium">Loading event…</p>
        </div>
      </main>
    );
  }

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

  const topBarColor = event.isCompleted ? "#d4d4d0" : event.isActive ? "#22c55e" : "#5e6fe5";

  return (
    <main className="flex-1 overflow-auto">
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Back */}
        <Link
          href="/organizer/events"
          className="inline-flex items-center gap-1.5 text-[#78716c] hover:text-[#1c1917] font-medium mb-6 text-sm"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to Events
        </Link>

        {/* Completed locked banner */}
        {event.isCompleted && (
          <div className="bg-gray-100 border border-gray-300 rounded-2xl p-4 mb-6 flex items-center gap-3">
            <div className="w-9 h-9 bg-gray-300 rounded-lg flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-gray-700">This event is completed and locked</p>
              <p className="text-sm text-gray-500">
                {event._count.attendees} total RSVPs · {checkedInCount} checked in (
                {event._count.attendees > 0
                  ? Math.round((checkedInCount / event._count.attendees) * 100)
                  : 0}% rate)
              </p>
            </div>
            <button
              onClick={() => handleToggleCompleted(false)}
              disabled={isToggling}
              className="ml-auto px-4 py-2 bg-white border border-gray-300 text-gray-700 font-bold rounded-full hover:bg-gray-50 text-sm disabled:opacity-50 transition-colors"
            >
              {isToggling ? "…" : "↩ Reopen"}
            </button>
          </div>
        )}

        {/* Event Header card */}
        <div className="bg-white rounded-2xl border border-[#e7e5e4] mb-6 overflow-hidden">
          <div className="h-1.5" style={{ background: topBarColor }} />
          <div className="p-6">
            <div className="flex items-start justify-between mb-4 flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h1 className="text-3xl font-black text-[#1c1917]">{event.name}</h1>
                  {event.isCompleted && (
                    <span className="px-3 py-1 bg-gray-200 text-gray-700 text-sm font-bold rounded-full">
                      Completed
                    </span>
                  )}
                  {!event.isCompleted && event.isActive && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-bold rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
                      Active
                    </span>
                  )}
                  {!event.isCompleted && !event.isFormOpen && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-bold rounded-full">
                      Form Closed
                    </span>
                  )}
                </div>
                {event.description && (
                  <p className="text-[#78716c] text-sm">{event.description}</p>
                )}
              </div>

              {/* Action buttons */}
              {!event.isCompleted ? (
                <div className="flex gap-2 flex-wrap">
                  <Link
                    href={`/organizer/events/${event.id}/edit`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border-2 border-[#e7e5e4] text-[#1c1917] font-bold rounded-full hover:border-[#5e6fe5] text-sm transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    Edit
                  </Link>

                  <button
                    onClick={handleToggleForm}
                    disabled={isToggling}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 font-bold rounded-full text-sm disabled:opacity-50 transition-colors ${
                      event.isFormOpen
                        ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                        : "bg-green-100 text-green-700 hover:bg-green-200"
                    }`}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      {event.isFormOpen ? (
                        <>
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                          <path d="M7 11V7a5 5 0 0 1 9.9-1" />
                        </>
                      ) : (
                        <>
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </>
                      )}
                    </svg>
                    {isToggling ? "…" : event.isFormOpen ? "Close RSVP Form" : "Open RSVP Form"}
                  </button>

                  {confirmComplete ? (
                    <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 rounded-full px-3 py-2">
                      <span className="text-sm text-red-700 font-semibold">Lock this event?</span>
                      <button
                        onClick={() => handleToggleCompleted(true)}
                        disabled={isToggling}
                        className="px-3 py-1 bg-red-600 text-white text-sm font-bold rounded-full hover:bg-red-700 disabled:opacity-50"
                      >
                        Yes, Complete
                      </button>
                      <button
                        onClick={() => setConfirmComplete(false)}
                        className="px-3 py-1 bg-white border border-red-200 text-red-600 text-sm font-bold rounded-full hover:bg-red-50"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmComplete(true)}
                      disabled={isToggling}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-full hover:bg-gray-200 text-sm disabled:opacity-50 transition-colors"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                      Mark Complete
                    </button>
                  )}
                </div>
              ) : (
                <span className="px-4 py-2 bg-gray-100 text-gray-500 font-bold rounded-full text-sm">
                  Read Only
                </span>
              )}
            </div>

            {/* Event meta */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 py-4 border-t border-[#f5f5f4]">
              <div>
                <p className="text-xs text-[#78716c] mb-0.5">Date</p>
                <p className="font-bold text-[#1c1917] text-sm">
                  {new Date(event.eventDate).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#78716c] mb-0.5">Time</p>
                <p className="font-bold text-[#1c1917] text-sm">{event.time}</p>
              </div>
              <div>
                <p className="text-xs text-[#78716c] mb-0.5">Location</p>
                <p className="font-bold text-[#1c1917] text-sm">{event.location}</p>
              </div>
            </div>

            <div className="mt-4">
              <Link
                href={`/organizer/events/${event.id}/attendees`}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#5e6fe5] text-white font-bold rounded-full hover:bg-[#5167dd] text-sm transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                View All Attendees ({event._count.attendees})
              </Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-5 border border-[#e7e5e4] relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#5e6fe5] rounded-t-2xl" />
            <p className="text-3xl font-black text-[#5e6fe5]">{event._count.attendees}</p>
            <p className="text-sm text-[#78716c] mt-1 font-medium">Total RSVPs</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-[#e7e5e4] relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#65c3b5] rounded-t-2xl" />
            <p className="text-3xl font-black text-[#65c3b5]">{checkedInCount}</p>
            <p className="text-sm text-[#78716c] mt-1 font-medium">Checked In</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-[#e7e5e4] relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#ec3750] rounded-t-2xl" />
            <p className="text-3xl font-black text-[#ec3750]">
              {event._count.attendees - checkedInCount}
            </p>
            <p className="text-sm text-[#78716c] mt-1 font-medium">Pending</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-[#e7e5e4] relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#a78bfa] rounded-t-2xl" />
            <p className="text-3xl font-black text-[#a78bfa]">{approvedCount}</p>
            <p className="text-sm text-[#78716c] mt-1 font-medium">Approved</p>
          </div>
        </div>

        {/* Progress bar */}
        {event._count.attendees > 0 && (
          <div className="mb-6">
            <CheckInProgressBar checked={checkedInCount} total={event._count.attendees} />
          </div>
        )}

        {/* Attendees table */}
        <div className="bg-white rounded-2xl border border-[#e7e5e4] p-6">
          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            <h2 className="text-xl font-black text-[#1c1917]">Recent Registrations</h2>
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a8a29e]"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search members…"
                className="w-60 pl-10 pr-4 py-2 border-2 border-[#e7e5e4] rounded-xl text-sm text-[#1c1917] placeholder:text-[#a8a29e] focus:outline-none focus:border-[#5e6fe5] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a8a29e] hover:text-[#1c1917]"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {filteredAttendees.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-[#78716c]">
                {searchQuery
                  ? `No members matching "${searchQuery}"`
                  : "No registrations yet"}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredAttendees.slice(0, 10).map((attendee) => (
                <div
                  key={attendee.id}
                  className="flex items-center justify-between p-3.5 bg-[#fafaf9] rounded-xl hover:bg-[#f5f5f4] transition-colors"
                >
                  <div className="flex-1 min-w-0 mr-4">
                    <p className="font-bold text-[#1c1917] text-sm truncate">
                      {attendee.firstName} {attendee.lastName}
                    </p>
                    <p className="text-xs text-[#78716c] truncate">{attendee.email}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Status badge */}
                    {attendee.isCheckedIn ? (
                      <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                        ✓ Checked In
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                        Registered
                      </span>
                    )}

                    {/* Approve button */}
                    {!attendee.isCheckedIn && !event.isCompleted && (
                      <button
                        onClick={() => handleApproveAttendee(attendee.id, attendee.isApproved)}
                        disabled={actioningAttendeeId === attendee.id}
                        className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors disabled:opacity-50 ${
                          attendee.isApproved
                            ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            : "bg-[#5e6fe5] text-white hover:bg-[#5167dd]"
                        }`}
                      >
                        {actioningAttendeeId === attendee.id
                          ? "…"
                          : attendee.isApproved
                          ? "✓ Approved"
                          : "Approve"}
                      </button>
                    )}

                    {/* Delete */}
                    {!event.isCompleted && (
                      deleteConfirmId === attendee.id ? (
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleDeleteAttendee(attendee.id)}
                            disabled={actioningAttendeeId === attendee.id}
                            className="px-2.5 py-1 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 disabled:opacity-50"
                          >
                            {actioningAttendeeId === attendee.id ? "…" : "Confirm"}
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-2.5 py-1 bg-gray-200 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-300"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirmId(attendee.id)}
                          className="px-2.5 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-lg hover:bg-red-100 transition-colors"
                        >
                          Remove
                        </button>
                      )
                    )}
                  </div>
                </div>
              ))}
              {event._count.attendees > 10 && (
                <Link
                  href={`/organizer/events/${event.id}/attendees`}
                  className="flex items-center justify-center gap-1 text-[#5e6fe5] font-bold hover:text-[#5167dd] mt-4 py-3 rounded-xl border-2 border-dashed border-[#e7e5e4] hover:border-[#5e6fe5] transition-colors text-sm"
                >
                  View all {event._count.attendees} attendees →
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
