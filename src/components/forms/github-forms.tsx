'use client';
import { ActionForm, Submit } from './form';
import { setParticipation, refreshActivity } from '@/app/actions/github';
export function ParticipationForm({ listed }: { listed: boolean }) {
  return (
    <ActionForm action={setParticipation}>
      <input type="hidden" name="enabled" value={String(!listed)} />
      <Submit quiet={listed}>{listed ? 'Leave the leaderboard' : 'Join the monthly leaderboard'}</Submit>
    </ActionForm>
  );
}
export function RefreshActivityForm() {
  return (
    <ActionForm action={refreshActivity}>
      <Submit quiet pendingText="Checking GitHub…">
        Refresh public activity
      </Submit>
    </ActionForm>
  );
}
