"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";

interface AttendeeData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  class: string;
  section: string;
  isCheckedIn: boolean;
  checkedInAt: string | null;
  createdAt: string;
}

export default function TicketPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [attendee, setAttendee] = useState<AttendeeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setError("No ticket token provided");
      setLoading(false);
      return;
    }

    const fetchTicket = async () => {
      try {
        const response = await fetch(`/api/rsvp/ticket?token=${token}`);
        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Failed to load ticket");
          setLoading(false);
          return;
        }

        setAttendee(data.attendee);
        setLoading(false);
      } catch (err) {
        console.error("Ticket fetch error:", err);
        setError("Network error. Please try again.");
        setLoading(false);
      }
    };

    fetchTicket();
  }, [token]);

  if (loading) {
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
      <div className="min-h-screen bg-[#fafaf9]">
        <Image
          src="/topbar-everest.svg"
          alt=""
          role="presentation"
          width={1920}
          height={80}
          className="h-auto w-full"
          priority
        />
        <div className="max-w-2xl mx-auto px-6 py-16">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <div className="text-5xl mb-4">❌</div>
            <h1 className="text-3xl font-black text-red-700 mb-3">Ticket Not Found</h1>
            <p className="text-red-600 mb-6">{error}</p>
            <Link
              href="/events/rsvp"
              className="inline-block px-6 py-3 bg-[#5e6fe5] text-white font-bold rounded-full hover:bg-[#5167dd] hover:scale-105 active:scale-100 transition-all"
            >
              Back to RSVP
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      {/* Top Bar */}
      <Image
        src="/topbar-everest.svg"
        alt=""
        role="presentation"
        width={1920}
        height={80}
        className="h-auto w-full"
        priority
      />

      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-bold mb-4">
            ✓ RSVP Confirmed
          </div>
          <h1 className="text-5xl sm:text-6xl font-black text-[#1c1917] mb-2">
            Your Ticket
          </h1>
          {attendee.isCheckedIn && (
            <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-bold mt-2">
              ✓ Checked In
            </div>
          )}
        </div>

        {/* Ticket Card */}
        <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-sm border border-[#e7e5e4] mb-6">
          {/* QR Code - Center */}
          <div className="flex justify-center mb-8">
            <div className="bg-white p-4 rounded-xl border-2 border-[#e7e5e4]">
              <QRCodeSVG
                value={token || ""}
                size={240}
                level="H"
                includeMargin={false}
              />
            </div>
          </div>

          <p className="text-center text-sm text-[#57534e] mb-8">
            Show this QR code at the event entrance
          </p>

          {/* Attendee Info */}
          <div className="border-t border-[#e7e5e4] pt-6">
            <h2 className="text-2xl font-black text-[#1c1917] mb-4">
              {attendee.firstName} {attendee.lastName}
            </h2>
            <div className="space-y-2 text-[#57534e]">
              <p>
                <span className="font-bold text-[#1c1917]">Email:</span> {attendee.email}
              </p>
              <p>
                <span className="font-bold text-[#1c1917]">Phone:</span> {attendee.phone}
              </p>
              <p>
                <span className="font-bold text-[#1c1917]">Class:</span> {attendee.class} • Section {attendee.section}
              </p>
            </div>
          </div>
        </div>

        {/* Event Info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e7e5e4] mb-6">
          <h3 className="text-lg font-black text-[#1c1917] mb-3">Event Details</h3>
          <div className="space-y-1 text-sm text-[#57534e]">
            <p><span className="font-bold text-[#1c1917]">📅</span> Friday, September 4</p>
            <p><span className="font-bold text-[#1c1917]">🕐</span> 9:00 AM - 11:00 AM</p>
            <p><span className="font-bold text-[#1c1917]">📍</span> Everest College, Biratnagar</p>
          </div>
        </div>

        {/* What to Bring */}
        <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 mb-8">
          <h3 className="text-lg font-black text-[#1c1917] mb-3">What to Bring</h3>
          <ul className="space-y-1 text-sm text-[#57534e]">
            <li>• Your laptop and charger</li>
            <li>• This QR code (screenshot recommended)</li>
            <li>• A notebook (optional)</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/events"
            className="px-6 py-3 bg-[#5e6fe5] text-white font-bold rounded-full hover:bg-[#5167dd] hover:scale-105 active:scale-100 transition-all"
          >
            Back to Events
          </Link>
          <Link
            href="/"
            className="px-6 py-3 bg-white border border-[#e7e5e4] text-[#1c1917] font-bold rounded-full hover:border-[#1c1917] hover:scale-105 active:scale-100 transition-all"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
