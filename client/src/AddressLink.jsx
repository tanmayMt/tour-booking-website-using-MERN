export default function AddressLink({ children, className = '' }) {
  return (
    <a
      className={`inline-flex items-center gap-1.5 text-sm text-[#6b7280] transition-colors hover:text-[#111827] hover:underline ${className}`}
      target="_blank"
      rel="noopener noreferrer"
      href={`https://maps.google.com/?q=${encodeURIComponent(children)}`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4 shrink-0">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
      <span>{children}</span>
    </a>
  );
}
