export default function LoadingProjectForm() {
  return (
    <div className="project-dialog-state" role="status" aria-live="polite">
      <span className="project-dialog-loader" aria-hidden="true" />
      <p>Loading your project workspace…</p>
    </div>
  );
}
