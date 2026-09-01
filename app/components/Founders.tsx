import { FOUNDERS } from "../lib/site";

export default function Founders() {
  return (
    <section id="team" className="relative px-5 sm:px-8 py-24 md:py-32">
      <div className="max-w-5xl mx-auto">

        {/* Section header */}
        <div className="mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--red)] mb-3">
            The People
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] leading-tight">
            Club Members
          </h2>
          <p className="mt-3 text-base text-[var(--text-secondary)] max-w-lg leading-relaxed">
            The students who started Everest Hack Club. Reach out to any of us
            — we&apos;d love to chat.
          </p>
        </div>

        {/* Photo placeholder banner — swap this div with a real <Image> after your first meeting */}
        <div className="mb-12 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface-1)] flex flex-col items-center justify-center py-14 px-6 gap-3 text-center">
          <div className="w-10 h-10 rounded-full bg-[var(--surface-2)] flex items-center justify-center mb-1">
            <svg
              className="w-5 h-5 text-[var(--text-tertiary)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
              />
            </svg>
          </div>
          <p className="text-sm font-medium text-[var(--text-secondary)]">
            Group photo coming soon
          </p>
          <p className="text-xs text-[var(--text-tertiary)] max-w-xs">
            We&apos;ll drop our first meeting photo here to make this more authentic 📸
          </p>
        </div>

        {/* Member cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {FOUNDERS.map((member) => (
            <div
              key={member.name}
              className="group flex flex-col items-center text-center p-6 bg-[var(--surface-1)] rounded-2xl border border-[var(--border)] hover:border-[var(--border-subtle)] hover:bg-white dark:hover:bg-[var(--surface-2)] hover:shadow-[var(--shadow-md)] transition-all duration-200"
            >
              {/* Avatar */}
              <div
                className="w-14 h-14 mb-4 rounded-full flex items-center justify-center text-white text-lg font-bold group-hover:scale-105 transition-transform duration-200 flex-shrink-0"
                style={{ background: "var(--red)" }}
                aria-hidden="true"
              >
                {member.initials}
              </div>

              <h3 className="text-sm font-semibold text-[var(--text-primary)] leading-tight mb-0.5">
                {member.name}
              </h3>
              <p className="text-xs font-medium" style={{ color: "var(--red)" }}>
                Founder
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
