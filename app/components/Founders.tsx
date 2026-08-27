import { FOUNDERS } from "../lib/site";

export default function Founders() {
  return (
    <section id="team" className="relative px-6 py-24 md:py-32 bg-gradient-to-b from-white to-gray-50 dark:from-neutral-950 dark:to-neutral-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-6">
            Club Members
          </h2>
          <div className="w-16 h-1 bg-red-600 dark:bg-red-500 mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            The students who started Everest Hack Club. Reach out to any of us if you have a question.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FOUNDERS.map((member) => (
            <div
              key={member.name}
              className="group p-8 bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 hover:border-gray-300 dark:hover:border-neutral-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-center"
            >
              <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-gradient-to-br from-red-600 to-red-500 dark:from-red-500 dark:to-red-400 flex items-center justify-center text-white text-2xl font-bold group-hover:scale-110 transition-transform">
                {member.initials}
              </div>
              <h3 className="text-lg font-bold text-black dark:text-white mb-1">
                {member.name}
              </h3>
              <p className="text-sm font-medium text-red-600 dark:text-red-400">
                Founder
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
