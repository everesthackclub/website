import { FOUNDERS } from "../lib/site";

export default function Founders() {
  return (
    <section
      id="team"
      className="px-6 py-20 md:py-28 border-t border-gray-200 dark:border-neutral-800"
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-600 dark:text-red-500 mb-4">
            Team
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
            Club members
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
            The students who started Everest Hack Club. Reach out to any of us if
            you have a question.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FOUNDERS.map((member) => (
            <div
              key={member.name}
              className="p-6 bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 hover:border-gray-300 dark:hover:border-neutral-700 transition-colors"
            >
              <div className="w-12 h-12 mb-5 rounded-full bg-gray-900 dark:bg-neutral-800 flex items-center justify-center text-white text-sm font-semibold tracking-wide">
                {member.initials}
              </div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                {member.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-neutral-500">
                Founder
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
