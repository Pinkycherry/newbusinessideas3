import { SiDiscord, SiFacebook, SiPinterest, SiX } from "react-icons/si";

import {
  DISCORD_PROFILE_URL,
  FACEBOOK_PROFILE_URL,
  PINTEREST_PROFILE_URL,
  X_PROFILE_URL,
} from "@/lib/site-config";

const PROFILES = [
  { label: "X", handle: "@bbusinessidea", href: X_PROFILE_URL, Icon: SiX },
  {
    label: "Pinterest",
    handle: "bbusinessideaonline",
    href: PINTEREST_PROFILE_URL,
    Icon: SiPinterest,
  },
  { label: "Facebook", handle: "BBI on Facebook", href: FACEBOOK_PROFILE_URL, Icon: SiFacebook },
  { label: "Discord", handle: "BBI on Discord", href: DISCORD_PROFILE_URL, Icon: SiDiscord },
];

/** BBI's official profiles, for pages that say who is behind the site. */
export function SocialLinks() {
  return (
    <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-3 text-[1.05rem]">
      {PROFILES.map(({ label, handle, href, Icon }) => (
        <li key={label}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer me"
            aria-label={`BBI on ${label}`}
            className="mo-link inline-flex items-center gap-2 font-semibold text-accent"
          >
            <Icon aria-hidden className="h-4 w-4" />
            <span>
              {label} <span className="font-normal text-muted-foreground">· {handle}</span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
