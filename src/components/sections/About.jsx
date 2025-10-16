import MissionGraphic from "../../assets/graphics/MissionGraphic.webp";
import TeamGrid from "../../assets/graphics/TeamGrid.webp";
import FadeInSection from "../animations/FadeInSection";
import { useTheme } from "../../contexts/ThemeContext";
import { useEffect, useRef } from "react";

function PillarCard({ pillar, theme }) {
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
    <div className="p-6 dark:bg-gradient-to-br dark:from-primary-1400 dark:to-primary-1300 light:bg-white rounded-2xl border dark:border-primary-800/30 light:border-gray-300 shadow-lg">
      <h4 ref={titleRef} className="text-lg font-semibold mb-2 dark:text-white light:text-gray-900">{pillar.title}</h4>
      <p ref={descRef} className="dark:text-primary-100/90 light:text-gray-800 text-sm dark:font-light light:font-normal">
        {pillar.desc}
      </p>
    </div>
  );
}

export default function About({ id }) {
  const { theme } = useTheme();
  const headerTitleRef = useRef(null);
  const headerDescRef = useRef(null);
  const missionTitleRef = useRef(null);
  const missionTextRef = useRef(null);
  const visionTitleRef = useRef(null);
  const visionTextRef = useRef(null);
  const teamTitleRef = useRef(null);
  const teamTextRef = useRef(null);
  const ctaTitleRef = useRef(null);
  const ctaTextRef = useRef(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const refs = [
      { ref: headerTitleRef, color: '#111827' },
      { ref: headerDescRef, color: '#1f2937' },
      { ref: missionTitleRef, color: '#111827' },
      { ref: missionTextRef, color: '#1f2937' },
      { ref: visionTitleRef, color: '#111827' },
      { ref: visionTextRef, color: '#1f2937' },
      { ref: teamTitleRef, color: '#111827' },
      { ref: teamTextRef, color: '#1f2937' },
      { ref: ctaTitleRef, color: '#111827' },
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

    // Force background color to blend with How It Works
    if (sectionRef.current) {
      if (theme === 'light') {
        sectionRef.current.style.setProperty('background-color', '#f9fafb', 'important');
      } else {
        sectionRef.current.style.removeProperty('background-color');
      }
    }
  }, [theme]);

  return (
    <section
      ref={sectionRef}
      id={id}
      className="dark:bg-primary-1500 light:bg-gray-50 dark:text-primary-50 light:text-gray-900 overflow-hidden dark:bg-[url('../src/assets/Noise.webp')] bg-repeat"
    >
      <FadeInSection>
        <div className="m-auto max-w-[84rem] px-12 py-24 
          max-xl:px-10 max-lg:px-8 max-md:px-6 max-sm:px-4 max-sm:py-16"
        >
          {/* Header */}
          <header className="mb-14 text-center">
            <h1 ref={headerTitleRef} className="text-5xl font-extrabold tracking-tight max-md:text-3xl dark:text-white light:text-gray-900">
              About{" "}
              <span className="text-primary-500 primary-glow">DevPath</span>
            </h1>
            <p ref={headerDescRef} className="mt-4 mx-auto max-w-2xl text-lg dark:font-light light:font-normal dark:text-primary-100/90 light:text-gray-800">
              Smart career guidance for students — combining academic signals,
              skill assessments, and real-world role-matching to create a
              personalized roadmap for internships and early-career roles.
            </p>
          </header>

          {/* Mission & Vision */}
          <div className="grid grid-cols-2 gap-10 items-center mb-20
            max-lg:gap-8 max-md:grid-cols-1 max-md:gap-12"
          >
            <div>
              <h2 ref={missionTitleRef} className="text-3xl font-semibold mb-4 dark:text-white light:text-gray-900">Our Mission</h2>
              <p ref={missionTextRef} className="dark:text-primary-100/95 light:text-gray-800 leading-relaxed text-lg dark:font-light light:font-normal">
                Empower students from colleges and universities — especially
                those in STEM and ICT programs — with practical, data-driven
                career recommendations so they can confidently choose
                internships and pathways that match their strengths and
                interests.
              </p>

              <h2 ref={visionTitleRef} className="text-3xl font-semibold mt-8 mb-4 dark:text-white light:text-gray-900">Our Vision</h2>
              <p ref={visionTextRef} className="dark:text-primary-100/95 light:text-gray-800 leading-relaxed text-lg dark:font-light light:font-normal">
                A future where every student has access to personalized career
                guidance that bridges classroom learning and industry needs,
                helping create a strong pipeline of skilled graduates ready for
                the tech workforce.
              </p>
            </div>

            <figure className="flex justify-center max-md:mt-6">
              <img
                src={MissionGraphic}
                alt="DevPath mission graphic"
                className="max-h-[28rem] rounded-2xl shadow-2xl"
              />
            </figure>
          </div>

          {/* Team / Creds */}
          <div className="mb-20">
            <h3 ref={teamTitleRef} className="text-2xl font-semibold mb-6 dark:text-white light:text-gray-900">
              Built by Students, for Students
            </h3>
            <p ref={teamTextRef} className="dark:text-primary-100/90 light:text-gray-800 mb-6 max-w-3xl dark:font-light light:font-normal">
              DevPath is a capstone project by students at the University of
              Mindanao (Computer Science & IT). We designed the system with
              accessibility, affordability, and explainability in mind so it's
              useful for thesis presentations and real student decision-making.
            </p>

            <figure className="rounded-xl overflow-hidden dark:border-primary-800/30 light:border-gray-300 border shadow-lg">
              <img
                src={TeamGrid}
                alt="DevPath team"
                className="w-full object-cover h-72 max-lg:h-64 max-md:h-56 max-sm:h-48"
              />
            </figure>
          </div>

          {/* Values / Pillars */}
          <div className="mb-20 grid grid-cols-3 gap-6 max-lg:grid-cols-2 max-md:grid-cols-1">
            {[
              {
                title: "Transparent",
                desc: "Explainable recommendations and clear reasoning for every suggested job role.",
              },
              {
                title: "Affordable",
                desc: "Designed to be lightweight and budget-friendly for student use and presentations.",
              },
              {
                title: "Practical",
                desc: "Actionable next steps: practice sets, internship targets, and exportable reports.",
              },
            ].map((pillar, i) => (
              <PillarCard key={i} pillar={pillar} theme={theme} />
            ))}
          </div>

          {/* CTA */}
          <div
            className="rounded-2xl dark:bg-primary-1400 light:bg-white border dark:border-primary-800/30 light:border-gray-300 p-8 shadow-xl
            flex items-center justify-between gap-6
            max-md:flex-col max-md:text-center max-md:items-center"
          >
            <div>
              <h4 ref={ctaTitleRef} className="text-2xl font-semibold dark:text-white light:text-gray-900">Ready to find your path?</h4>
              <p ref={ctaTextRef} className="dark:text-primary-100/90 light:text-gray-800 dark:font-light light:font-normal">
                Take the quick assessment and get a personalized roadmap
                tailored to your course and skills.
              </p>
            </div>
            <div className="flex gap-4 max-md:flex-col max-md:w-full">
              <button className="rounded-full px-6 py-3 bg-primary-500 dark:text-black light:text-white font-semibold shadow-xl hover:scale-[1.02] transition-transform w-full max-md:text-sm">
                Start Assessment
              </button>
              <button className="rounded-full px-6 py-3 border dark:border-primary-700 light:border-gray-300 dark:text-primary-100 light:text-gray-900 font-medium dark:hover:bg-primary-1300 light:hover:bg-gray-100 transition w-full max-md:text-sm">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </FadeInSection>
    </section>
  );
}