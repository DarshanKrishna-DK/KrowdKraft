'use client';

export default function ProjectError({ reset }: { reset: () => void }) {
  return (
    <div className="project-dialog-state" role="alert">
      <h3>We couldn’t load your projects.</h3>
      <p>Please try again. Your existing submissions are still saved.</p>
      <button className="button" type="button" onClick={reset}>
        Try again
      </button>
    </div>
  );
}
