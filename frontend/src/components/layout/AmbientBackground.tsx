export function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div className="absolute -left-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-accent-start/15 blur-3xl" />
      <div className="absolute -right-24 top-1/3 h-80 w-80 rounded-full bg-accent-end/12 blur-3xl" />
    </div>
  );
}
