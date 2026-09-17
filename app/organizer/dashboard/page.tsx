"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Stats {
  totalEvents: number;
  activeEvents: number;
  totalAttendees: number;
  checkedInCount: number;
}

interface ActiveEvent {
  id: string;
  name: string;
  description?: string;
  date: Date;
  time: string;
  location: string;
  _count: {
    attendees: number;
  };
}

interface Organizer {
  name: string;
  email: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [organizer, setOrganizer] = useState<Organizer | null>(null);
  const [stats, setStats] = useState<Stats>({ totalEvents: 0, activeEvents: 0, totalAttendees: 0, checkedInCount: 0 });
  const [activeEvent, setActiveEvent] = useState<ActiveEvent | null>(null);

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

        // Load events and stats
        const eventsRes = await fetch("/api/organizer/events");
        const eventsData = await eventsRes.json();
        
        if (eventsData.events) {
          const events = eventsData.events;
          const active = events.find((e: any) => e.isActive);
          setActiveEvent(active || null);
          
          const totalAtt = events.reduce((sum: number, e: any) => sum + (e._count?.attendees || 0), 0);
          const checkedIn = events.reduce((sum: number, e: any) => 
            sum + (e.attendees?.filter((a: any) => a.isCheckedIn).length || 0), 0
          );
          
          setStats({
            totalEvents: events.length,
            activeEvents: events.filter((e: any) => e.isActive).length,
            totalAttendees: totalAtt,
            checkedInCount: checkedIn
          });
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Load data error:", error);
        setIsLoading(false);
      }
    };

    loadData();
  }, [router]);

  return (
    <main className="flex-1 overflow-auto">
      <div className="lg:hidden bg-white border-b border-[#e7e5e4] p-4">
        <h1 className="text-2xl font-black text-[#1c1917]">Dashboard</h1>
      </div>

      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-black text-[#1c1917] mb-2">
            Welcome back, {organizer?.name?.split(' ')[0]}!
          </h1>
          <p className="text-[#57534e]">Here's what's happening with your events</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 border border-[#e7e5e4]">
            <p className="text-3xl font-black text-[#1c1917]">{stats.totalEvents}</p>
            <p className="text-sm text-[#57534e] mt-1">Total Events</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-[#e7e5e4]">
            <p className="text-3xl font-black text-[#ec3750]">{stats.activeEvents}</p>
            <p className="text-sm text-[#57534e] mt-1">Active Now</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-[#e7e5e4]">
            <p className="text-3xl font-black text-[#5e6fe5]">{stats.totalAttendees}</p>
            <p className="text-sm text-[#57534e] mt-1">Total RSVPs</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-[#e7e5e4]">
            <p className="text-3xl font-black text-[#65c3b5]">{stats.checkedInCount}</p>
            <p className="text-sm text-[#57534e] mt-1">Checked In</p>
          </div>
        </div>

        {activeEvent ? (
          <div className="bg-white rounded-xl p-6 border border-[#e7e5e4] mb-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-black text-[#1c1917] mb-1">
                  {activeEvent.name}
                </h2>
                {activeEvent.description && <p className="text-[#57534e]">{activeEvent.description}</p>}
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
  );
}
