import Image from "next/image";
import Link from "next/link";
import Navbar from "../components/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Everest Hack Club",
  description: "Get in touch with Everest Hack Club in Biratnagar, Nepal. Join our student coding community and start building amazing projects.",
};

export default function Contact() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Background */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
      <div className="fixed inset-0 -z-10 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] [background-size:64px_64px] opacity-30" />

      {/* Contact Section */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <Image
                src="/Image/flag-standalone.svg"
                alt="Hack Club"
                width={80}
                height={80}
                className="opacity-80"
              />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-black mb-6">
              Let's Build Together
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ready to join Everest Hack Club? Get in touch and we'll guide you through the next steps.
            </p>
          </div>

          {/* Contact Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* WhatsApp Card */}
            <a
              href="https://wa.me/9779709154661"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-8 bg-white rounded-2xl border border-gray-200 hover:border-green-500 hover:shadow-xl transition-all duration-300"
            >
              <div className="text-5xl mb-4">💬</div>
              <h3 className="text-2xl font-bold text-black mb-2">WhatsApp</h3>
              <p className="text-gray-600 mb-4">
                Send us a message and we'll add you to our community group.
              </p>
              <span className="inline-flex items-center gap-2 text-green-600 font-semibold group-hover:gap-3 transition-all">
                Chat with us
                <span>→</span>
              </span>
            </a>

            {/* Location Card */}
            <div className="p-8 bg-gradient-to-br from-red-50 to-blue-50 rounded-2xl border border-gray-200">
              <div className="text-5xl mb-4">📍</div>
              <h3 className="text-2xl font-bold text-black mb-2">Location</h3>
              <p className="text-gray-700 mb-2 font-medium">Biratnagar, Nepal</p>
              <p className="text-gray-600">
                A student-led community building the future of technology in Eastern Nepal.
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center p-12 bg-black rounded-3xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start?
            </h2>
            <p className="text-gray-300 mb-8 text-lg">
              Join us today and start building amazing projects.
            </p>
            <a
              href="https://wa.me/9779709154661"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full font-semibold text-lg hover:bg-gray-100 transition-all transform hover:scale-105"
            >
              Join Everest Hack Club
              <span>→</span>
            </a>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-12">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
            >
              <span>←</span>
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
