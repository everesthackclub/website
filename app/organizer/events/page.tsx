"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface EventItem {
  id: string;
  name: string;
  description?: string;
  date: string;
  time: string;
  location: string;
  isActive: boolean;
  isCompleted: boolean;
  isFormOpen: boolean;
  _count: { attendees: number };
  attendees?: { isCheckedIn: boolean }[];
}

function CheckInBar({ checked, total }: { checked: number; total: number }) {
  const pct = total > 0 ? Math.round((checked / total) * 100) : 0;
  return (
    <div className="mt-3">
      <div className="flex justify-between text-xs text-[#78716c] mb-1">
        <span>{checked} / {total} checked in</span>
        <span className="font-bold text-[#1c1917]">{pct}%</span>
      </div>
      <div className="h-1.5 bg-[#f5f5f4] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            background: pct >= 80 ? "#22c55e" : pct >= 50 ? "#5e6fe5" : "#ec3750",
          }}
        />
      </div>
    </div>
  );
}

export default function EventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [confirmCompleteId, setConfirmCompleteId] = useState<string | null>(null);

  const loadEvents = useCallback(async () => {
    try {
      const authRes = await fetch("/api/organizer/me");
      if (!authRes.ok) {
        router.push("/organizer/login");
        return;
      }
      const res = await fetch("/api/organizer/events");
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events || []);
      }
    } catch (err) {
      console.error("Load events error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const handleToggleForm = async (event: EventItem) => {
    setTogglingId(event.id);
    try {
      const res = await fetch(`/api/organizer/events/${event.id}/form`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFormOpen: !event.isFormOpen }),
      });
      if (res.ok) await loadEvents();
    } catch (err) {
      console.error("Toggle form error:", err);
    } finally {
      setTogglingId(null);
    }
  };

  const handleToggleActive = async (event: EventItem) => {
    setTogglingId(event.id);
    try {
      const res = await fetch(`/api/organizer/events/${event.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !event.isActive }),
      });
      if (res.ok) await loadEvents();
    } catch (err) {
      console.error("Toggle active error:", err);
    } finally {
      setTogglingId(null);
    }
  };

  const handleMarkComplete = async (event: EventItem) => {
    setTogglingId(event.id);
    setConfirmCompleteId(null);
    try {
      const res = await fetch(`/api/organizer/events/${event.id}/complete`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isCompleted: true }),
      });
      if (res.ok) await loadEvents();
    } catch (err) {
      console.error("Complete event error:", err);
    } finally {
      setTogglingId(null);
    }
  };

  const handleReopen = async (event: EventItem) => {
    setTogglingId(event.id);
    try {
      const res = await fetch(`/api/organizer/events/${event.id}/complete`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isCompleted: false }),
      });
      if (res.ok) await loadEvents();
    } catch (err) {
      console.error("Reopen event error:", err);
    } finally {
      setTogglingId(null);
    }
  };

  if (isLoading) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-10 h-10 border-4 border-[#5e6fe5] border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-[#78716c] font-medium">Loading events…</p>
        </div>
      </main>
    );
  }

  const activeEvents = events.filter((e) => e.isActive && !e.isCompleted);
  const otherEvents = events.filter((e) => !e.isActive || e.isCompleted);

  return (
    <main className="flex-1 overflow-auto">
      {/* Mobile header */}
      <div className="lg:hidden bg-white border-b border-[#e7e5e4] p-4">
        <h1 className="text-2xl font-black text-[#1c1917]">Events</h1>
      </div>

      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Page header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl lg:text-4xl font-black text-[#1c1917] mb-1">Events</h1>
            <p className="text-[#78716c]">Manage your hack sessions</p>
          </div>
          <Link
            href="/organizer/events/new"
            className="flex items-center gap-2 px-5 py-2.5 bg-[#ec3750] text-white font-bold rounded-full hover:bg-[#d11941] text-sm transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Create Event
          </Link>
        </div>

        {events.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border-2 border-dashed border-[#e7e5e4] text-center">
            <div className="w-14 h-14 bg-[#f5f5f4] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#a8a29e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <p className="text-[#78716c] font-medium mb-1">No events yet</p>
            <p className="text-sm text-[#a8a29e] mb-6">Create your first hack session to get started</p>
            <Link
              href="/organizer/events/new"
              className="inline-block px-6 py-3 bg-[#ec3750] text-white font-bold rounded-full hover:bg-[#d11941] transition-colors"
            >
              Create Your First Event
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Active Events */}
            {activeEvents.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block" />
                  <h2 className="text-sm font-bold text-green-700 uppercase tracking-widest">Active</h2>
                </div>
                <div className="space-y-4">
                  {activeEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      isToggling={togglingId === event.id}
                      confirmCompleteId={confirmCompleteId}
                      setConfirmCompleteId={setConfirmCompleteId}
                      onToggleForm={handleToggleForm}
                      onToggleActive={handleToggleActive}
                      onMarkComplete={handleMarkComplete}
                      onReopen={handleReopen}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Other Events */}
            {otherEvents.length > 0 && (
              <section>
                <h2 className="text-sm font-bold text-[#78716c] uppercase tracking-widest mb-3">
                  {activeEvents.length > 0 ? "Other Events" : "All Events"}
                </h2>
                <div className="space-y-4">
                  {otherEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      isToggling={togglingId === event.id}
                      confirmCompleteId={confirmCompleteId}
                      setConfirmCompleteId={setConfirmCompleteId}
                      onToggleForm={handleToggleForm}
                      onToggleActive={handleToggleActive}
                      onMarkComplete={handleMarkComplete}
                      onReopen={handleReopen}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

interface EventCardProps {
  event: EventItem;
  isToggling: boolean;
  confirmCompleteId: string | null;
  setConfirmCompleteId: (id: string | null) => void;
  onToggleForm: (event: EventItem) => void;
  onToggleActive: (event: EventItem) => void;
  onMarkComplete: (event: EventItem) => void;
  onReopen: (event: EventItem) => void;
}

function EventCard({
  event,
  isToggling,
  confirmCompleteId,
  setConfirmCompleteId,
  onToggleForm,
  onToggleActive,
  onMarkComplete,
  onReopen,
}: EventCardProps) {
  const checkedIn = event.attendees?.filter((a) => a.isCheckedIn).length || 0;

  const borderColor = event.isCompleted
    ? "border-[#e7e5e4]"
    : event.isActive
    ? "border-green-300"
    : "border-[#e7e5e4]";

  const topBarColor = event.isCompleted
    ? "#d4d4d0"
    : event.isActive
    ? "#22c55e"
    : "#5e6fe5";

  return (
    <div
      className={`bg-white rounded-2xl border overflow-hidden transition-all ${borderColor} ${
        event.isCompleted ? "opacity-80" : ""
      }`}
    >
      <div className="h-1" style={{ background: topBarColor }} />
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="text-xl font-black text-[#1c1917] truncate">{event.name}</h3>
              {event.isCompleted && (
                <span className="px-2.5 py-0.5 bg-gray-100 text-gray-600 text-xs font-bold rounded-full shrink-0">
                  Completed
                </span>
              )}
              {!event.isCompleted && event.isActive && (
                <span className="px-2.5 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full shrink-0">
                  ✓ Active
                </span>
              )}
              {!event.isCompleted && !event.isFormOpen && (
                <span className="px-2.5 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full shrink-0">
                  Form Closed
                </span>
              )}
            </div>
            {event.description && (
              <p className="text-sm text-[#78716c] mb-2 line-clamp-1">{event.description}</p>
            )}
            <div className="flex flex-wrap gap-3 text-xs text-[#78716c]">
              <span className="flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                {new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} · {event.time}
              </span>
              <span className="flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {event.location}
              </span>
              <span className="flex items-center gap-1 font-semibold text-[#5e6fe5]">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                </svg>
                {event._count.attendees} RSVPs
              </span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        {event._count.attendees > 0 && (
          <CheckInBar checked={checkedIn} total={event._count.attendees} />
        )}

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2 mt-4">
          <Link
            href={`/organizer/events/${event.id}`}
            className="px-4 py-2 bg-[#5e6fe5] text-white font-bold rounded-full hover:bg-[#5167dd] text-xs transition-colors"
          >
            View Details
          </Link>
          <Link
            href={`/organizer/events/${event.id}/attendees`}
            className="px-4 py-2 bg-white border border-[#e7e5e4] text-[#1c1917] font-bold rounded-full hover:border-[#5e6fe5] text-xs transition-colors"
          >
            Attendees ({event._count.attendees})
          </Link>

          {!event.isCompleted && (
            <>
              {/* Toggle form */}
              <button
                onClick={() => onToggleForm(event)}
                disabled={isToggling}
                className={`px-4 py-2 font-bold rounded-full text-xs disabled:opacity-50 transition-colors ${
                  event.isFormOpen
                    ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                    : "bg-green-100 text-green-700 hover:bg-green-200"
                }`}
              >
                {isToggling ? "…" : event.isFormOpen ? "Close RSVP" : "Open RSVP"}
              </button>

              {/* Mark complete */}
              {confirmCompleteId === event.id ? (
                <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 rounded-full px-3 py-1.5">
                  <span className="text-xs text-red-700 font-semibold">Complete & lock?</span>
                  <button
                    onClick={() => onMarkComplete(event)}
                    disabled={isToggling}
                    className="px-2.5 py-0.5 bg-red-600 text-white text-xs font-bold rounded-full hover:bg-red-700 disabled:opacity-50"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setConfirmCompleteId(null)}
                    className="px-2.5 py-0.5 bg-white border border-red-200 text-red-600 text-xs font-bold rounded-full hover:bg-red-50"
                  >
                    No
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmCompleteId(event.id)}
                  disabled={isToggling}
                  className="px-4 py-2 bg-gray-100 text-gray-600 font-bold rounded-full hover:bg-gray-200 text-xs disabled:opacity-50 transition-colors"
                >
                  Complete
                </button>
              )}
            </>
          )}

          {event.isCompleted && (
            <button
              onClick={() => onReopen(event)}
              disabled={isToggling}
              className="px-4 py-2 bg-blue-100 text-blue-700 font-bold rounded-full hover:bg-blue-200 text-xs disabled:opacity-50 transition-colors"
            >
              {isToggling ? "…" : "↩ Reopen"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
