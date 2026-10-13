import { isPublicHttpsUrl } from "@/lib/public-url";
import { Icon } from "./icon";
export function SocialLinks({ urls }: { urls: string[] }) {
  const valid = [...new Set(urls)].filter(isPublicHttpsUrl).slice(0, 3);
  if (!valid.length) return null;
  return (
    <nav className="builder-socials" aria-label="Connect with this builder">
      {valid.map((url) => {
        const host = new URL(url).hostname.replace(/^www\./, "");
        const label =
          (
            {
              "github.com": "GitHub",
              "linkedin.com": "LinkedIn",
              "x.com": "X",
              "twitter.com": "X",
              "instagram.com": "Instagram",
            } as Record<string, string>
          )[host] || host;
        return (
          <a key={url} href={url} target="_blank" rel="noreferrer">
            {label}
            <Icon name="diagonal" size={14} />
          </a>
        );
      })}
    </nav>
  );
}
