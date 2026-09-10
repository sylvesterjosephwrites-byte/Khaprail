import { FacebookIcon, InstagramIcon, XSocialIcon, YoutubeIcon } from "@/components/shared/social-brand-icons"
import type { ComponentType, SVGProps } from "react"

export interface SocialLink {
  label: string
  url: string
  Icon: ComponentType<SVGProps<SVGSVGElement>>
}

// Real, confirmed social profile URLs — single source of truth for the
// footer's social row. Never invent a profile that isn't confirmed.
export const SOCIAL_LINKS: SocialLink[] = [
  { label: "Facebook", url: "https://www.facebook.com/paktiles.net", Icon: FacebookIcon },
  { label: "X (Twitter)", url: "https://x.com/pakclaytiles", Icon: XSocialIcon },
  { label: "YouTube", url: "https://www.youtube.com/@paktiles786", Icon: YoutubeIcon },
  { label: "Instagram", url: "https://www.instagram.com/paktiles/", Icon: InstagramIcon },
]
