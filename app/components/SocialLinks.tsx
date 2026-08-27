import { SOCIALS, DISCORD_URL } from "../lib/site";
import { InstagramIcon, LinkedInIcon, GitHubIcon, DiscordIcon } from "./icons";

const ICONS = {
  Instagram: InstagramIcon,
  LinkedIn: LinkedInIcon,
  GitHub: GitHubIcon,
} as const;

const tileClass =
  "w-11 h-11 rounded-xl border border-gray-200 dark:border-neutral-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-white dark:hover:text-black hover:bg-black dark:hover:bg-white hover:border-transparent dark:hover:border-transparent transition-all";

export default function SocialLinks() {
  return (
    <div className="flex flex-wrap gap-3">
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
            <Icon className="w-5 h-5" />
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
        <DiscordIcon className="w-5 h-5" />
      </a>
    </div>
  );
}
