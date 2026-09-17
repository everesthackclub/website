"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";

interface Attendee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  college: string;
  phoneNumber: string;
  year: string;
  createdAt: string;
}

interface Event {
  id: string;
  name: string;
  description?: string;
  eventDate: string;
  time: string;
  location: string;
}

export default function EventTicketPage({ params }: { params: Promise<{ eventId: string }> }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const attendeeId = searchParams.get("attendeeId");
  
  const [eventId, setEventId] = useState<string>("");
  const [event, setEvent] = useState<Event | null>(null);
  const [attendee, setAttendee] = useState<Attendee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const init = async () => {
      const { eventId: id } = await params;
      setEventId(id);
      
      if (!attendeeId) {
        setError("Missing attendee ID");
        setIsLoading(false);
        return;
      }
      
      await Promise.all([
        loadEvent(id),
        loadAttendee(attendeeId)
      ]);
    };
    init();
  }, [params, attendeeId]);

  const loadEvent = async (id: string) => {
    try {
      const response = await fetch(`/api/events`);
      const data = await response.json();

      if (response.ok && data.events) {
        const foundEvent = data.events.find((e: Event) => e.id === id);
        if (foundEvent) {
          setEvent(foundEvent);
        }
      }
    } catch (error) {
      console.error("Load event error:", error);
    }
  };

  const loadAttendee = async (id: string) => {
    try {
      const response = await fetch(`/api/attendee/${id}`);
      const data = await response.json();

      if (response.ok && data.attendee) {
        setAttendee(data.attendee);
      } else {
        setError("Attendee not found");
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Load attendee error:", error);
      setError("Failed to load ticket");
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

  if (error || !attendee || !event) {
    return (
      <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#1c1917] mb-2">
            {error || "Ticket Not Found"}
          </h1>
          <Link href="/events" className="text-[#5e6fe5] font-medium hover:text-[#5167dd]">
            ← Back to Events
          </Link>
        </div>
      </div>
    );
  }

  // Generate QR code data
  const qrData = JSON.stringify({
    attendeeId: attendee.id,
    eventId: event.id,
    email: attendee.email,
    name: `${attendee.firstName} ${attendee.lastName}`,
  });

  return (
    <div className="min-h-screen bg-[#fafaf9] py-12">
      <div className="max-w-md mx-auto px-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-[#1c1917] mb-2">
            Your Event Ticket
          </h1>
          <p className="text-[#57534e]">
            Save this QR code for event check-in
          </p>
        </div>

        {/* Ticket Card */}
        <div className="bg-white rounded-xl border border-[#e7e5e4] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#ec3750] to-[#5e6fe5] p-6 text-center">
            <h2 className="text-2xl font-black text-white mb-1">
              Everest Hack Club
            </h2>
            <p className="text-white/90 text-sm font-medium">
              Event Ticket
            </p>
          </div>

          {/* Event Info */}
          <div className="p-6">
            <h3 className="text-xl font-black text-[#1c1917] mb-4 text-center">
              {event.name}
            </h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-[#57534e] text-sm">Date</span>
                <span className="font-bold text-[#1c1917] text-sm">
                  {new Date(event.eventDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#57534e] text-sm">Time</span>
                <span className="font-bold text-[#1c1917] text-sm">
                  {event.time}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#57534e] text-sm">Location</span>
                <span className="font-bold text-[#1c1917] text-sm">
                  {event.location}
                </span>
              </div>
            </div>

            {/* QR Code */}
            <div className="text-center mb-6">
              <div className="inline-block p-4 bg-white border-2 border-[#e7e5e4] rounded-xl">
                <QRCodeSVG
                  value={qrData}
                  size={200}
                  level="M"
                  includeMargin={false}
                />
              </div>
              <p className="text-xs text-[#57534e] mt-2">
                Present this QR code at the event
              </p>
            </div>

            {/* Attendee Info */}
            <div className="border-t border-[#e7e5e4] pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-[#57534e] text-sm">Name</span>
                <span className="font-bold text-[#1c1917] text-sm">
                  {attendee.firstName} {attendee.lastName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#57534e] text-sm">Email</span>
                <span className="font-bold text-[#1c1917] text-sm">
                  {attendee.email}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#57534e] text-sm">College</span>
                <span className="font-bold text-[#1c1917] text-sm">
                  {attendee.college}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#57534e] text-sm">Year</span>
                <span className="font-bold text-[#1c1917] text-sm">
                  {attendee.year}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-[#fafaf9] p-4 text-center border-t border-[#e7e5e4]">
            <p className="text-xs text-[#57534e]">
              Registered on {new Date(attendee.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 space-y-3">
          <button
            onClick={() => window.print()}
            className="w-full px-6 py-3 bg-[#5e6fe5] text-white font-bold rounded-full hover:bg-[#5167dd] transition-colors"
          >
            Print Ticket
          </button>
          
          <Link
            href="/events"
            className="block w-full px-6 py-3 bg-white border border-[#e7e5e4] text-[#1c1917] font-bold rounded-full hover:border-[#1c1917] text-center transition-colors"
          >
            Back to Events
          </Link>
        </div>

        {/* Important Note */}
        <div className="mt-6 p-4 bg-[#fef3cd] border border-[#facc15] rounded-lg">
          <p className="text-sm text-[#92400e] font-medium">
            <strong>Important:</strong> Screenshot or save this QR code. You'll need it to check in at the event.
          </p>
        </div>
      </div>
    </div>
  );
}