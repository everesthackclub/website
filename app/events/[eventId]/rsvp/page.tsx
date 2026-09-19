"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Event {
  id: string;
  name: string;
  description?: string;
  date: string;
  time: string;
  location: string;
  isFormOpen: boolean;
  isCompleted: boolean;
}

export default function EventRSVPPage({ params }: { params: Promise<{ eventId: string }> }) {
  const router = useRouter();
  const [eventId, setEventId] = useState<string>("");
  const [event, setEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    class: "",
    section: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const init = async () => {
      const { eventId: id } = await params;
      setEventId(id);
      await loadEvent(id);
    };
    init();
  }, [params]);

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
      setIsLoading(false);
    } catch (error) {
      console.error("Load event error:", error);
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, eventId }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to submit RSVP");
        setIsSubmitting(false);
        return;
      }

      // Store ticket token in cookie (expires in 1 year)
      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
      document.cookie = `ticketToken=${data.ticketToken}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;

      // Redirect to dashboard to show ticket
      router.push(`/dashboard`);
    } catch (err) {
      console.error("RSVP error:", err);
      setError("Network error. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
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

  if (!event) {
    return (
      <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#1c1917] mb-2">Event Not Found</h1>
          <Link href="/events" className="text-[#5e6fe5] font-medium hover:text-[#5167dd]">
            ← Back to Events
          </Link>
        </div>
      </div>
    );
  }

  // Check if event is completed
  if (event.isCompleted) {
    return (
      <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-black text-[#1c1917] mb-2">Event Has Ended</h1>
          <p className="text-[#57534e] mb-6">
            This event has been completed. Registration is no longer available.
          </p>
          <Link
            href="/events"
            className="inline-block px-6 py-3 bg-[#5e6fe5] text-white font-bold rounded-full hover:bg-[#5167dd]"
          >
            View Other Events
          </Link>
        </div>
      </div>
    );
  }

  // Check if form is closed
  if (!event.isFormOpen) {
    return (
      <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">⏸️</div>
          <h1 className="text-2xl font-black text-[#1c1917] mb-2">Registration Closed</h1>
          <p className="text-[#57534e] mb-6">
            RSVP form for this event is currently closed. Please check back later or contact the organizers.
          </p>
          <Link
            href="/events"
            className="inline-block px-6 py-3 bg-[#5e6fe5] text-white font-bold rounded-full hover:bg-[#5167dd]"
          >
            View Other Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-6 sm:mb-8">
          <Link href="/events" className="inline-flex items-center gap-2 text-[#57534e] hover:text-[#1c1917] font-medium mb-4 transition-colors">
            <span>←</span> Back to Events
          </Link>
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1c1917] mb-2">
              {event.name}
            </h1>
            <p className="text-[#57534e] text-sm sm:text-base">Fill out the form below to reserve your spot</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border-2 border-[#e7e5e4] p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-bold text-[#1c1917] mb-2">
                  First Name <span className="text-[#ec3750]">*</span>
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  required
                  className="w-full px-4 py-3 border-2 border-[#e7e5e4] rounded-lg text-[#1c1917] placeholder:text-[#a8a29e] focus:outline-none focus:ring-2 focus:ring-[#5e6fe5] focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-bold text-[#1c1917] mb-2">
                  Last Name <span className="text-[#ec3750]">*</span>
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  required
                  className="w-full px-4 py-3 border-2 border-[#e7e5e4] rounded-lg text-[#1c1917] placeholder:text-[#a8a29e] focus:outline-none focus:ring-2 focus:ring-[#5e6fe5] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-bold text-[#1c1917] mb-2">
                Email Address <span className="text-[#ec3750]">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john.doe@example.com"
                required
                className="w-full px-4 py-3 border-2 border-[#e7e5e4] rounded-lg text-[#1c1917] placeholder:text-[#a8a29e] focus:outline-none focus:ring-2 focus:ring-[#5e6fe5] focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-bold text-[#1c1917] mb-2">
                Phone Number <span className="text-[#ec3750]">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="9123456789"
                required
                className="w-full px-4 py-3 border-2 border-[#e7e5e4] rounded-lg text-[#1c1917] placeholder:text-[#a8a29e] focus:outline-none focus:ring-2 focus:ring-[#5e6fe5] focus:border-transparent transition-all"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label htmlFor="class" className="block text-sm font-bold text-[#1c1917] mb-2">
                  Class <span className="text-[#ec3750]">*</span>
                </label>
                <input
                  type="text"
                  id="class"
                  name="class"
                  value={formData.class}
                  onChange={handleChange}
                  placeholder="10"
                  required
                  className="w-full px-4 py-3 border-2 border-[#e7e5e4] rounded-lg text-[#1c1917] placeholder:text-[#a8a29e] focus:outline-none focus:ring-2 focus:ring-[#5e6fe5] focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label htmlFor="section" className="block text-sm font-bold text-[#1c1917] mb-2">
                  Section <span className="text-[#ec3750]">*</span>
                </label>
                <input
                  type="text"
                  id="section"
                  name="section"
                  value={formData.section}
                  onChange={handleChange}
                  placeholder="A"
                  required
                  className="w-full px-4 py-3 border-2 border-[#e7e5e4] rounded-lg text-[#1c1917] placeholder:text-[#a8a29e] focus:outline-none focus:ring-2 focus:ring-[#5e6fe5] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg animate-shake">
                <p className="text-red-700 text-sm font-bold">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-4 bg-[#5e6fe5] text-white text-lg font-black rounded-full hover:bg-[#4c5bc5] hover:scale-105 active:scale-95 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isSubmitting ? "Submitting..." : "Complete RSVP"}
            </button>

            <p className="text-xs text-center text-[#57534e]">
              You will receive your ticket after completing this form
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}