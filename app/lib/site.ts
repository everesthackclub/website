export const JOIN_URL = "https://clubs.hackclub.com/auth/member?join=9JN9CG";

export const CONTACT_EMAIL = "everesthackclub@gmail.com";

export const WHATSAPP_URL = "https://wa.me/9779709154661";
export const DISCORD_URL = "https://discord.gg/PxQzVuu4M";

export const SOCIALS = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/everesthackclub/",
    handle: "@everesthackclub",
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/143167008/",
    handle: "Everest Hack Club",
  },
  {
    name: "GitHub",
    href: "https://github.com/everesthackclub",
    handle: "everesthackclub",
  },
] as const;

export const FOUNDERS = [
  { name: "Bivaas Baral", initials: "BB" },
  { name: "Rusil Koirala", initials: "RK" },
  { name: "Samyak Raj Subedi", initials: "SS" },
  { name: "Saksham Pokharel", initials: "SP" },
] as const;

export const FAQS = [
  {
    q: "Who can join Everest Hack Club?",
    a: "Any student in Biratnagar who wants to build things with code. You don't need experience, a fancy laptop, or a CS background — just curiosity and the willingness to break things and figure out why.",
  },
  {
    q: "Does it cost anything?",
    a: "No. Everest Hack Club is free. We're an official chapter of Hack Club HQ, and membership, workshops, and events cost members nothing.",
  },
  {
    q: "What do members actually do?",
    a: "We build real projects — websites, games, robots, and custom tools — and ship them. Along the way you pick up git, the command line, design, and the habit of shipping instead of just planning.",
  },
  {
    q: "I've never written code before. Is that a problem?",
    a: "Not at all. Plenty of members start from zero. You'll learn by building something small alongside people who are a few steps ahead, which is faster than any tutorial.",
  },
  {
    q: "How do I join?",
    a: "Sign up through the join link on this page, then say hello in our WhatsApp or Discord community. That's it — you're in.",
  },
  {
    q: "How do I get in touch?",
    a: `Email us at ${CONTACT_EMAIL}, or message us on WhatsApp, Discord, or Instagram. We're a student club, so give us a day or two to reply.`,
  },
] as const;
