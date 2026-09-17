"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewEventPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "",
    time: "",
    location: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/organizer/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to create event");
        setIsSubmitting(false);
        return;
      }

      router.push("/organizer/events");
    } catch (err) {
      console.error("Create event error:", err);
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
            <Link href="/organizer/events" className="text-[#57534e] hover:text-[#1c1917] font-medium">
              ← Back to Events
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-black text-[#1c1917] mb-2">Create New Event</h1>
            <p className="text-[#57534e]">Set up a new hack session</p>
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
                  placeholder="Weekly Hack Session"
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
                  placeholder="Brief description of the event"
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
                    placeholder="9:00 AM - 11:00 AM"
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
                  placeholder="Everest College, Biratnagar"
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
                {isSubmitting ? "Creating..." : "Create Event"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
