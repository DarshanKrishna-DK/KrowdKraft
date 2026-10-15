import type { Metadata } from 'next';
import { getCommunity } from '@/lib/data';
import { PageIntro } from '@/components/shell';
export const metadata: Metadata = {
  title: 'Privacy',
  description: 'How your KrowdKraft community information is used.',
};
export default async function Privacy() {
  const c = await getCommunity();
  return (
    <>
      <PageIntro
        eyebrow="Your community information"
        title="Privacy, explained."
        description="Here is what the KrowdKraft website stores, what becomes public, and how to reach us."
      />
      <article className="wrap page-body editorial">
        <p>Last updated: 15 October 2026.</p>
        <h2>Browsing and connecting GitHub</h2>
        <p>
          Browsing requires no membership account. Optional GitHub connection is handled through Supabase
          Auth. It provides an account identifier, GitHub profile information, and the email information
          needed by the authentication provider. We do not ask for access to your private repositories.
          Essential cookies keep you signed in. This application does not include advertising trackers or
          third-party analytics.
        </p>
        <h2>The monthly leaderboard</h2>
        <p>
          Connecting GitHub does not automatically list you. When you opt in, your public GitHub username,
          avatar, public commit count, public pull request count, and score become visible. One public commit
          or pull request is one point. Counts come from GitHub search and refresh approximately daily,
          subject to its availability and rate limits. We store monthly snapshots, not repository contents or
          your GitHub access token. Leaving the leaderboard hides your entry and stops future refreshes.
          Disconnecting this browser ends the session; it does not change your participation choice.
        </p>
        <h2>Projects and proposals</h2>
        <p>
          Approved projects are public, including the submitted name, links, screenshots, and description.
          Project submissions, collaboration proposals, and review notes are visible only to their owner and
          the organizers who need them. Do not include secrets, private repository credentials, or sensitive
          personal information in a project submission.
        </p>
        <h2>How information is stored</h2>
        <p>
          Supabase stores the connection identifier, submission attribution, community content, and uploaded
          images. The application uses access controls to separate public records, private submissions, and
          organizer functions. Content changes are recorded in an organizer audit log. Hosting and
          authentication services may retain operational logs for security and reliability.
        </p>
        <h2>External services</h2>
        <p>
          Registration, articles, GitHub projects, WhatsApp, and social links open independent services. Their
          privacy practices apply when you visit them. Adding an event to your calendar does not register you
          with an external event service.
        </p>
        <p>
          Blog covers load from Medium's image servers, and listed GitHub avatars load from GitHub. Those
          services receive the network information needed to deliver an image, including your IP address. Your
          animation preference is stored only in this browser.
        </p>
        <h2>Your choices</h2>
        <p>
          You can leave the leaderboard on the GitHub connection page and withdraw projects on the Share page.
          Previously issued image links may remain usable for a short time after withdrawal. To request
          deletion of stored connection data, a copy of your information, or help with a privacy concern,
          contact <a href={`mailto:${c.email}`}>{c.email}</a>. We may need to verify account ownership before
          acting on a request.
        </p>
        <h2>Community content</h2>
        <p>
          Submit only work and images you have the right to share. You remain responsible for your content.
          Organizers can decline or remove a submission that is misleading, harmful, unrelated to the
          community, or shared without permission.
        </p>
      </article>
    </>
  );
}
