import MissionGraphic from "../../assets/graphics/MissionGraphic.webp";
import TeamGrid from "../../assets/graphics/TeamGrid.webp";
import FadeInSection from "../animations/FadeInSection";

export default function About({ id }) {
  return (
    <section
      id={id}
      className="bg-primary-1500 text-primary-50 overflow-hidden bg-[url('../src/assets/Noise.webp')] bg-repeat"
    >
      <FadeInSection>
        <div className="m-auto max-w-[84rem] px-12 py-24 
          max-xl:px-10 max-lg:px-8 max-md:px-6 max-sm:px-4 max-sm:py-16"
        >
          {/* Header */}
          <header className="mb-14 text-center">
            <h1 className="text-5xl font-extrabold tracking-tight max-md:text-3xl">
              About{" "}
              <span className="text-primary-500 primary-glow">DevPath</span>
            </h1>
            <p className="mt-4 mx-auto max-w-2xl text-lg font-light text-primary-100/90">
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
              <h2 className="text-3xl font-semibold mb-4">Our Mission</h2>
              <p className="text-primary-100/95 leading-relaxed text-lg font-light">
                Empower students from colleges and universities — especially
                those in STEM and ICT programs — with practical, data-driven
                career recommendations so they can confidently choose
                internships and pathways that match their strengths and
                interests.
              </p>

              <h2 className="text-3xl font-semibold mt-8 mb-4">Our Vision</h2>
              <p className="text-primary-100/95 leading-relaxed text-lg font-light">
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
            <h3 className="text-2xl font-semibold mb-6">
              Built by Students, for Students
            </h3>
            <p className="text-primary-100/90 mb-6 max-w-3xl font-light">
              DevPath is a capstone project by students at the University of
              Mindanao (Computer Science & IT). We designed the system with
              accessibility, affordability, and explainability in mind so it’s
              useful for thesis presentations and real student decision-making.
            </p>

            <figure className="rounded-xl overflow-hidden border border-primary-800/30 shadow-lg">
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
              <div
                key={i}
                className="p-6 bg-gradient-to-br from-primary-1400 to-primary-1300 rounded-2xl border border-primary-800/30"
              >
                <h4 className="text-lg font-semibold mb-2">{pillar.title}</h4>
                <p className="text-primary-100/90 text-sm font-light">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div
            className="rounded-2xl bg-primary-1400 border border-primary-800/30 p-8 
            flex items-center justify-between gap-6 
            max-md:flex-col max-md:text-center max-md:items-center"
          >
            <div>
              <h4 className="text-2xl font-semibold">Ready to find your path?</h4>
              <p className="text-primary-100/90 font-light">
                Take the quick assessment and get a personalized roadmap
                tailored to your course and skills.
              </p>
            </div>
            <div className="flex gap-4 max-md:flex-col max-md:w-full">
              <button className="rounded-full px-6 py-3 bg-primary-500 text-black font-semibold shadow-xl hover:scale-[1.02] transition-transform w-full max-md:text-sm">
                Start Assessment
              </button>
              <button className="rounded-full px-6 py-3 border border-primary-700 text-primary-100 font-medium hover:bg-primary-1300 transition w-full max-md:text-sm">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </FadeInSection>
    </section>
  );
}