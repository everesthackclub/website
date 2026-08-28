import Image from "next/image";
import Link from "next/link";
import Navbar from "./components/Navbar";
import Founders from "./components/Founders";
import SocialLinks from "./components/SocialLinks";
import {
  MailIcon,
  WhatsAppIcon,
  DiscordIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  CodeIcon,
  SlidersIcon,
  UsersIcon,
} from "./components/icons";
import {
  JOIN_URL,
  WHATSAPP_URL,
  DISCORD_URL,
  CONTACT_EMAIL,
} from "./lib/site";

const PILLARS = [
  {
    icon: CodeIcon,
    title: "Build",
    body: "Create real projects that matter, from web apps to hardware experiments.",
  },
  {
    icon: SlidersIcon,
    title: "Break",
    body: "Experiment without fear. Learn by taking things apart and rebuilding them.",
  },
  {
    icon: UsersIcon,
    title: "Learn",
    body: "Grow alongside peers who share your curiosity about technology.",
  },
];

const FAQS = [
  {
    q: "Who can join Everest Hack Club?",
    a: "Any student interested in technology, coding, and building things. No prior experience is required.",
  },
  {
    q: "Do I need to know how to code?",
    a: "No. We welcome complete beginners. You will learn by building, with support from other members along the way.",
  },
  {
    q: "What kind of projects do members build?",
    a: "Websites, apps, games, hardware projects, and creative experiments. If you can scope it, we will help you build it.",
  },
  {
    q: "How do I get started?",
    a: "Use the Join the Club link to register, or message us on WhatsApp or Discord. We will guide you through the next steps.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <Navbar />

      {/* Background grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 bg-[linear-gradient(to_right,#f1f1f1_1px,transparent_1px),linear-gradient(to_bottom,#f1f1f1_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_85%)]"
      />

      {/* Hero */}
      <section className="px-6 pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-gray-600 dark:text-gray-400 text-xs font-medium mb-8">
                <span className="h-1.5 w-1.5 rounded-full bg-red-600 dark:bg-red-500" />
                Biratnagar, Nepal
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight text-gray-900 dark:text-white mb-6">
                Everest
                <br />
                <span className="text-red-600 dark:text-red-500">Hack Club</span>
              </h1>

              <p className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-5">
                Build. Break. Learn.
              </p>

              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-xl mb-10">
                A student-led community of makers building projects and learning
                together. Whether you are just starting out or already
                experienced, there is a place for you here.
              </p>

              <div className="flex flex-col gap-6">
                <div>
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

                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-sm text-gray-500 dark:text-neutral-500">
                    Or reach us on
                  </span>
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-neutral-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-neutral-800 rounded-lg font-medium text-sm hover:border-gray-300 dark:hover:border-neutral-700 transition-colors"
                  >
                    <WhatsAppIcon className="w-4 h-4" />
                    WhatsApp
                  </a>
                  <a
                    href={DISCORD_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-neutral-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-neutral-800 rounded-lg font-medium text-sm hover:border-gray-300 dark:hover:border-neutral-700 transition-colors"
                  >
                    <DiscordIcon className="w-4 h-4" />
                    Discord
                  </a>
                </div>
              </div>
            </div>

            {/* Hero visual */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto w-full max-w-sm aspect-square rounded-2xl border border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-900/60 flex items-center justify-center">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 rounded-2xl bg-[linear-gradient(to_right,#e9e9e9_1px,transparent_1px),linear-gradient(to_bottom,#e9e9e9_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#212121_1px,transparent_1px),linear-gradient(to_bottom,#212121_1px,transparent_1px)] [background-size:32px_32px]"
                />
                <Image
                  src="/Image/flag-orpheus-top.svg"
                  alt="Hack Club flag"
                  width={320}
                  height={320}
                  priority
                  className="relative z-10 w-2/3 h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partnership */}
      <section className="px-6 py-16 border-y border-gray-200 dark:border-neutral-800 bg-gray-50/70 dark:bg-neutral-900/40">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-neutral-500">
            Officially partnered with
          </p>
          <div className="flex items-center gap-8 md:gap-12">
            <div className="flex items-center gap-3">
              <Image
                src="/Image/logo2.svg"
                alt="Everest Hack Club"
                width={40}
                height={40}
              />
              <span className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100">
                Everest Hack Club
              </span>
            </div>

            <span className="text-xl text-gray-300 dark:text-neutral-700 font-light">
              ×
            </span>

            <div className="flex items-center gap-3">
              <Image
                src="/Image/flag-standalone.svg"
                alt="Hack Club"
                width={40}
                height={40}
              />
              <span className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100">
                Hack Club
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-md leading-relaxed">
            An official chapter of Hack Club, the global network of student
            makers and coding communities.
          </p>
        </div>
      </section>

      {/* Pillars */}
      <section className="px-6 py-20 md:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-6 md:grid-cols-3">
            {PILLARS.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="p-8 bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 hover:border-gray-300 dark:hover:border-neutral-700 transition-colors"
              >
                <div className="w-11 h-11 mb-6 rounded-lg border border-gray-200 dark:border-neutral-800 flex items-center justify-center text-red-600 dark:text-red-500">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section
        id="about"
        className="px-6 py-20 md:py-28 border-t border-gray-200 dark:border-neutral-800"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-600 dark:text-red-500 mb-4">
                About us
              </p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
                What we do
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                <p>
                  Everest Hack Club is a student-led community where young
                  creators come together to build, experiment, and learn.
                </p>
                <p>
                  Whether you are coding your first website or working on
                  something more ambitious, we provide the space, resources, and
                  community to help you grow.
                </p>
                <p>
                  No experience required. Bring your curiosity and something you
                  want to make.
                </p>
              </div>
            </div>

            <div className="aspect-[4/3] rounded-2xl border border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-900/60 flex items-center justify-center">
              <Image
                src="/Image/flag-standalone.svg"
                alt="Hack Club"
                width={160}
                height={160}
                className="w-2/5 h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section
        id="faq"
        className="px-6 py-20 md:py-28 border-t border-gray-200 dark:border-neutral-800"
      >
        <div className="max-w-3xl mx-auto">
          <div className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-600 dark:text-red-500 mb-4">
              FAQ
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
              Frequently asked questions
            </h2>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-neutral-800 border-y border-gray-200 dark:border-neutral-800">
            {FAQS.map(({ q, a }) => (
              <details key={q} className="group py-5">
                <summary className="cursor-pointer list-none flex justify-between items-center gap-4 text-base font-semibold text-gray-900 dark:text-white">
                  {q}
                  <ChevronDownIcon className="w-4 h-4 shrink-0 text-gray-400 dark:text-neutral-500 transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-3 pr-8 text-gray-600 dark:text-gray-400 leading-relaxed">
                  {a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <Founders />

      {/* Footer */}
      <footer className="px-6 pt-16 pb-10 border-t border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-12 md:grid-cols-3 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Image
                  src="/Image/logo2.svg"
                  alt="Everest Hack Club"
                  width={32}
                  height={32}
                />
                <span className="font-semibold text-base text-gray-900 dark:text-white">
                  Everest Hack Club
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-xs">
                A student-led community of makers in Biratnagar, Nepal.
              </p>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-neutral-500 mb-4">
                Contact
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    <MailIcon className="w-4 h-4" />
                    {CONTACT_EMAIL}
                  </a>
                </li>
                <li className="text-sm text-gray-600 dark:text-gray-400">
                  Biratnagar, Nepal
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-red-600 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors"
                  >
                    Get in touch
                    <ArrowRightIcon className="w-3.5 h-3.5" />
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-neutral-500 mb-4">
                Follow
              </h3>
              <SocialLinks />
            </div>
          </div>

          <div className="pt-8 border-t border-gray-200 dark:border-neutral-800 flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-sm text-gray-500 dark:text-neutral-500">
              © 2026 Everest Hack Club
            </p>
            <p className="text-sm text-gray-500 dark:text-neutral-500">
              Build. Break. Learn.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
