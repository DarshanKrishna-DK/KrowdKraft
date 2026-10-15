import { Icon } from './icon';
export function SocialRail({ links }: { links: Record<string, string> }) {
  return (
    <aside className="social-rail" aria-label="Follow KrowdKraft">
      {(['linkedin', 'instagram', 'x', 'whatsapp'] as const).map((name) => (
        <a
          key={name}
          href={links[name]}
          target="_blank"
          rel="noreferrer"
          aria-label={
            { linkedin: 'LinkedIn', instagram: 'Instagram', x: 'X (Twitter)', whatsapp: 'WhatsApp channel' }[
              name
            ]
          }
        >
          <Icon name={name} size={21} />
          <span>
            {{ linkedin: 'LinkedIn', instagram: 'Instagram', x: 'Twitter', whatsapp: 'WhatsApp' }[name]}
          </span>
        </a>
      ))}
    </aside>
  );
}
