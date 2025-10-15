// src/pages/PersonalAssessments.jsx
import { memo } from "react";
import { motion } from "framer-motion";
import { Heart, Users, Target } from "lucide-react";
import DashNav from "../components/dashboard/DashboardNav";

export default function PersonalAssessments() {
  const personal = [
    {
      id: "career-interests",
      title: "🎯 Career Interests",
      description: "Discover career directions aligned with your passions, motivations, and long-term goals.",
    },
    {
      id: "behavior-traits",
      title: "🤝 Behavior & Teamwork",
      description: "Understand your personality traits, teamwork abilities, and collaboration style.",
    },
    {
      id: "preferences",
      title: "💡 Preferences",
      description: "Identify preferred work styles, leadership inclinations, and workplace values.",
    },
  ];

  return (
    <section className="min-h-screen w-full bg-gradient-to-b from-primary-1400 via-primary-1500 to-black px-4 sm:px-6 lg:px-10 py-12 sm:py-16">
      <DashNav />

      <motion.div
        initial="hidden"
        animate="show"
        variants={{ hidden: { opacity: 0, y: -40 }, show: { opacity: 1, y: 0 } }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16 sm:mb-20 mt-10 sm:mt-12 relative"
      >
        <h1 className="relative inline-block text-4xl sm:text-5xl lg:text-6xl font-extrabold 
                 bg-gradient-to-r from-emerald-400 via-green-300 to-cyan-400 
                 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(0,255,180,0.4)] 
                 tracking-tight">
          🎯 Personal Assessments
          <span className="absolute left-1/2 -bottom-3 w-24 sm:w-32 h-[3px] 
                     bg-gradient-to-r from-emerald-400 via-green-300 to-cyan-400 
                     rounded-full transform -translate-x-1/2 animate-pulse"></span>
        </h1>

        <p className="mt-6 text-gray-300/90 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed font-light tracking-wide">
          Gain insights into your <span className="text-emerald-400 font-medium">behavior</span>, 
          <span className="text-green-300 font-medium"> preferences</span>, and 
          <span className="text-cyan-400 font-medium"> career interests</span>.
        </p>
      </motion.div>

      <div className="m-auto max-w-7xl">
        <Section title="🎯 Personal Skills & Interests" items={personal} />
      </div>
    </section>
  );
}

const Section = memo(function Section({ title, items }) {
  const icons = [<Target size={32} />, <Users size={32} />, <Heart size={32} />];

  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative rounded-3xl p-8 sm:p-12 mb-20 overflow-hidden"
    >
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary-1200 via-primary-1400 to-primary-1500 opacity-90" />
      <div className="absolute inset-0 rounded-3xl border border-white/10 backdrop-blur-2xl shadow-[inset_0_0_30px_rgba(255,255,255,0.05),0_10px_50px_rgba(0,0,0,0.6)]" />

      <div className="relative z-10">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{title}</h2>
        <div className="h-[3px] w-24 bg-gradient-to-r from-emerald-400 to-transparent rounded-full mb-10 mt-3"></div>

        <motion.div
          className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.15 } },
          }}
        >
          {items.map((a, idx) => (
            <motion.div
              key={a.id}
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: { opacity: 1, y: 0 },
              }}
              whileHover={{ scale: 1.03 }}
              className="rounded-2xl bg-gradient-to-br from-gray-800/80 to-gray-900/90 border border-emerald-400/30 p-6 sm:p-8 shadow-lg flex flex-col justify-between group transition"
            >
              <div className="mb-4 text-emerald-400">{icons[idx]}</div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                {a.title}
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">{a.description}</p>

              <motion.button
                whileTap={{ scale: 0.95 }}
                className="mt-6 rounded-full bg-emerald-500 px-5 sm:px-6 py-3 text-primary-1300 font-semibold shadow-[0_0_20px_rgba(0,255,180,0.5)] hover:shadow-[0_0_40px_rgba(0,255,180,0.8)] transition-all text-sm sm:text-base"
              >
                Start Test →
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
});
