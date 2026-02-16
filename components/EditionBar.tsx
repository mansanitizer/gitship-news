interface EditionBarProps {
  issueNumber?: number;
}

export default function EditionBar({ issueNumber }: EditionBarProps) {
  return (
    <div className="flex justify-between items-center px-4 md:px-8 py-2 border-b border-ink-dark font-tagline text-xs uppercase tracking-widest bg-newsprint-dark">
      <span>Vol. I{issueNumber ? `, No. ${issueNumber}` : ''}</span>
      <span className="font-semibold">Where Silicon Meets Ink</span>
      <span>Est. 2026</span>
    </div>
  );
}
