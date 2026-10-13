import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { communityEmail } from "@/data/community";
export const metadata: Metadata = { title: "Privacy & your data | KrowdKraft" };
export default function PrivacyPage() {
  return (
    <PageShell>
      <div className="container">
        <div className="page-intro">
          <p className="eyebrow">
            Your data, in plain language · Updated 13 October 2026
          </p>
          <h1>
            A little clarity.
            <br />
            <span className="serif-word">A lot of respect.</span>
          </h1>
        </div>
        <article className="privacy-content">
          <h2>When you submit a project or story</h2>
          <p>
            We collect the title, builder or team name, public link,
            description, category and contact email you provide. Organizers use
            these to review the submission and follow up with you. Your contact
            email is private. If approved, the project or story details appear
            publicly. We do not ask for a phone number. You should have
            permission to share the work and any information about other people.
          </p>
          <h2>When you connect GitHub</h2>
          <p>
            GitHub and Supabase handle sign-in. We store your GitHub identifier,
            handle, display name and avatar link. The account starts private. If
            you opt in, those profile details and your synced public activity
            appear on the community board. We do not request repository access
            or permission to modify your GitHub content.
          </p>
          <h2>Activity and contributors</h2>
          <p>
            The activity board counts selected events from GitHub’s public feed
            for the current UTC month. It is limited to recent events and is not
            a complete contribution history or a measure of skill. The website
            contributor list is separate public repository data from GitHub.
            Visit the leaderboard for the exact counting method and limits.
          </p>
          <h2>Cookies and local preferences</h2>
          <p>
            Essential cookies keep a signed-in session working. Your browser
            also stores preferences for animations and whether Krafty is
            visible. Duck sounds start off and require a click to enable. With
            your permission, Google Analytics measures visits to public pages.
            Its measurement ID is G-QM44WYFLFR. Query strings, account pages and
            authentication callbacks are excluded from our page-view events.
            Analytics pauses before form interaction; we do not send form
            contents or emails as analytics events. Advertising personalization
            is disabled. You can decline or change your choice using Analytics
            preferences in the footer when Analytics is enabled. “Analytics off”
            means collection is disabled for this website. We do not record your
            microphone or track your pointer with the mascot.
          </p>
          <h2>Where information goes</h2>
          <p>
            The site is hosted on Vercel. Member profiles and submissions use
            Supabase when connected. GitHub supplies identity and public
            activity. Collaboration forms send your note through the configured
            email provider to the organizing team. Links to WhatsApp, Medium,
            Luma, MLH and social networks open services with their own privacy
            practices.
          </p>
          <h2>Control and removal</h2>
          <p>
            You can make your connected profile private immediately or remove
            your KrowdKraft account from the account page. Account removal
            deletes the connected member profile and activity snapshots; it does
            not delete your GitHub account or your separate product, nomination
            or email submissions. For those, email{" "}
            <a href={`mailto:${communityEmail}`}>{communityEmail}</a> from the
            address used to submit. You can also request correction or
            withdrawal of a published listing. To revoke the GitHub
            authorization itself, use GitHub’s Settings → Applications.
          </p>
          <h2>Retention</h2>
          <p>
            Submissions remain with the organizing team while they are being
            reviewed or while the resulting listing is maintained. Review audit
            records help us track publication decisions. Rate-limit records use
            hashed identifiers and expire after their short abuse-prevention
            window. Contact the team to request deletion of submission data; we
            do not sell contact information or enroll submitters in a mailing
            list.
          </p>
          <h2>A question about your data?</h2>
          <p>
            Write to <a href={`mailto:${communityEmail}`}>{communityEmail}</a>.
            We’ll help you understand what we hold and what you can change.
          </p>
        </article>
      </div>
    </PageShell>
  );
}
