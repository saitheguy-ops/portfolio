/** The site mark: a muon track crossing a detector frame, ending in a hit. */
export default function MuonMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" fill="none">
      <rect x="1.5" y="1.5" width="29" height="29" rx="6" stroke="currentColor" strokeOpacity="0.35" />
      <path d="M8 5.5 L21 24" stroke="var(--accent)" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="22.6" cy="26.2" r="2.1" fill="var(--signal)" />
      <path d="M24.5 6.5 L20.5 12" stroke="currentColor" strokeOpacity="0.45" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
