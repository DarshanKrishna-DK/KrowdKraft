'use client';
import { useState } from 'react';
import { ActionForm, Field, Checkbox, Submit } from './form';
import { saveProject, submitProposal, withdrawProject } from '@/app/actions/member';
import { Icon } from '../icon';
import type { Project } from '@/lib/types';
export function ProjectForm({ project, modal = false }: { project?: Project; modal?: boolean }) {
  const [attempt, setAttempt] = useState(0);
  return (
    <ActionForm
      key={attempt}
      focusOnMount={attempt > 0}
      action={saveProject}
      once={!project}
      successLink={!project && !modal ? { href: '/share', label: 'Back to your projects' } : undefined}
      successAction={
        !project && modal
          ? { label: 'Share another project', onClick: () => setAttempt((value) => value + 1) }
          : undefined
      }
    >
      <input type="hidden" name="id" value={project?.id || ''} />
      <input type="hidden" name="version" value={project?.updated_at || ''} />
      <Field
        label="Project name"
        name="title"
        value={project?.title}
        required
        minLength={3}
        maxLength={100}
      />
      <Field
        label="In one sentence"
        name="summary"
        value={project?.summary}
        required
        minLength={20}
        maxLength={240}
        help="What did you make, and who is it for?"
      />
      <Field
        label="The story behind the build"
        name="description"
        value={project?.description}
        required
        minLength={40}
        maxLength={6000}
        multiline
        rows={6}
        help="Share what it does, what you learned, and how someone can try or contribute to it."
      />
      <div className="form-grid">
        <Field
          label="Public GitHub repository"
          name="repository_url"
          type="url"
          value={project?.repository_url}
          required
          placeholder="https://github.com/you/your-project"
        />
        <Field
          label="Live demo"
          name="demo_url"
          type="url"
          value={project?.demo_url}
          placeholder="https://"
        />
      </div>
      <Field
        label="Tags"
        name="tags"
        value={project?.tags.join(', ')}
        help="Up to 6 tags, separated by commas. For example: TypeScript, open source, design."
        maxLength={160}
      />
      <div className="form-field">
        <label htmlFor="project-image">Project screenshot (optional)</label>
        <input
          type="file"
          id="project-image"
          name="image"
          accept="image/png,image/jpeg,image/webp"
          aria-describedby="image-help"
        />
        <small id="image-help">
          PNG, JPEG or WebP. Maximum 2 MB. Upload an image you have permission to share.
        </small>
      </div>
      {project?.image_path && <Checkbox name="remove_image" label="Remove the current screenshot" />}
      <p className="form-help">
        Only submit work you made or contributed to. Organizers review every submission. Editing a published
        project returns it to review.
      </p>
      <Submit pendingText="Submitting…">
        {project ? 'Save and submit for review' : 'Submit your project'}
        <Icon name="arrow" size={17} />
      </Submit>
    </ActionForm>
  );
}
export function WithdrawForm({ id }: { id: string }) {
  return (
    <ActionForm action={withdrawProject}>
      <input type="hidden" name="id" value={id} />
      <Submit quiet pendingText="Withdrawing…">
        Withdraw project
      </Submit>
    </ActionForm>
  );
}
export function ProposalForm() {
  return (
    <ActionForm
      action={submitProposal}
      once
      successLink={{ href: '/collaborate', label: 'View your proposals' }}
    >
      <Field
        label="What do you have in mind?"
        name="subject"
        required
        minLength={5}
        maxLength={160}
        placeholder="A workshop, a partnership, a talk…"
      />
      <Field
        label="Tell us a little more"
        name="message"
        multiline
        required
        minLength={30}
        maxLength={5000}
        rows={7}
        help="Include a contact method if you would like a reply. Your proposal is visible only to you and the organizers."
      />
      <Submit pendingText="Sending…">
        Send proposal
        <Icon name="arrow" size={17} />
      </Submit>
    </ActionForm>
  );
}
