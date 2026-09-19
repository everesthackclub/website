"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Hacker {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  class: string;
  section: string;
  joinedAt: string;
  totalEvents: number;
  totalCheckIns: number;
  events: Array<{
    id: string;
    name: string;
    date: string;
    isCheckedIn: boolean;
    isCompleted: boolean;
  }>;
}

export default function HackersPage() {
  const router = useRouter();
  const [hackers, setHackers] = useState<Hacker[]>([]);
  const [filteredHackers, setFilteredHackers] = useState<Hacker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState("all");

  useEffect(() => {
    loadHackers();
  }, []);

  useEffect(() => {
    filterHackers();
  }, [searchQuery, classFilter, hackers]);

  const loadHackers = async () => {
    try {
      const authRes = await fetch("/api/organizer/me");
      if (!authRes.ok) {
        router.push("/organizer/login");
        return;
      }

      const response = await fetch("/api/organizer/hackers");
      if (response.ok) {
        const data = await response.json();
        setHackers(data.hackers);
        setFilteredHackers(data.hackers);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Load hackers error:", error);
      setIsLoading(false);
    }
  };

  const filterHackers = () => {
    let filtered = [...hackers];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (h) =>
          h.firstName.toLowerCase().includes(query) ||
          h.lastName.toLowerCase().includes(query) ||
          h.email.toLowerCase().includes(query)
      );
    }

    // Class filter
    if (classFilter !== "all") {
      filtered = filtered.filter((h) => h.class === classFilter);
    }

    setFilteredHackers(filtered);
  };

  const uniqueClasses = Array.from(new Set(hackers.map((h) => h.class))).sort();

  if (isLoading) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#57534e]">Loading members...</p>
        </div>
      </main>
    );
  }

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
          <p className="text-[#57534e]">
            {hackers.length} member{hackers.length !== 1 ? "s" : ""} total
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl p-6 border border-[#e7e5e4] mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full px-4 py-2 border-2 border-[#e7e5e4] rounded-lg text-[#1c1917] placeholder:text-[#a8a29e] focus:outline-none focus:ring-2 focus:ring-[#5e6fe5] focus:border-transparent"
              />
            </div>
            <div>
              <select
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="w-full sm:w-48 px-4 py-2 border-2 border-[#e7e5e4] rounded-lg text-[#1c1917] focus:outline-none focus:ring-2 focus:ring-[#5e6fe5] focus:border-transparent"
              >
                <option value="all">All Classes</option>
                {uniqueClasses.map((cls) => (
                  <option key={cls} value={cls}>
                    Class {cls}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-6 border border-[#e7e5e4]">
            <p className="text-3xl font-black text-[#5e6fe5]">{hackers.length}</p>
            <p className="text-sm text-[#57534e] mt-1">Total Members</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-[#e7e5e4]">
            <p className="text-3xl font-black text-[#65c3b5]">
              {hackers.reduce((sum, h) => sum + h.totalEvents, 0)}
            </p>
            <p className="text-sm text-[#57534e] mt-1">Total Registrations</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-[#e7e5e4]">
            <p className="text-3xl font-black text-[#ec3750]">
              {hackers.reduce((sum, h) => sum + h.totalCheckIns, 0)}
            </p>
            <p className="text-sm text-[#57534e] mt-1">Total Check-ins</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-[#e7e5e4]">
            <p className="text-3xl font-black text-[#ffa599]">
              {uniqueClasses.length}
            </p>
            <p className="text-sm text-[#57534e] mt-1">Classes</p>
          </div>
        </div>

        {/* Hackers List */}
        {filteredHackers.length === 0 ? (
          <div className="bg-white rounded-xl p-12 border border-[#e7e5e4] text-center">
            <p className="text-[#57534e]">
              {searchQuery || classFilter !== "all"
                ? "No members found matching your filters"
                : "No members yet"}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredHackers.map((hacker) => (
              <div
                key={hacker.id}
                className="bg-white rounded-xl p-6 border border-[#e7e5e4] hover:border-[#1c1917] transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-black text-[#1c1917] mb-1">
                      {hacker.firstName} {hacker.lastName}
                    </h3>
                    <p className="text-sm text-[#57534e] mb-2">{hacker.email}</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-[#f5f5f4] text-[#57534e] text-xs font-bold rounded-full">
                        {hacker.phone}
                      </span>
                      <span className="px-3 py-1 bg-[#f5f5f4] text-[#57534e] text-xs font-bold rounded-full">
                        Class {hacker.class} {hacker.section}
                      </span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                        Joined {new Date(hacker.joinedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-4 ml-4">
                    <div className="text-center">
                      <p className="text-2xl font-black text-[#5e6fe5]">
                        {hacker.totalEvents}
                      </p>
                      <p className="text-xs text-[#57534e]">Events</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-black text-[#65c3b5]">
                        {hacker.totalCheckIns}
                      </p>
                      <p className="text-xs text-[#57534e]">Check-ins</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-black text-[#ec3750]">
                        {hacker.totalEvents > 0
                          ? Math.round((hacker.totalCheckIns / hacker.totalEvents) * 100)
                          : 0}%
                      </p>
                      <p className="text-xs text-[#57534e]">Rate</p>
                    </div>
                  </div>
                </div>

                {/* Event History */}
                {hacker.events.length > 0 && (
                  <div className="pt-4 border-t border-[#e7e5e4]">
                    <p className="text-sm font-bold text-[#57534e] mb-2">
                      Event History:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {hacker.events.map((event) => (
                        <span
                          key={event.id}
                          className={`px-3 py-1 text-xs font-bold rounded-full ${
                            event.isCheckedIn
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                          title={`${event.name} - ${new Date(event.date).toLocaleDateString()}`}
                        >
                          {event.isCheckedIn ? "✓" : "○"} {event.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
