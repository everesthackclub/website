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

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-8 text-center">
          <Link href="/events" className="text-[#57534e] hover:text-[#1c1917] font-medium mb-4 inline-block">
            ← Back to Events
          </Link>
          <h1 className="text-4xl font-black text-[#1c1917] mb-2">
            RSVP for {event.name}
          </h1>
        </div>

        <div className="bg-white rounded-xl p-8 border border-[#e7e5e4]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-bold text-[#1c1917] mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-[#e7e5e4] rounded-lg text-[#1c1917] focus:outline-none focus:ring-2 focus:ring-[#ec3750]"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-bold text-[#1c1917] mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-[#e7e5e4] rounded-lg text-[#1c1917] focus:outline-none focus:ring-2 focus:ring-[#ec3750]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-bold text-[#1c1917] mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-[#e7e5e4] rounded-lg text-[#1c1917] focus:outline-none focus:ring-2 focus:ring-[#ec3750]"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-bold text-[#1c1917] mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-[#e7e5e4] rounded-lg text-[#1c1917] focus:outline-none focus:ring-2 focus:ring-[#ec3750]"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="class" className="block text-sm font-bold text-[#1c1917] mb-2">
                  Class
                </label>
                <input
                  type="text"
                  id="class"
                  name="class"
                  value={formData.class}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-[#e7e5e4] rounded-lg text-[#1c1917] focus:outline-none focus:ring-2 focus:ring-[#ec3750]"
                />
              </div>

              <div>
                <label htmlFor="section" className="block text-sm font-bold text-[#1c1917] mb-2">
                  Section
                </label>
                <input
                  type="text"
                  id="section"
                  name="section"
                  value={formData.section}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-[#e7e5e4] rounded-lg text-[#1c1917] focus:outline-none focus:ring-2 focus:ring-[#ec3750]"
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-3.5 bg-[#ec3750] text-white font-bold rounded-full hover:bg-[#d11941] hover:scale-105 active:scale-100 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isSubmitting ? "Submitting..." : "Complete RSVP"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}