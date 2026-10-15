'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Icon } from './icon';
import { ChapterScene } from './figures/chapter-scene';
import { ShareProjectLink } from './share-project-link';
const chapters = [
  {
    title: 'Learn',
    icon: 'book' as const,
    caption: 'Work through it, together.',
    text: 'Hands-on workshops, shared discoveries, and people who will work through the tricky parts with you.',
    link: '/events?type=workshop',
    action: 'Find a workshop',
  },
  {
    title: 'Build',
    icon: 'code' as const,
    caption: 'Give that idea a working demo.',
    text: 'Find a teammate at a hack day, open your editor, and build something you have been wanting to try.',
    link: '/events?type=hackathon',
    action: 'Explore hack days',
  },
  {
    title: 'Share',
    icon: 'mic' as const,
    caption: 'Show us what you made.',
    text: 'Share your project, write down what you learned, and help someone else take their first step.',
    link: '/share',
    action: 'Share your project',
  },
];
export function CommunityTabs() {
  const [selected, setSelected] = useState(0);
  return (
    <div className="community-layout">
      <ChapterScene chapter={selected} />
      <div className="community-panel">
        <div className="chapter-tabs" role="tablist" aria-label="Ways to participate">
          {chapters.map((c, i) => (
            <button
              key={c.title}
              id={'tab-' + i}
              role="tab"
              aria-selected={selected === i}
              aria-controls={'chapter-' + i}
              tabIndex={selected === i ? 0 : -1}
              onClick={() => setSelected(i)}
              onKeyDown={(e) => {
                if (['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(e.key)) {
                  e.preventDefault();
                  const next =
                    e.key === 'Home'
                      ? 0
                      : e.key === 'End'
                        ? 2
                        : (selected + (e.key === 'ArrowRight' ? 1 : 2)) % 3;
                  setSelected(next);
                  document.getElementById('tab-' + next)?.focus();
                }
              }}
            >
              <Icon name={c.icon} size={20} />
              <span>{c.title}</span>
            </button>
          ))}
        </div>
        {chapters.map((c, i) => (
          <div
            key={c.title}
            className="chapter-content"
            id={'chapter-' + i}
            role="tabpanel"
            aria-labelledby={'tab-' + i}
            hidden={selected !== i}
            tabIndex={0}
          >
            <h3>{c.caption}</h3>
            <p>{c.text}</p>
            {c.link === '/share' ? (
              <ShareProjectLink className="button">
                {c.action}
                <Icon name="diagonal" size={18} />
              </ShareProjectLink>
            ) : (
              <Link className="button" href={c.link}>
                {c.action}
                <Icon name="diagonal" size={18} />
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
