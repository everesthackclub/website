"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function OrganizerLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/organizer/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed");
        setIsSubmitting(false);
        return;
      }

      // Success - redirect to dashboard
      router.push("/organizer/dashboard");
    } catch (err) {
      console.error("Login error:", err);
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
    <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-10">
          <Image
            src="/Image/logo2.svg"
            alt="Everest Hack Club"
            width={64}
            height={64}
            className="mx-auto mb-4"
          />
          <h1 className="text-4xl font-black text-[#1c1917] mb-2">
            Organizer Login
          </h1>
          <p className="text-[#57534e]">
            Sign in to manage check-ins
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#e7e5e4]">
          <form onSubmit={handleSubmit} className="space-y-5">
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
                autoComplete="email"
                className="w-full px-4 py-3 border border-[#e7e5e4] rounded-lg text-[#1c1917] focus:outline-none focus:ring-2 focus:ring-[#5e6fe5] focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-[#1c1917] mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
                className="w-full px-4 py-3 border border-[#e7e5e4] rounded-lg text-[#1c1917] focus:outline-none focus:ring-2 focus:ring-[#5e6fe5] focus:border-transparent"
                placeholder="••••••••"
              />
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
              className="w-full px-6 py-3.5 bg-[#5e6fe5] text-white font-bold rounded-full hover:bg-[#5167dd] hover:scale-105 active:scale-100 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>

        {/* Back Link */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-[#57534e] hover:text-[#1c1917] font-medium">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
