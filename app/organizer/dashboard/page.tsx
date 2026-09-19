"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface EventSummary {
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

interface Organizer {
  name: string;
  email: string;
}

function StatCard({
  value,
  label,
  icon,
  sub,
}: {
  value: number | string;
  label: string;
  icon: React.ReactNode;
  sub?: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-[#e7e5e4] flex flex-col gap-3">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#f5f5f4]">
        <span className="text-[#57534e]">{icon}</span>
      </div>
      <div>
        <p className="text-3xl font-black text-[#1c1917]">
          {value}
        </p>
        <p className="text-sm text-[#78716c] mt-0.5 font-medium">{label}</p>
        {sub && <p className="text-xs text-[#a8a29e] mt-1">{sub}</p>}
      </div>
    </div>
  );
}

function CheckInBar({ checked, total }: { checked: number; total: number }) {
  const pct = total > 0 ? Math.round((checked / total) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-xs text-[#78716c] mb-1">
        <span>Check-in rate</span>
        <span className="font-bold text-[#1c1917]">{pct}%</span>
      </div>
      <div className="h-2 bg-[#f5f5f4] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 bg-[#1c1917]"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-[#a8a29e] mt-1">
        {checked} / {total} checked in
      </p>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [organizer, setOrganizer] = useState<Organizer | null>(null);
  const [events, setEvents] = useState<EventSummary[]>([]);

  const firstName = useMemo(
    () => organizer?.name?.split(" ")[0] || "there",
    [organizer?.name]
  );

  const stats = useMemo(() => {
    const totalEvents = events.length;
    const activeEvents = events.filter((e) => e.isActive && !e.isCompleted).length;
    const completedEvents = events.filter((e) => e.isCompleted).length;
    const totalAttendees = events.reduce(
      (sum, e) => sum + (e._count?.attendees || 0),
      0
    );
    const checkedIn = events.reduce(
      (sum, e) =>
        sum + (e.attendees?.filter((a) => a.isCheckedIn).length || 0),
      0
    );
    return { totalEvents, activeEvents, completedEvents, totalAttendees, checkedIn };
  }, [events]);

  const activeEvent = useMemo(
    () => events.find((e) => e.isActive && !e.isCompleted) || null,
    [events]
  );

  const recentEvents = useMemo(
    () => events.filter((e) => !e.isActive).slice(0, 3),
    [events]
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        const authRes = await fetch("/api/organizer/me");
        if (!authRes.ok) {
          router.push("/organizer/login");
          return;
        }
        const authData = await authRes.json();
        setOrganizer(authData.organizer);

        const eventsRes = await fetch("/api/organizer/events");
        if (eventsRes.ok) {
          const data = await eventsRes.json();
          setEvents(data.events || []);
        }
      } catch (err) {
        console.error("Load data error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [router]);

  if (isLoading) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-10 h-10 border-4 border-[#5e6fe5] border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-[#78716c] font-medium">Loading dashboard…</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-auto">
      {/* Mobile header */}
      <div className="lg:hidden bg-white border-b border-[#e7e5e4] p-4">
        <h1 className="text-2xl font-black text-[#1c1917]">Dashboard</h1>
      </div>

      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Greeting */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-black text-[#1c1917] mb-1">
            Welcome back, {firstName}!
          </h1>
          <p className="text-[#78716c]">Here&apos;s what&apos;s happening with your events</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            value={stats.totalEvents}
            label="Total Events"
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            }
          />
          <StatCard
            value={stats.activeEvents}
            label="Active Now"
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            }
            sub={stats.activeEvents === 0 ? "No active events" : undefined}
          />
          <StatCard
            value={stats.totalAttendees}
            label="Total RSVPs"
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            }
          />
          <StatCard
            value={stats.checkedIn}
            label="Checked In"
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            }
            sub={
              stats.totalAttendees > 0
                ? `${Math.round((stats.checkedIn / stats.totalAttendees) * 100)}% rate`
                : undefined
            }
          />
        </div>

        {/* Check-in progress */}
        {stats.totalAttendees > 0 && (
          <div className="bg-white rounded-2xl p-6 border border-[#e7e5e4] mb-6">
            <h2 className="text-base font-bold text-[#1c1917] mb-4">Overall Check-in Progress</h2>
            <CheckInBar checked={stats.checkedIn} total={stats.totalAttendees} />
            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-[#f5f5f4]">
              <div className="text-center">
                <p className="text-xl font-black text-[#1c1917]">{stats.checkedIn}</p>
                <p className="text-xs text-[#78716c]">Checked In</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-black text-[#1c1917]">{stats.totalAttendees - stats.checkedIn}</p>
                <p className="text-xs text-[#78716c]">Pending</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-black text-[#1c1917]">{stats.completedEvents}</p>
                <p className="text-xs text-[#78716c]">Completed</p>
              </div>
            </div>
          </div>
        )}

        {/* Active Event */}
        {activeEvent ? (
          <div className="bg-white rounded-2xl border border-[#e7e5e4] mb-6 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-green-400 to-emerald-500" />
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block" />
                    <span className="text-xs font-bold text-green-600 uppercase tracking-wide">Live Event</span>
                  </div>
                  <h2 className="text-2xl font-black text-[#1c1917]">{activeEvent.name}</h2>
                  {activeEvent.description && (
                    <p className="text-[#78716c] mt-1 text-sm">{activeEvent.description}</p>
                  )}
                </div>
                <div className="flex gap-2 flex-wrap">
                  {!activeEvent.isFormOpen && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full">
                      Form Closed
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-4 text-sm">
                <div>
                  <p className="text-[#78716c]">Date</p>
                  <p className="font-bold text-[#1c1917]">
                    {new Date(activeEvent.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
                <div>
                  <p className="text-[#78716c]">Time</p>
                  <p className="font-bold text-[#1c1917]">{activeEvent.time}</p>
                </div>
                <div>
                  <p className="text-[#78716c]">Location</p>
                  <p className="font-bold text-[#1c1917]">{activeEvent.location}</p>
                </div>
              </div>

              <CheckInBar
                checked={activeEvent.attendees?.filter((a) => a.isCheckedIn).length || 0}
                total={activeEvent._count.attendees}
              />

              <div className="flex gap-3 mt-4">
                <Link
                  href={`/organizer/events/${activeEvent.id}`}
                  className="px-5 py-2.5 bg-[#5e6fe5] text-white font-bold rounded-full hover:bg-[#5167dd] text-sm transition-colors"
                >
                  View Details
                </Link>
                <Link
                  href="/organizer/scan"
                  className="px-5 py-2.5 bg-white border-2 border-[#e7e5e4] text-[#1c1917] font-bold rounded-full hover:border-[#5e6fe5] text-sm transition-colors"
                >
                  Start Scanning
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-10 border-2 border-dashed border-[#e7e5e4] text-center mb-6">
            <div className="w-14 h-14 bg-[#f5f5f4] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#a8a29e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <p className="text-[#78716c] mb-1 font-medium">No active event</p>
            <p className="text-sm text-[#a8a29e] mb-5">Create an event and mark it active to see it here</p>
            <Link
              href="/organizer/events/new"
              className="inline-block px-6 py-3 bg-[#ec3750] text-white font-bold rounded-full hover:bg-[#d11941] transition-colors"
            >
              Create Event
            </Link>
          </div>
        )}

        {/* Recent other events */}
        {recentEvents.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black text-[#1c1917]">Other Events</h2>
              <Link href="/organizer/events" className="text-sm text-[#5e6fe5] font-bold hover:text-[#5167dd]">
                View all →
              </Link>
            </div>
            <div className="grid gap-3">
              {recentEvents.map((event) => (
                <Link
                  key={event.id}
                  href={`/organizer/events/${event.id}`}
                  className="bg-white rounded-xl p-4 border border-[#e7e5e4] hover:border-[#5e6fe5] transition-colors flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-[#1c1917] text-sm">{event.name}</p>
                      {event.isCompleted && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-bold rounded-full">
                          Completed
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#78716c]">
                      {new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} · {event._count.attendees} RSVPs
                    </p>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a8a29e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
