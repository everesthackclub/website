"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Html5QrcodeScanner } from "html5-qrcode";

interface Event {
  id: string;
  name: string;
  date: string;
  isActive: boolean;
}

interface ScanResult {
  success: boolean;
  attendee?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    class: string;
    section: string;
  };
  message?: string;
  error?: string;
}

export default function ScannerPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    setIsMobile(window.innerWidth < 1024);
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Check auth and load events
  useEffect(() => {
    const init = async () => {
      try {
        const authRes = await fetch("/api/organizer/me");
        if (!authRes.ok) {
          router.push("/organizer/login");
          return;
        }

        const eventsRes = await fetch("/api/events");
        const eventsData = await eventsRes.json();
        setEvents(eventsData.events || []);
        
        // Auto-select active event
        const activeEvent = eventsData.events?.find((e: Event) => e.isActive);
        if (activeEvent) {
          setSelectedEventId(activeEvent.id);
        } else if (eventsData.events?.length > 0) {
          setSelectedEventId(eventsData.events[0].id);
        }

        setIsAuthenticated(true);
        setIsLoading(false);
      } catch (error) {
        console.error("Init failed:", error);
        router.push("/organizer/login");
      }
    };

    init();
  }, [router]);

  // Initialize scanner
  useEffect(() => {
    if (!isAuthenticated || isScanning || !selectedEventId) return;

    let scanner: Html5QrcodeScanner | null = null;

    const initScanner = () => {
      scanner = new Html5QrcodeScanner(
        "reader",
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        false
      );

      scanner.render(
        async (decodedText) => {
          if (scanner) scanner.pause(true);

          try {
            const response = await fetch("/api/check-in", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ 
                ticketToken: decodedText,
                eventId: selectedEventId 
              }),
            });

            const data = await response.json();

            if (response.ok) {
              setScanResult({
                success: true,
                attendee: data.attendee,
                message: data.message,
              });
            } else {
              setScanResult({
                success: false,
                error: data.error || "Check-in failed",
                message: data.message,
                attendee: data.attendee,
              });
            }

            setTimeout(() => {
              setScanResult(null);
              if (scanner) scanner.resume();
            }, 3000);
          } catch (error) {
            console.error("Check-in error:", error);
            setScanResult({
              success: false,
              error: "Network error. Please try again.",
            });

            setTimeout(() => {
              setScanResult(null);
              if (scanner) scanner.resume();
            }, 3000);
          }
        },
        (errorMessage) => {
          console.debug("QR scan error:", errorMessage);
        }
      );

      setIsScanning(true);
    };

    initScanner();

    return () => {
      if (scanner) {
        scanner.clear().catch((error) => {
          console.error("Failed to clear scanner:", error);
        });
      }
    };
  }, [isAuthenticated, isScanning, selectedEventId]);

  const handleLogout = async () => {
    try {
      await fetch("/api/organizer/logout", { method: "POST" });
      router.push("/organizer/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
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

  // Mobile-only view
  if (isMobile) {
    return (
      <div className="min-h-screen bg-[#fafaf9] flex flex-col">
        <div className="bg-white border-b border-[#e7e5e4] p-4">
          <h1 className="text-2xl font-black text-[#1c1917] mb-3">Scanner</h1>
          <select
            value={selectedEventId}
            onChange={(e) => {
              setSelectedEventId(e.target.value);
              setIsScanning(false);
            }}
            className="w-full px-4 py-3 border border-[#e7e5e4] rounded-lg text-[#1c1917] font-bold focus:outline-none focus:ring-2 focus:ring-[#ec3750]"
          >
            <option value="">Select Event</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.name} {event.isActive && "(Active)"}
              </option>
            ))}
          </select>
        </div>

        {selectedEventId && (
          <div className="flex-1 flex flex-col">
            <div className="bg-white border-b border-[#e7e5e4]">
              <div id="reader" className="w-full"></div>
            </div>

            {scanResult && (
              <div className={`p-6 ${scanResult.success ? "bg-green-50" : "bg-red-50"}`}>
                <div className="text-center">
                  <div className="text-5xl mb-3">
                    {scanResult.success ? "✓" : "✗"}
                  </div>
                  <h2 className={`text-2xl font-black mb-3 ${scanResult.success ? "text-green-700" : "text-red-700"}`}>
                    {scanResult.success ? "Checked In!" : scanResult.error}
                  </h2>
                  {scanResult.attendee && (
                    <div className="bg-white rounded-xl p-5 mb-3 border border-[#e7e5e4]">
                      <h3 className="text-xl font-black text-[#1c1917] mb-2">
                        {scanResult.attendee.firstName} {scanResult.attendee.lastName}
                      </h3>
                      <div className="space-y-1 text-sm text-[#57534e]">
                        <p>{scanResult.attendee.email}</p>
                        <p>Class {scanResult.attendee.class}-{scanResult.attendee.section}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-3 gap-3 p-4 bg-white border-t border-[#e7e5e4]">
          <Link href="/organizer/dashboard" className="px-4 py-3 bg-white border border-[#e7e5e4] rounded-lg text-center font-bold text-[#1c1917]">
            Dashboard
          </Link>
          <Link href="/organizer/hackers" className="px-4 py-3 bg-white border border-[#e7e5e4] rounded-lg text-center font-bold text-[#1c1917]">
            Hackers
          </Link>
          <Link href="/organizer/events" className="px-4 py-3 bg-white border border-[#e7e5e4] rounded-lg text-center font-bold text-[#1c1917]">
            Events
          </Link>
        </div>
      </div>
    );
  }

  // Desktop view with sidebar
  return (
    <div className="min-h-screen bg-[#fafaf9] flex">
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
          <Link href="/organizer/events" className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#57534e] hover:bg-[#f5f5f4] font-medium">
            Events
          </Link>
          <Link href="/organizer/scan" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#ec3750] text-white font-bold">
            Scanner
          </Link>
        </nav>

        <div className="p-4 border-t border-[#e7e5e4]">
          <button onClick={handleLogout} className="w-full px-4 py-2 text-sm text-[#57534e] hover:text-[#ec3750] font-medium">
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto p-6 lg:p-8 max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-black text-[#1c1917] mb-4">Scanner</h1>
          
          <label className="block text-sm font-bold text-[#1c1917] mb-2">Select Event</label>
          <select
            value={selectedEventId}
            onChange={(e) => {
              setSelectedEventId(e.target.value);
              setIsScanning(false);
            }}
            className="w-full max-w-md px-4 py-3 border border-[#e7e5e4] rounded-lg text-[#1c1917] font-bold focus:outline-none focus:ring-2 focus:ring-[#ec3750]"
          >
            <option value="">Select Event</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.name} {event.isActive && "(Active)"}
              </option>
            ))}
          </select>
        </div>

        {selectedEventId && (
          <>
            <div className="bg-white rounded-2xl overflow-hidden border border-[#e7e5e4] mb-6">
              <div id="reader" className="w-full"></div>
            </div>

            {scanResult && (
              <div className={`rounded-2xl p-6 border ${scanResult.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                <div className="text-center">
                  <div className="text-5xl mb-3">{scanResult.success ? "✓" : "✗"}</div>
                  <h2 className={`text-2xl font-black mb-3 ${scanResult.success ? "text-green-700" : "text-red-700"}`}>
                    {scanResult.success ? "Checked In!" : scanResult.error}
                  </h2>
                  {scanResult.attendee && (
                    <div className="bg-white rounded-xl p-5 mb-3 border border-[#e7e5e4]">
                      <h3 className="text-xl font-black text-[#1c1917] mb-2">
                        {scanResult.attendee.firstName} {scanResult.attendee.lastName}
                      </h3>
                      <div className="space-y-1 text-sm text-[#57534e] text-left">
                        <p><span className="font-bold text-[#1c1917]">Email:</span> {scanResult.attendee.email}</p>
                        <p><span className="font-bold text-[#1c1917]">Phone:</span> {scanResult.attendee.phone}</p>
                        <p><span className="font-bold text-[#1c1917]">Class:</span> {scanResult.attendee.class}-{scanResult.attendee.section}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
