'use client';
import { useState } from 'react';
import { ActionForm, Checkbox, Field, Submit } from './form';
import {
  reviewProject,
  saveArticle,
  saveEventContent,
  saveSettings,
  updateProposal,
} from '@/app/actions/organizer';
import type { ArticleRecord, Community, EventRecord, Proposal } from '@/lib/types';
import { indiaDate } from '@/lib/events';
const localTime = (v: string | null | undefined) =>
  v ? new Date(new Date(v).getTime() + 330 * 60000).toISOString().slice(0, 16) : '';
export function EventForm({ event }: { event?: EventRecord }) {
  return (
    <ActionForm
      action={saveEventContent}
      once={!event}
      successLink={!event ? { href: '/admin?tab=events', label: 'Return to events' } : undefined}
    >
      <input type="hidden" name="original_slug" value={event?.slug || ''} />
      <input type="hidden" name="version" value={event?.updated_at || ''} />
      <Field name="title" label="Event title" value={event?.title} required minLength={3} maxLength={160} />
      <Field
        name="slug"
        label="Page address"
        value={event?.slug}
        required
        readOnly={!!event}
        help="Lowercase words separated by hyphens. This address stays fixed after creation."
        maxLength={100}
      />
      <Field
        name="description"
        label="About the gathering"
        value={event?.description}
        required
        multiline
        maxLength={6000}
        minLength={10}
        rows={7}
      />
      <div className="form-grid">
        <Field name="date" label="Event date" type="date" value={event?.date || indiaDate()} required />
        <Field
          name="type"
          label="Format"
          value={event?.type || 'workshop'}
          required
          options={[
            { value: 'hackathon', label: 'Hack day' },
            { value: 'workshop', label: 'Workshop' },
            { value: 'meetup', label: 'Meetup' },
            { value: 'technical-session', label: 'Technical session' },
          ]}
        />
        <Field
          name="starts_at"
          label="Starts at (IST)"
          type="datetime-local"
          value={localTime(event?.starts_at)}
        />
        <Field name="ends_at" label="Ends at (IST)" type="datetime-local" value={localTime(event?.ends_at)} />
        <Field name="venue" label="Venue" value={event?.venue} required maxLength={160} />
        <Field name="city" label="City" value={event?.city || 'Bengaluru'} required maxLength={100} />
        <Field
          name="relationship"
          label="KrowdKraft’s involvement"
          value={event?.relationship || 'hosted'}
          required
          help="For example: hosted, community partner, or supported."
          maxLength={100}
        />
        <Field
          name="lifecycle"
          label="Event state"
          value={event?.lifecycle || 'scheduled'}
          required
          options={[
            { value: 'scheduled', label: 'Scheduled' },
            { value: 'completed', label: 'Completed' },
            { value: 'cancelled', label: 'Cancelled' },
          ]}
        />
      </div>
      <Field
        name="source_url"
        label="Official information URL"
        type="url"
        value={event?.source_url}
        required
      />
      <div className="form-grid">
        <Field name="registration_url" label="Registration URL" type="url" value={event?.registration_url} />
        <Field
          name="participant_url"
          label="Participant group URL"
          type="url"
          value={event?.participant_url}
          help="Only add a link intended to be public. This is separate from the community channel."
        />
        <Field
          name="registration_status"
          label="Registration status"
          value={event?.registration_status || 'unknown'}
          required
          options={[
            { value: 'unknown', label: 'Check official details' },
            { value: 'open', label: 'Open' },
            { value: 'closed', label: 'Closed' },
            { value: 'waitlist', label: 'Waitlist' },
            { value: 'not-applicable', label: 'No registration' },
          ]}
        />
        <Field
          name="registration_deadline"
          label="Registration deadline (IST)"
          type="date"
          value={event?.registration_deadline}
        />
      </div>
      <Field
        name="image"
        label="Event poster"
        value={event?.image}
        options={[
          { value: '', label: 'Use a typographic cover' },
          ...(event?.image && !event.image.startsWith('/')
            ? [{ value: event.image, label: 'Current uploaded poster' }]
            : []),
          { value: '/events/hacktoberfest-2026.webp', label: 'Hacktoberfest 2026' },
          { value: '/events/x402-prehack-2026.webp', label: 'x402 PreHack 2026' },
          { value: '/events/ai-verse-2025.webp', label: 'Into the AIverse 2025' },
          { value: '/events/namaste-arbitrum-2025.webp', label: 'Namaste Arbitrum 2025' },
        ]}
        help="Use a poster only for its own event, or upload a new image below."
      />
      <div className="form-field">
        <label htmlFor="event-poster">Upload a new poster (optional)</label>
        <input
          type="file"
          name="poster"
          id="event-poster"
          accept="image/png,image/jpeg,image/webp"
          aria-describedby="poster-help"
        />
        <small id="poster-help">
          PNG, JPEG or WebP, up to 2 MB. An upload replaces the selected poster. Draft posters stay private.
        </small>
      </div>
      <Field
        name="partners"
        label="Event partners"
        value={event?.partners.join(', ')}
        maxLength={500}
        help="Separate partner names with commas."
      />
      <div className="checkbox-stack">
        <Checkbox name="featured" label="Feature this gathering" checked={event?.featured} />
        <Checkbox name="verified" label="I checked the official source and these details are current" />
        <Checkbox name="published" label="Publish this event on the website" checked={event?.published} />
      </div>
      <Submit>Save event</Submit>
    </ActionForm>
  );
}
export function ArticleForm({ article }: { article?: ArticleRecord }) {
  return (
    <ActionForm
      action={saveArticle}
      once={!article}
      successLink={!article ? { href: '/admin?tab=articles', label: 'Return to articles' } : undefined}
    >
      <input type="hidden" name="original_slug" value={article?.slug || ''} />
      <input type="hidden" name="version" value={article?.updated_at || ''} />
      <Field name="title" label="Article title" value={article?.title} required maxLength={160} />
      <Field
        name="slug"
        label="Article address"
        value={article?.slug}
        required
        readOnly={!!article}
        maxLength={100}
        help="Lowercase words separated by hyphens."
      />
      <Field name="subtitle" label="Subtitle" value={article?.subtitle} maxLength={200} />
      <Field
        name="description"
        label="Short introduction"
        value={article?.description}
        multiline
        required
        minLength={10}
        maxLength={1000}
      />
      <div className="form-grid">
        <Field
          name="date"
          label="Original publication date"
          value={article?.date || indiaDate()}
          type="date"
          required
        />
        <Field name="topic" label="Topic" value={article?.topic} required maxLength={80} />
      </div>
      <Field name="author" label="Author" value={article?.author} required maxLength={100} />
      <Field name="href" label="Original article URL" type="url" value={article?.href} required />
      <div className="checkbox-stack">
        <Checkbox name="published" label="Publish in the journal" checked={article?.published} />
      </div>
      <Submit>Save article</Submit>
    </ActionForm>
  );
}
export function ReviewForm({ id, published = false }: { id: string; published?: boolean }) {
  return (
    <ActionForm action={reviewProject} once>
      <input type="hidden" name="id" value={id} />
      <Field
        name="note"
        label="Feedback for the maker"
        multiline
        maxLength={2000}
        rows={3}
        help="Visible to this project’s maker and organizers only."
        required={published}
        minLength={published ? 10 : undefined}
      />
      <Field
        name="decision"
        label="Review decision"
        value="rejected"
        required
        options={[
          { value: 'rejected', label: 'Return to the maker' },
          ...(!published ? [{ value: 'approved', label: 'Approve and publish' }] : []),
        ]}
      />
      <Submit pendingText="Saving review…">
        {published ? 'Unpublish and return to maker' : 'Save review'}
      </Submit>
    </ActionForm>
  );
}
export function ProposalStatusForm({ proposal }: { proposal: Proposal }) {
  return (
    <ActionForm action={updateProposal}>
      <input type="hidden" name="id" value={proposal.id} />
      <Field
        name="status"
        label="Proposal status"
        value={proposal.status}
        required
        options={[
          { value: 'new', label: 'New' },
          { value: 'reviewing', label: 'Reviewing' },
          { value: 'closed', label: 'Closed' },
        ]}
      />
      <Submit quiet>Update status</Submit>
    </ActionForm>
  );
}
export function SettingsForm({ community }: { community: Community }) {
  const [organizers, setOrganizers] = useState(community.organizers);
  return (
    <ActionForm action={saveSettings}>
      <input type="hidden" name="version" value={community.updated_at} />
      <Field name="name" label="Community name" value={community.name} required maxLength={80} />
      <Field
        name="description"
        label="Community description"
        value={community.description}
        multiline
        required
        minLength={20}
        maxLength={500}
      />
      <div className="form-grid">
        <Field name="city" label="Home city" value={community.city} required maxLength={100} />
        <Field name="email" label="Public contact email" value={community.email} type="email" required />
      </div>
      <h3 className="form-subheading">Community links</h3>
      <div className="form-grid">
        {['github', 'luma', 'linkedin', 'instagram', 'x', 'medium', 'whatsapp'].map((k) => (
          <Field
            key={k}
            name={`link_${k}`}
            label={
              {
                github: 'GitHub',
                luma: 'Luma calendar',
                linkedin: 'LinkedIn',
                instagram: 'Instagram',
                x: 'X',
                medium: 'Medium',
                whatsapp: 'WhatsApp announcement channel',
              }[k] || k
            }
            value={community.links[k]}
            type="url"
            required
          />
        ))}
      </div>
      <h3 className="form-subheading">The people on the homepage</h3>
      <p className="form-help">
        These are public introductions. Editing this list does not grant organizer account access.
      </p>
      <input type="hidden" name="organizers" value={JSON.stringify(organizers)} />
      {organizers.map((person, i) => (
        <div className="organizer-editor" key={i}>
          {(['name', 'initial', 'role'] as const).map((key) => (
            <label className="form-field" key={key}>
              {key === 'name' ? 'Name' : key === 'initial' ? 'Initials' : 'Public role'}
              <input
                value={person[key]}
                maxLength={key === 'initial' ? 4 : key === 'name' ? 80 : 100}
                required
                onChange={(e) =>
                  setOrganizers((current) =>
                    current.map((p, j) => (j === i ? { ...p, [key]: e.target.value } : p)),
                  )
                }
              />
            </label>
          ))}
          {(['linkedin', 'x'] as const).map((key) => (
            <label className="form-field" key={key}>
              {key === 'linkedin' ? 'LinkedIn profile' : 'X profile'} (optional)
              <input
                type="url"
                value={person[key] || ''}
                maxLength={2048}
                onChange={(e) =>
                  setOrganizers((current) =>
                    current.map((p, j) => (j === i ? { ...p, [key]: e.target.value || undefined } : p)),
                  )
                }
              />
            </label>
          ))}
          {organizers.length > 1 && (
            <button
              className="text-button"
              type="button"
              onClick={() => setOrganizers((current) => current.filter((_, j) => j !== i))}
            >
              Remove introduction
            </button>
          )}
        </div>
      ))}
      <div className="button-row">
        {organizers.length < 12 && (
          <button
            type="button"
            className="button button-quiet"
            onClick={() =>
              setOrganizers([...organizers, { name: '', initial: '', role: 'Community organizer' }])
            }
          >
            Add introduction
          </button>
        )}
        <Submit>Save community settings</Submit>
      </div>
    </ActionForm>
  );
}
