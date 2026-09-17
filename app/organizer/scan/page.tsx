"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BrowserQRCodeReader } from "@zxing/browser";

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState<string>("");
  const [isMobile, setIsMobile] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const codeReaderRef = useRef<BrowserQRCodeReader | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const lastScanRef = useRef<string>("");
  const processingRef = useRef<boolean>(false);

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
    if (!isAuthenticated || !selectedEventId || !videoRef.current || isScanning) return;

    const startScanning = async () => {
      try {
        setCameraError("");
        const codeReader = new BrowserQRCodeReader();
        codeReaderRef.current = codeReader;

        // Get available devices
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        
        if (videoDevices.length === 0) {
          setCameraError("No camera found on this device");
          return;
        }

        // Use back camera on mobile if available
        const selectedDevice = videoDevices.find(device => 
          device.label.toLowerCase().includes('back')
        ) || videoDevices[0];

        setIsScanning(true);

        // Store the stream for cleanup
        const videoElement = videoRef.current;
        if (!videoElement) return;

        await codeReader.decodeFromVideoDevice(
          selectedDevice.deviceId,
          videoElement,
          async (result, error) => {
            if (result) {
              const ticketToken = result.getText();
              
              // Prevent duplicate scans - ignore if we're already processing or if it's the same code
              if (processingRef.current || lastScanRef.current === ticketToken) {
                return;
              }

              // Mark as processing
              processingRef.current = true;
              lastScanRef.current = ticketToken;
              setIsProcessing(true);

              try {
                const response = await fetch("/api/check-in", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ 
                    ticketToken,
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

                // Resume scanning after 3 seconds
                setTimeout(() => {
                  setScanResult(null);
                  setIsProcessing(false);
                  processingRef.current = false;
                  // Clear last scan after cooldown so same QR can be scanned again
                  setTimeout(() => {
                    lastScanRef.current = "";
                  }, 2000);
                }, 3000);
              } catch (error) {
                console.error("Check-in error:", error);
                setScanResult({
                  success: false,
                  error: "Network error. Please try again.",
                });

                setTimeout(() => {
                  setScanResult(null);
                  setIsProcessing(false);
                  processingRef.current = false;
                  setTimeout(() => {
                    lastScanRef.current = "";
                  }, 2000);
                }, 3000);
              }
            }
          }
        );
      } catch (error: any) {
        console.error("Scanner error:", error);
        setCameraError(error?.message || "Failed to start camera. Please check permissions.");
        setIsScanning(false);
      }
    };

    startScanning();

    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isAuthenticated, selectedEventId, isScanning]);

  const handleLogout = async () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
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
              if (videoRef.current?.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
              }
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
            {cameraError && (
              <div className="p-4 bg-red-50 border-b border-red-200">
                <p className="text-red-700 font-bold text-center">{cameraError}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="mt-2 w-full px-4 py-2 bg-red-600 text-white rounded-lg font-bold"
                >
                  Reload Page
                </button>
              </div>
            )}
            
            {/* Camera Feed with Scanner Frame */}
            <div className="relative bg-black flex items-center justify-center flex-1 overflow-hidden" style={{ minHeight: '60vh' }}>
              <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover"
                playsInline
                muted
              />
              
              {/* Scanner Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {/* Dark overlay with cutout effect */}
                <div className="absolute inset-0" style={{
                  background: 'radial-gradient(circle at center, transparent 0%, transparent 140px, rgba(0,0,0,0.7) 180px)'
                }}></div>
                
                {/* Scanning frame */}
                <div className="relative z-10" style={{ width: '280px', height: '280px' }}>
                  {/* Corner borders */}
                  <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-[#5e6fe5]"></div>
                  <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-[#5e6fe5]"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-[#5e6fe5]"></div>
                  <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-[#5e6fe5]"></div>
                  
                  {/* Center dot for aim */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3 h-3 bg-[#5e6fe5] rounded-full opacity-50"></div>
                  </div>
                  
                  {/* Scanning line animation */}
                  {isScanning && !isProcessing && (
                    <div className="absolute inset-0 overflow-hidden">
                      <div 
                        className="w-full h-1 bg-gradient-to-r from-transparent via-[#5e6fe5] to-transparent"
                        style={{
                          animation: 'scan 2s ease-in-out infinite',
                        }}
                      ></div>
                    </div>
                  )}
                  
                  {/* Processing indicator */}
                  {isProcessing && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#5e6fe5]/20 backdrop-blur-sm rounded-lg">
                      <div className="text-center">
                        <div className="inline-block w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mb-2"></div>
                        <p className="text-white font-bold text-sm">Processing...</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {!isScanning && !cameraError && (
                <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/70">
                  <div className="text-white text-center px-6 py-4 rounded-2xl">
                    <div className="inline-block w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mb-2"></div>
                    <p className="font-bold">Starting camera...</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Instructions */}
            {!scanResult && isScanning && !isProcessing && (
              <div className="bg-white p-4 border-t border-[#e7e5e4]">
                <p className="text-center text-[#57534e] font-medium">
                  📱 Align QR code within the frame
                </p>
              </div>
            )}
            
            {isProcessing && !scanResult && (
              <div className="bg-[#5e6fe5] p-4 border-t border-[#4c5bc5]">
                <p className="text-center text-white font-bold">
                  ⏳ Checking in...
                </p>
              </div>
            )}

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
              if (videoRef.current?.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
              }
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
            {cameraError && (
              <div className="p-6 bg-red-50 border border-red-200 rounded-2xl mb-6">
                <p className="text-red-700 font-bold text-center mb-3">{cameraError}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="w-full px-4 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700"
                >
                  Reload Page
                </button>
              </div>
            )}
            <div className="bg-black rounded-2xl overflow-hidden mb-6 relative flex items-center justify-center" style={{ minHeight: '500px', maxHeight: '70vh' }}>
              <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover"
                playsInline
                muted
              />
              
              {/* Scanner Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                {/* Dark overlay with radial cutout */}
                <div className="absolute inset-0" style={{
                  background: 'radial-gradient(circle at center, transparent 0%, transparent 200px, rgba(0,0,0,0.7) 260px)'
                }}></div>
                
                {/* Scanning frame */}
                <div className="relative z-10" style={{ width: '320px', height: '320px' }}>
                  {/* Corner borders */}
                  <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-[#5e6fe5]"></div>
                  <div className="absolute top-0 right-0 w-20 h-20 border-t-4 border-r-4 border-[#5e6fe5]"></div>
                  <div className="absolute bottom-0 left-0 w-20 h-20 border-b-4 border-l-4 border-[#5e6fe5]"></div>
                  <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-[#5e6fe5]"></div>
                  
                  {/* Center dot */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-4 h-4 bg-[#5e6fe5] rounded-full opacity-50"></div>
                  </div>
                  
                  {/* Scanning line animation */}
                  {isScanning && !isProcessing && (
                    <div className="absolute inset-0 overflow-hidden">
                      <div 
                        className="w-full h-1 bg-gradient-to-r from-transparent via-[#5e6fe5] to-transparent"
                        style={{
                          animation: 'scan 2s ease-in-out infinite',
                        }}
                      ></div>
                    </div>
                  )}
                  
                  {/* Processing indicator */}
                  {isProcessing && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#5e6fe5]/20 backdrop-blur-sm rounded-lg">
                      <div className="text-center">
                        <div className="inline-block w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mb-3"></div>
                        <p className="text-white font-bold text-lg">Processing...</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Instructions overlay */}
                {isScanning && !isProcessing && !scanResult && (
                  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-sm px-6 py-3 rounded-full">
                    <p className="text-white font-medium text-sm">📱 Align QR code within the frame</p>
                  </div>
                )}
              </div>
              
              {!isScanning && !cameraError && (
                <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/70">
                  <div className="text-white text-center">
                    <div className="inline-block w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-lg font-bold">Starting camera...</p>
                  </div>
                </div>
              )}
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
