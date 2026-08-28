import { SOCIALS, DISCORD_URL } from "../lib/site";
import { InstagramIcon, LinkedInIcon, GitHubIcon, DiscordIcon } from "./icons";

const ICONS = {
  Instagram: InstagramIcon,
  LinkedIn: LinkedInIcon,
  GitHub: GitHubIcon,
} as const;

const tileClass =
  "w-10 h-10 rounded-lg border border-gray-200 dark:border-neutral-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-neutral-700 transition-colors";

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
            aria-label={social.name}
            title={social.handle}
            className={tileClass}
          >
            <Icon className="w-4 h-4" />
          </a>
        );
      })}
      <a
        href={DISCORD_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Discord"
        title="Join our Discord"
        className={tileClass}
      >
        <DiscordIcon className="w-4 h-4" />
      </a>
    </div>
  );
}
