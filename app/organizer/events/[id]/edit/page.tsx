"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [eventId, setEventId] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "",
    time: "",
    location: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const init = async () => {
      const { id } = await params;
      setEventId(id);

      try {
        const response = await fetch(`/api/organizer/events/${id}`);
        const data = await response.json();

        if (response.ok && data.event) {
          const event = data.event;
          let dateString = "";
          
          // Handle eventDate parsing safely
          if (event.eventDate) {
            const eventDate = new Date(event.eventDate);
            if (!isNaN(eventDate.getTime())) {
              dateString = eventDate.toISOString().split("T")[0];
            }
          }
          
          setFormData({
            name: event.name,
            description: event.description || "",
            date: dateString,
            time: event.time,
            location: event.location,
          });
        }
        setIsLoading(false);
      } catch (err) {
        console.error("Load event error:", err);
        setError("Failed to load event");
        setIsLoading(false);
      }
    };

    init();
  }, [params]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const updateData = {
        name: formData.name,
        description: formData.description,
        eventDate: new Date(`${formData.date}T12:00:00.000Z`).toISOString(),
        time: formData.time,
        location: formData.location,
      };

      const response = await fetch(`/api/organizer/events/${eventId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to update event");
        setIsSubmitting(false);
        return;
      }

      router.push(`/organizer/events/${eventId}`);
    } catch (err) {
      console.error("Update event error:", err);
      setError("Network error. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  return (
    <div className="min-h-screen bg-[#fafaf9] flex">
      {/* Sidebar */}
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
          <Link href="/organizer/events" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#ec3750] text-white font-bold">
            Events
          </Link>
          <Link href="/organizer/scan" className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#57534e] hover:bg-[#f5f5f4] font-medium">
            Scanner
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8 max-w-3xl mx-auto">
          <div className="mb-6">
            <Link href={`/organizer/events/${eventId}`} className="text-[#57534e] hover:text-[#1c1917] font-medium">
              ← Back to Event
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-black text-[#1c1917] mb-2">Edit Event</h1>
            <p className="text-[#57534e]">Update event details</p>
          </div>

          <div className="bg-white rounded-xl p-8 border border-[#e7e5e4]">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-bold text-[#1c1917] mb-2">
                  Event Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-[#e7e5e4] rounded-lg text-[#1c1917] focus:outline-none focus:ring-2 focus:ring-[#ec3750]"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-bold text-[#1c1917] mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-[#e7e5e4] rounded-lg text-[#1c1917] focus:outline-none focus:ring-2 focus:ring-[#ec3750]"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="date" className="block text-sm font-bold text-[#1c1917] mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-[#e7e5e4] rounded-lg text-[#1c1917] focus:outline-none focus:ring-2 focus:ring-[#ec3750]"
                  />
                </div>

                <div>
                  <label htmlFor="time" className="block text-sm font-bold text-[#1c1917] mb-2">
                    Time
                  </label>
                  <input
                    type="text"
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-[#e7e5e4] rounded-lg text-[#1c1917] focus:outline-none focus:ring-2 focus:ring-[#ec3750]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-bold text-[#1c1917] mb-2">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-[#e7e5e4] rounded-lg text-[#1c1917] focus:outline-none focus:ring-2 focus:ring-[#ec3750]"
                />
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
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
