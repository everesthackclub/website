import { SOCIALS, DISCORD_URL } from "../lib/site";
import { InstagramIcon, LinkedInIcon, GitHubIcon, DiscordIcon } from "./icons";

const ICONS = {
  Instagram: InstagramIcon,
  LinkedIn:  LinkedInIcon,
  GitHub:    GitHubIcon,
} as const;

export default function SocialLinks() {
  return (
    <div className="flex flex-wrap gap-2">
      {SOCIALS.map((social) => {
        const Icon = ICONS[social.name];
        return (
          <a
            key={social.name}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${social.name} — ${social.handle}`}
            title={social.handle}
            className="w-9 h-9 rounded-xl border border-[var(--border)] bg-[var(--surface-1)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-subtle)] hover:shadow-[var(--shadow-sm)] transition-all duration-150"
          >
            <Icon className="w-4 h-4" />
          </a>
        );
      })}
      <a
        href={DISCORD_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Discord — Join our server"
        title="Join our Discord"
        className="w-9 h-9 rounded-xl border border-[var(--border)] bg-[var(--surface-1)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-subtle)] hover:shadow-[var(--shadow-sm)] transition-all duration-150"
      >
        <DiscordIcon className="w-4 h-4" />
      </a>
    </div>
  );
}
