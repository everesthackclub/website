"use client";

import { useEffect, useState } from "react";
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
  ticketToken: string;
  isCheckedIn: boolean;
  event: {
    id: string;
    name: string;
    date: string;
    time: string;
    location: string;
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const [attendee, setAttendee] = useState<Attendee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadTicket();
  }, []);

  const loadTicket = async () => {
    // Get ticket token from cookie
    const cookies = document.cookie.split(";");
    const ticketCookie = cookies.find((c) => c.trim().startsWith("ticketToken="));
    
    if (!ticketCookie) {
      setError("No ticket found. Please RSVP for an event first.");
      setIsLoading(false);
      return;
    }

    const ticketToken = ticketCookie.split("=")[1];

    try {
      const response = await fetch(`/api/rsvp/ticket?token=${ticketToken}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to load your ticket");
        setIsLoading(false);
        return;
      }

      setAttendee(data.attendee);
      setIsLoading(false);
    } catch (err) {
      console.error("Load ticket error:", err);
      setError("Network error. Please try again.");
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-[#5e6fe5] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-lg font-medium text-[#57534e]">Loading your ticket...</p>
        </div>
      </div>
    );
  }

  if (error || !attendee) {
    return (
      <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="mb-6 text-6xl">🎫</div>
          <h1 className="text-2xl font-bold text-[#1c1917] mb-3">No Ticket Found</h1>
          <p className="text-[#57534e] mb-6">{error}</p>
          <Link
            href="/events"
            className="inline-block px-6 py-3 bg-[#5e6fe5] text-white font-bold rounded-full hover:bg-[#5167dd] transition-colors"
          >
            Browse Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf9] py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-[#1c1917] mb-2">
            Your Event Ticket
          </h1>
          <p className="text-[#57534e]">
            Show this QR code at the event entrance
          </p>
        </div>

        <div className="bg-white rounded-2xl overflow-hidden border-4 border-[#473b47] shadow-xl">
          {/* Header */}
          <div className="bg-gradient-to-br from-[#5e6fe5] to-[#5167dd] text-white p-8 text-center">
            <h2 className="text-3xl font-black">{attendee.event.name}</h2>
          </div>

          {/* QR Code */}
          <div className="p-8 flex justify-center bg-white">
            <div className="bg-white p-6 rounded-xl border-4 border-[#473b47]">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${attendee.ticketToken}`}
                alt="Ticket QR Code"
                className="w-64 h-64"
              />
            </div>
          </div>

          {/* Attendee Details */}
          <div className="p-8 bg-gradient-to-br from-[#f3faff] to-[#e8f3ff] border-t-4 border-[#473b47]">
            <div className="grid sm:grid-cols-2 gap-4 text-[#1c1917]">
              <div>
                <p className="text-sm font-medium text-[#57534e]">Name</p>
                <p className="text-lg font-bold">{attendee.firstName} {attendee.lastName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-[#57534e]">Email</p>
                <p className="text-lg font-bold break-all">{attendee.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-[#57534e]">Phone</p>
                <p className="text-lg font-bold">{attendee.phone}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-[#57534e]">Class & Section</p>
                <p className="text-lg font-bold">{attendee.class} - {attendee.section}</p>
              </div>
            </div>

            {attendee.isCheckedIn && (
              <div className="mt-6 p-4 bg-green-100 border-2 border-green-500 rounded-lg text-center">
                <p className="text-green-800 font-bold">✓ Checked In</p>
              </div>
            )}
          </div>

          {/* Token */}
          <div className="p-4 bg-[#473b47] text-center">
            <p className="text-white text-xs font-mono break-all">
              Token: {attendee.ticketToken}
            </p>
          </div>
        </div>

        {/* Event Details - Below Ticket */}
        <div className="mt-8 bg-white rounded-2xl border-4 border-[#473b47] p-6 shadow-lg">
          <h3 className="text-xl font-black text-[#1c1917] mb-4">Event Details</h3>
          <div className="space-y-3">
            {/* Date */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-[#5e6fe5]/10 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-[#5e6fe5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-[#57534e] mb-1">Date</div>
                <div className="text-lg font-bold text-[#1c1917]">{new Date(attendee.event.date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</div>
              </div>
            </div>

            {/* Time */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-[#65c3b5]/10 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-[#65c3b5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-[#57534e] mb-1">Time</div>
                <div className="text-lg font-bold text-[#1c1917]">{attendee.event.time}</div>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-[#ec3750]/10 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-[#ec3750]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-[#57534e] mb-1">Location</div>
                <div className="text-lg font-bold text-[#1c1917]">{attendee.event.location}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center space-x-4">
          <Link
            href="/events"
            className="inline-block px-6 py-3 bg-[#65c3b5] text-white font-bold rounded-full hover:bg-[#5ab8a8] transition-colors"
          >
            Browse More Events
          </Link>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-[#57534e] text-white font-bold rounded-full hover:bg-[#44403c] transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
