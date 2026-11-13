import type { ComponentProps } from 'react';
import { Icon } from '@/components/icon';
import { JoinKrafterButton } from '@/components/join-community';
import { PassArt } from '@/components/pass-art';
import { PassStage } from '@/components/pass-stage';
import { SectionHeading } from '@/components/shell';

type IconName = NonNullable<ComponentProps<typeof Icon>['name']>;

const circles: {
  name: string;
  kicker: string;
  serial: string;
  tag: string;
  footer: string;
  promise: string;
  who: string;
  perks: [IconName, string][];
  tone: 'general' | 'amigos' | 'core';
}[] = [
  {
    name: 'General member',
    kicker: 'Open circle',
    serial: 'KK-01',
    tag: 'Flexible',
    footer: 'KrowdKraft // Open',
    promise: 'Show up when you can',
    who: 'For people who want to stay close without a standing commitment. Join a workshop, hackathon, or meetup when the week allows it.',
    perks: [
      ['people', 'Meet people from different professions and interests'],
      ['calendar', 'Hear about events and hackathons in Bengaluru and across India'],
      ['code', 'Find teammates when you decide to build something'],
    ],
    tone: 'general',
  },
  {
    name: 'Amigos - KrowdKraft Innercircle',
    kicker: 'Inner circle',
    serial: 'KK-IC',
    tag: 'Selective',
    footer: 'Innercircle // Amigos',
    promise: 'Practice in public',
    who: 'For developers, content creators, and entrepreneurs who want mentoring and a group that learns together. It asks for real presence. No excuses.',
    perks: [
      ['mic', 'Speak at events and showcase what you have built'],
      ['power', 'Find partners to build a product and launch it'],
      ['chart', 'Internships, job referrals, freelance work, and ambassadorships'],
      ['bookmark', 'Exclusive merch, and support when you are stuck'],
    ],
    tone: 'amigos',
  },
  {
    name: 'Core team',
    kicker: 'Organizing circle',
    serial: 'KK-CT',
    tag: 'Stewards',
    footer: 'Core // Organizers',
    promise: 'Build the community',
    who: 'For members who host, organize, and start what KrowdKraft does next. You help run the community, not only attend it.',
    perks: [
      ['calendar', 'Shape events, programs, and new initiatives'],
      ['people', 'Work with the people who keep KrowdKraft moving'],
      ['chart', 'Priority referrals for internships and freelance work'],
    ],
    tone: 'core',
  },
];

export function MembershipCircles() {
  return (
    <section id="circles" className="section wrap circles-section">
      <SectionHeading label="" title="Three ways to be here." />
      <p className="about-intro">
        Same community, different kinds of commitment. Pick the one that matches how you want to show up.
      </p>
      <PassStage>
        {circles.map((circle) => (
          <article className={`pass pass-${circle.tone}`} key={circle.tone}>
            {circle.tone === 'amigos' && <span className="pass-ribbon">Active cohort</span>}
            <div className="pass-face">
              <div className="pass-top">
                <span>
                  <i aria-hidden="true" /> Pass · {circle.serial}
                </span>
                <span className="pass-tag">{circle.tag}</span>
              </div>
              <PassArt scene={circle.tone} />
              <p className="pass-kicker">{circle.kicker}</p>
              <h3>{circle.name}</h3>
              <p className="pass-promise">{circle.promise}</p>
              <p className="pass-who">{circle.who}</p>
              <ul>
                {circle.perks.map(([icon, perk]) => (
                  <li key={perk}>
                    <Icon name={icon} size={15} />
                    {perk}
                  </li>
                ))}
              </ul>
              <div className="pass-foot" aria-hidden="true">
                <span>{circle.footer}</span>
                <span className="pass-bars">
                  {Array.from({ length: 5 }, (_, index) => (
                    <i key={index} />
                  ))}
                </span>
              </div>
            </div>
          </article>
        ))}
      </PassStage>
      <div className="circle-join">
        <JoinKrafterButton />
      </div>
    </section>
  );
}
