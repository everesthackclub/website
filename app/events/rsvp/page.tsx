"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function RSVPPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    class: "",
    section: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong");
        setIsSubmitting(false);
        return;
      }

      // Success - redirect to ticket page
      router.push(`/events/rsvp/ticket?token=${data.ticketToken}`);
    } catch (err) {
      console.error("RSVP error:", err);
      setError("Network error. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

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

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl sm:text-6xl font-black text-[#1c1917] mb-3">
            RSVP
          </h1>
          <p className="text-lg text-[#57534e]">
            Reserve your spot for the next hack session
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-sm border border-[#e7e5e4]">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Row */}
            <div className="grid sm:grid-cols-2 gap-5">
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
                  className="w-full px-4 py-3 border border-[#e7e5e4] rounded-lg text-[#1c1917] focus:outline-none focus:ring-2 focus:ring-[#5e6fe5] focus:border-transparent"
                  placeholder="John"
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
                  className="w-full px-4 py-3 border border-[#e7e5e4] rounded-lg text-[#1c1917] focus:outline-none focus:ring-2 focus:ring-[#5e6fe5] focus:border-transparent"
                  placeholder="Doe"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-[#1c1917] mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-[#e7e5e4] rounded-lg text-[#1c1917] focus:outline-none focus:ring-2 focus:ring-[#5e6fe5] focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>

            {/* Phone */}
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
                className="w-full px-4 py-3 border border-[#e7e5e4] rounded-lg text-[#1c1917] focus:outline-none focus:ring-2 focus:ring-[#5e6fe5] focus:border-transparent"
                placeholder="98XXXXXXXX"
              />
            </div>

            {/* Class & Section Row */}
            <div className="grid sm:grid-cols-2 gap-5">
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
                  className="w-full px-4 py-3 border border-[#e7e5e4] rounded-lg text-[#1c1917] focus:outline-none focus:ring-2 focus:ring-[#5e6fe5] focus:border-transparent"
                  placeholder="12"
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
                  className="w-full px-4 py-3 border border-[#e7e5e4] rounded-lg text-[#1c1917] focus:outline-none focus:ring-2 focus:ring-[#5e6fe5] focus:border-transparent"
                  placeholder="A"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-3.5 bg-[#5e6fe5] text-white font-bold text-lg rounded-full hover:bg-[#5167dd] hover:scale-105 active:scale-100 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isSubmitting ? "Submitting..." : "Get My Ticket →"}
            </button>
          </form>
        </div>

        {/* Back Link */}
        <div className="text-center mt-8">
          <Link href="/events" className="text-[#57534e] hover:text-[#1c1917] font-medium">
            ← Back to Events
          </Link>
        </div>
      </div>
    </div>
  );
}
