import type { Community } from '@/lib/types';
export function PartnerTapes({ partners }: { partners: Community['partners'] }) {
  return (
    <section className="partner-section" aria-label="Community collaborators">
      {(['organizations', 'institutions'] as const).map((group) => (
        <div key={group}>
          <div className="partner-heading">
            <p>
              {group === 'organizations'
                ? 'Companies, communities & collaborators'
                : 'Colleges & universities'}
            </p>
          </div>
          <div className={'logo-tape ' + group}>
            <div className="logo-track">
              {[false, true].map((duplicate) => (
                <div
                  className="logo-group"
                  key={String(duplicate)}
                  aria-hidden={duplicate ? true : undefined}
                >
                  {partners
                    .filter((p) => p.group === group)
                    .map((p) => {
                      const img = (
                        <img
                          src={p.image}
                          alt={duplicate ? '' : p.alt}
                          width={p.width}
                          height={p.height}
                          loading="lazy"
                        />
                      );
                      const cls = 'logo-plaque' + (p.light ? ' light' : '');
                      return p.href ? (
                        <a
                          key={p.id}
                          className={cls}
                          href={p.href}
                          title={p.name}
                          tabIndex={duplicate ? -1 : undefined}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {img}
                        </a>
                      ) : (
                        <span key={p.id} className={cls} title={p.name}>
                          {img}
                        </span>
                      );
                    })}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
