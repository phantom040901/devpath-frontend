import { motion } from "framer-motion";
import { CheckCircle, BarChart3, Target, BookOpen, Award } from "lucide-react";
import { useTheme } from "../../../contexts/ThemeContext";
import { useEffect, useRef } from "react";

// Placeholder imports - YOU WILL REPLACE THESE WITH YOUR ACTUAL SCREENSHOTS
import assessmentPreview from "../../../assets/screenshots/assessment-preview.png";
import careerMatchesPreview from "../../../assets/screenshots/career-matches-preview.png";
import dashboardPreview from "../../../assets/screenshots/dashboard-preview.png";
import reportsPreview from "../../../assets/screenshots/reports-preview.png";
import learningPathPreview from "../../../assets/screenshots/learning-path-preview.png";

function FeatureCard({ feature, index, theme }) {
  const titleRef = useRef(null);
  const descRef = useRef(null);

  useEffect(() => {
    if (titleRef.current) {
      if (theme === 'light') {
        titleRef.current.style.setProperty('color', '#111827', 'important');
      } else {
        titleRef.current.style.removeProperty('color');
      }
    }
    if (descRef.current) {
      if (theme === 'light') {
        descRef.current.style.setProperty('color', '#1f2937', 'important');
      } else {
        descRef.current.style.removeProperty('color');
      }
    }
  }, [theme]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`grid md:grid-cols-2 gap-12 items-center ${
        index % 2 === 1 ? "md:grid-flow-dense" : ""
      }`}
    >
      {/* Text Content */}
      <div className={index % 2 === 1 ? "md:col-start-2" : ""}>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl dark:bg-primary-1300/40 light:bg-primary-100 border dark:border-primary-800 light:border-primary-300">
            {feature.icon}
          </div>
          <h3 ref={titleRef} className="dark:text-primary-50 light:text-gray-900 text-2xl font-bold max-lg:text-xl">
            {feature.title}
          </h3>
        </div>
        <p ref={descRef} className="dark:text-primary-200 light:text-gray-800 text-lg dark:font-light light:font-normal leading-relaxed max-lg:text-base">
          {feature.description}
        </p>
      </div>

      {/* Screenshot */}
      <div className={index % 2 === 1 ? "md:col-start-1 md:row-start-1" : ""}>
        <div className="relative group">
          {/* Glow effect */}
          <div className="absolute -inset-4 bg-gradient-to-r from-primary-500/20 to-purple-500/20 rounded-2xl blur-2xl group-hover:blur-3xl transition-all duration-300 opacity-50 group-hover:opacity-100 light:hidden" />

          {/* Image container */}
          <div className="relative dark:bg-primary-1300/40 light:bg-white border dark:border-primary-800 light:border-gray-300 rounded-2xl p-2 shadow-2xl backdrop-blur-sm overflow-hidden">
            <img
              src={feature.image}
              alt={feature.alt}
              className="w-full h-auto rounded-lg shadow-lg"
              onError={(e) => {
                // Fallback for missing images - show placeholder
                e.target.style.display = "none";
                e.target.parentElement.innerHTML = `
                  <div class="w-full h-64 bg-gradient-to-br from-primary-1300/60 to-primary-1400/60 rounded-lg flex items-center justify-center border-2 border-dashed border-primary-500/30">
                    <div class="text-center p-8">
                      <div class="text-primary-400 text-5xl mb-4">📸</div>
                      <p class="text-primary-300 font-semibold mb-2">${feature.title}</p>
                      <p class="text-primary-500 text-sm">Screenshot placeholder</p>
                      <p class="text-primary-600 text-xs mt-2">Add your screenshot to:<br/>src/assets/screenshots/</p>
                    </div>
                  </div>
                `;
              }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function SystemPreview({ id = "system-preview" }) {
  const { theme } = useTheme();
  const mainTitleRef = useRef(null);
  const mainDescRef = useRef(null);
  const ctaTextRef = useRef(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const refs = [
      { ref: mainTitleRef, color: '#111827' },
      { ref: mainDescRef, color: '#1f2937' },
      { ref: ctaTextRef, color: '#1f2937' },
    ];

    refs.forEach(({ ref, color }) => {
      if (ref.current) {
        if (theme === 'light') {
          ref.current.style.setProperty('color', color, 'important');
        } else {
          ref.current.style.removeProperty('color');
        }
      }
    });

    // Force background color to blend with FAQ
    if (sectionRef.current) {
      if (theme === 'light') {
        sectionRef.current.style.setProperty('background-color', '#f9fafb', 'important');
      } else {
        sectionRef.current.style.removeProperty('background-color');
      }
    }
  }, [theme]);
  const features = [
    {
      icon: <CheckCircle className="text-primary-400" size={24} />,
      title: "Comprehensive Assessment",
      description: "20+ factors analyzed across academic, technical, and personal dimensions",
      image: assessmentPreview,
      alt: "DevPath Assessment Interface"
    },
    {
      icon: <Target className="text-purple-400" size={24} />,
      title: "AI-Powered Career Matching",
      description: "Advanced algorithms match you to the best-fit career from 7 tech categories",
      image: careerMatchesPreview,
      alt: "DevPath Career Matches"
    },
    {
      icon: <BarChart3 className="text-emerald-400" size={24} />,
      title: "Progress Dashboard",
      description: "Track your skill development and career readiness in real-time",
      image: dashboardPreview,
      alt: "DevPath Student Dashboard"
    },
    {
      icon: <Award className="text-yellow-400" size={24} />,
      title: "Detailed Career Reports",
      description: "In-depth analysis with strengths, growth areas, and career insights",
      image: reportsPreview,
      alt: "DevPath Career Reports"
    },
    {
      icon: <BookOpen className="text-cyan-400" size={24} />,
      title: "Personalized Learning Path",
      description: "Curated resources from 200+ learning materials tailored to your goals",
      image: learningPathPreview,
      alt: "DevPath Learning Path"
    }
  ];

  return (
    <section
      ref={sectionRef}
      id={id}
      className="relative dark:bg-primary-1500 light:bg-gray-50 overflow-hidden dark:bg-[url('../src/assets/Noise.webp')] bg-repeat"
    >
      {/* Background glow */}
      <div className="bg-primary-1300 absolute top-[60%] left-[0%] h-[45rem] w-[45rem] -translate-y-[50%] rounded-full opacity-30 blur-[30rem] light:hidden" />

      <div className="relative w-full max-w-[90rem] mx-auto px-24 pt-0 pb-24 max-xl:px-16 max-xl:pb-20 max-lg:px-8 max-lg:pb-16 max-md:px-6 max-md:pb-14">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 pt-16 sm:pt-20 lg:pt-24 xl:pt-28"
        >
          <p className="text-primary-500 dark:text-primary-1300 dark:bg-primary-500 light:bg-primary-500 primary-glow rounded-full px-4 py-2 text-sm font-semibold mb-6 inline-block light:text-white">
            System Preview
          </p>
          <h2 ref={mainTitleRef} className="dark:text-primary-50 light:text-gray-900 text-6xl font-extrabold tracking-tight mb-6 max-xl:text-5xl max-lg:text-4xl max-sm:text-3xl">
            See DevPath in Action
          </h2>
          <p ref={mainDescRef} className="dark:text-primary-100 light:text-gray-800 text-xl dark:font-light light:font-normal max-w-3xl mx-auto max-xl:text-lg max-md:text-base">
            Experience the complete career guidance system designed for tech professionals
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="space-y-24 max-lg:space-y-16">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} theme={theme} />
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-20 text-center"
        >
          <p ref={ctaTextRef} className="dark:text-primary-100 light:text-gray-800 text-lg dark:font-light light:font-normal mb-6">
            Ready to discover your ideal tech career path?
          </p>
          <a
            href="#hero"
            className="inline-block bg-gradient-to-r from-primary-500 to-cyan-400 dark:text-primary-1300 light:text-white font-bold px-10 py-4 rounded-full hover:scale-105 transition-all shadow-[0_0_30px_rgba(0,255,200,0.4)] hover:shadow-[0_0_50px_rgba(0,255,200,0.6)]"
          >
            Get Started Today
          </a>
        </motion.div>
      </div>
    </section>
  );
}
