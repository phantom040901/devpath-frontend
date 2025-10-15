import { careerPaths, assessmentAreas } from "../../../utils/content";

export default function CareerPaths() {
  return (
    <section className="bg-gradient-to-top relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-96 h-96 bg-primary-500 rounded-full blur-[120px]" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full blur-[120px]" />
      </div>

      <div className="relative m-auto max-w-[90rem] px-24 py-24 max-xl:px-16 max-xl:py-20 max-lg:px-8 max-lg:py-16 max-md:px-6">
        {/* Header Section - Compact */}
        <div className="mb-12 flex flex-col items-center text-center max-lg:mb-10">
          <p className="text-primary-1300 bg-primary-500 primary-glow rounded-full px-4 py-2 text-sm font-semibold mb-4">
            Career Paths
          </p>
          <h2 className="text-primary-50 text-5xl font-bold tracking-tight mb-4 max-xl:text-4xl max-lg:text-3xl max-sm:text-2xl">
            7 Tech Career Paths to Explore
          </h2>
          <p className="text-primary-100 text-lg max-w-3xl max-lg:text-base">
            Match your skills to the right career with AI-powered recommendations
          </p>
        </div>

        {/* Modern Compact Grid - 7 Cards */}
        <div className="grid grid-cols-4 gap-4 mb-12 max-xl:grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1">
          {careerPaths.map((path) => (
            <div
              key={path.id}
              className={`group relative bg-gradient-to-br ${path.color} border ${path.border} rounded-xl p-5 hover:scale-[1.02] transition-all duration-300 cursor-pointer backdrop-blur-sm`}
            >
              {/* Icon and Title */}
              <div className="flex items-start gap-3 mb-3">
                <div className="text-4xl flex-shrink-0">{path.icon}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-primary-50 text-lg font-bold leading-tight mb-1 max-xl:text-base">
                    {path.title}
                  </h3>
                  <p className="text-primary-200 text-xs leading-snug">
                    {path.description}
                  </p>
                </div>
              </div>

              {/* Roles - Compact Pills */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {path.roles.slice(0, 3).map((role, idx) => (
                  <span
                    key={idx}
                    className="text-primary-100 text-xs bg-white/10 rounded-md px-2 py-1 border border-white/10"
                  >
                    {role}
                  </span>
                ))}
                {path.roles.length > 3 && (
                  <span className="text-primary-300 text-xs px-2 py-1">
                    +{path.roles.length - 3}
                  </span>
                )}
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/0 group-hover:from-white/5 group-hover:to-white/5 rounded-xl transition-all duration-300" />
            </div>
          ))}
        </div>

        {/* Assessment Overview - Horizontal Compact */}
        <div className="bg-primary-1400/30 border border-primary-500/20 rounded-2xl p-8 backdrop-blur-sm max-lg:p-6">
          <div className="flex items-center justify-between mb-6 max-lg:flex-col max-lg:gap-4">
            <div>
              <h3 className="text-primary-50 text-2xl font-bold mb-2 max-lg:text-xl max-lg:text-center">
                How DevPath Analyzes You
              </h3>
              <p className="text-primary-200 text-sm max-lg:text-center">
                Comprehensive evaluation across three key dimensions
              </p>
            </div>
            <a
              href="#hero"
              className="flex-shrink-0 bg-primary-500 text-primary-1300 font-semibold px-6 py-3 rounded-full hover:bg-primary-50 transition-all shadow-[0_0_20px_rgba(0,255,200,0.4)] hover:shadow-[0_0_30px_rgba(0,255,200,0.6)] text-sm"
            >
              Start Assessment →
            </a>
          </div>

          {/* Assessment Cards - Horizontal */}
          <div className="grid grid-cols-3 gap-4 max-lg:grid-cols-1">
            {assessmentAreas.map((area) => (
              <div
                key={area.id}
                className="bg-primary-1300/5 border border-primary-500/10 rounded-xl p-5 hover:border-primary-500/30 transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-3xl">{area.icon}</div>
                  <div>
                    <h4 className="text-primary-50 text-base font-bold leading-tight">
                      {area.title}
                    </h4>
                    <p className="text-primary-300 text-xs">
                      {area.description}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {area.topics.slice(0, 4).map((topic, idx) => (
                    <span
                      key={idx}
                      className="text-primary-300 text-xs bg-primary-500/5 rounded-md px-2 py-0.5 border border-primary-500/10"
                    >
                      {topic}
                    </span>
                  ))}
                  {area.topics.length > 4 && (
                    <span className="text-primary-400 text-xs px-2 py-0.5">
                      +{area.topics.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
