import Image from "next/image";
import Link from "next/link";
import Navbar from "../components/Navbar";
import SocialLinks from "../components/SocialLinks";
import {
  MailIcon,
  WhatsAppIcon,
  DiscordIcon,
  LocationIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
} from "../components/icons";
import {
  JOIN_URL,
  WHATSAPP_URL,
  DISCORD_URL,
  CONTACT_EMAIL,
} from "../lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Everest Hack Club",
  description:
    "Get in touch with Everest Hack Club in Biratnagar, Nepal. Join our student coding community and start building projects.",
};

const CHANNELS = [
  {
    icon: WhatsAppIcon,
    name: "WhatsApp",
    body: "Send us a message and we will add you to the community group.",
    action: "Chat with us",
    href: WHATSAPP_URL,
  },
  {
    icon: DiscordIcon,
    name: "Discord",
    body: "Join our server to connect with members and stay up to date.",
    action: "Join the server",
    href: DISCORD_URL,
  },
];

export default function Contact() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <Navbar />

      {/* Background grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 bg-[linear-gradient(to_right,#f1f1f1_1px,transparent_1px),linear-gradient(to_bottom,#f1f1f1_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_85%)]"
      />

      <section className="px-6 pt-32 pb-24 md:pt-40">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-16">
            <Image
              src="/Image/logo2.svg"
              alt="Everest Hack Club"
              width={56}
              height={56}
              className="mb-8"
            />
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-600 dark:text-red-500 mb-4">
              Contact
            </p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
              Let us build together
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed mb-8">
              Ready to join Everest Hack Club? Get in touch and we will guide you
              through the next steps.
            </p>

            <a
              href={JOIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-500 text-white rounded-lg font-semibold text-base transition-colors"
            >
              Join the Club
              <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <p className="mt-4 text-sm text-gray-500 dark:text-neutral-500">
              Free to join · Open to every student · No experience needed
            </p>
          </div>

          {/* Channels */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {CHANNELS.map(({ icon: Icon, name, body, action, href }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-8 bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 hover:border-gray-300 dark:hover:border-neutral-700 transition-colors"
              >
                <div className="w-11 h-11 mb-6 rounded-lg border border-gray-200 dark:border-neutral-800 flex items-center justify-center text-gray-700 dark:text-gray-300">
                  <Icon className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-5">
                  {body}
                </p>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-red-600 dark:text-red-500">
                  {action}
                  <ArrowRightIcon className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </a>
            ))}
          </div>

          {/* Email and socials */}
          <div className="p-8 bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 mb-6">
            <div className="flex items-start gap-4 mb-8">
              <div className="w-11 h-11 shrink-0 rounded-lg border border-gray-200 dark:border-neutral-800 flex items-center justify-center text-gray-700 dark:text-gray-300">
                <MailIcon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  Email
                </h2>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  {CONTACT_EMAIL}
                </a>
              </div>
            </div>
            <div className="pt-6 border-t border-gray-200 dark:border-neutral-800">
              <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-neutral-500 mb-4">
                Follow us
              </h2>
              <SocialLinks />
            </div>
          </div>

          {/* Location */}
          <div className="p-8 bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 mb-16">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 shrink-0 rounded-lg border border-gray-200 dark:border-neutral-800 flex items-center justify-center text-gray-700 dark:text-gray-300">
                <LocationIcon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  Location
                </h2>
                <p className="text-gray-900 dark:text-gray-200 font-medium mb-1">
                  Biratnagar, Nepal
                </p>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  A student-led community building the future of technology in
                  Eastern Nepal.
                </p>
              </div>
            </div>
          </div>

          {/* Closing CTA */}
          <div className="p-10 md:p-12 rounded-2xl bg-gray-900 dark:bg-neutral-900 dark:border dark:border-neutral-800 text-center">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-4">
              Ready to start?
            </h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">
              Join us today and start building with other students in Biratnagar.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={JOIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-lg font-semibold text-sm transition-colors"
              >
                Join the Club
                <ArrowRightIcon className="w-4 h-4" />
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/15 text-white border border-white/15 rounded-lg font-semibold text-sm transition-colors"
              >
                <WhatsAppIcon className="w-4 h-4" />
                WhatsApp
              </a>
              <a
                href={DISCORD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/15 text-white border border-white/15 rounded-lg font-semibold text-sm transition-colors"
              >
                <DiscordIcon className="w-4 h-4" />
                Discord
              </a>
            </div>
          </div>

          {/* Back */}
          <div className="mt-12">
            <Link
              href="/"
              className="group inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
              Back to home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
