import AssessSkills from "../../assets/graphics/AssessSkills.webp";
import CosineMatch from "../../assets/graphics/CosineMatch.webp";
import PersonalizedPath from "../../assets/graphics/PersonalizedPath.webp";

// 👇 Import fade wrapper
import FadeInSection from "../animations/FadeInSection";

export default function HowItWorks({ id }) {
  return (
    <section
      id={id}
      className="bg-primary-1500 overflow-hidden bg-[url('../src/assets/Noise.webp')] bg-repeat"
    >
      <div className="text-primary-50 m-auto max-w-[90rem] px-6 sm:px-8 lg:px-16 xl:px-24 py-16 sm:py-20 lg:py-24 xl:py-32">
        {/* Ambient glow */}
        <div className="bg-primary-1300 absolute top-1/2 left-full h-[62.5rem] w-[62.5rem] -translate-x-1/2 rounded-full opacity-100 blur-[40rem] max-xl:h-[35rem] max-xl:w-[35rem] max-xl:blur-[10rem] max-lg:left-[90%] max-lg:h-[20rem] max-lg:w-[20rem]" />

        {/* Heading */}
        <FadeInSection>
          <h2 className="mb-12 sm:mb-16 lg:mb-20 xl:mb-28 text-center text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-semibold tracking-tight sm:tracking-tighter">
            How <span className="text-primary-500 primary-glow">DevPath</span> Works
          </h2>
        </FadeInSection>

        {/* STEP 1 */}
        <div className="mb-16 xl:mb-20 grid grid-cols-1 md:grid-cols-2 items-center gap-10 lg:gap-16">
          <FadeInSection>
            <figure className="w-full flex justify-center">
              <div className="group relative rounded-2xl overflow-hidden bg-primary-1400 p-4 transition-all duration-300 hover:shadow-[0_0_25px_rgba(56,189,248,0.8)] hover:scale-105">
                <img
                  className="w-full h-auto max-w-lg transition-all duration-300 group-hover:brightness-110"
                  src={AssessSkills}
                  alt="Step 1 – Assess skills and interests"
                />
              </div>
            </figure>
          </FadeInSection>
          <FadeInSection>
            <div className="max-w-lg md:justify-self-end">
              <p className="mb-4 inline-flex items-center gap-3 text-sm uppercase tracking-[0.2em] text-primary-300">
                <span className="grid place-items-center h-8 w-8 rounded-full border border-primary-700/60 bg-primary-1400 text-primary-200">
                  1
                </span>
                Step One
              </p>
              <p className="mb-4 sm:mb-6 text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-semibold tracking-tight sm:tracking-tighter">
                Assess Your Profile
              </p>
              <p className="text-primary-100 text-base sm:text-lg lg:text-xl font-light leading-relaxed">
                Start by selecting your <em>current course</em> (e.g., BSCS, BSIT), rating core subjects, and indicating
                tools and interests. You can also take the quick assessment and optionally upload grades or a resume
                snippet for richer signals.
              </p>
            </div>
          </FadeInSection>
        </div>

        {/* STEP 2 */}
<div className="mb-16 xl:mb-20 flex flex-col-reverse md:grid md:grid-cols-2 items-center gap-10 lg:gap-16">
  {/* Text Block */}
  <FadeInSection>
    <div className="max-w-lg md:justify-self-start">
      <p className="mb-4 inline-flex items-center gap-3 text-sm uppercase tracking-[0.2em] text-primary-300">
        <span className="grid place-items-center h-8 w-8 rounded-full border border-primary-700/60 bg-primary-1400 text-primary-200">
          2
        </span>
        Step Two
      </p>
      <p className="mb-4 sm:mb-6 text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-semibold tracking-tight sm:tracking-tighter">
        Match with Roles (Cosine Similarity)
      </p>
      <p className="text-primary-100 text-base sm:text-lg lg:text-xl font-light leading-relaxed">
        DevPath vectorizes your profile and compares it to job-role and alumni patterns using{" "}
        <strong>cosine similarity</strong>. We blend in rule-based signals and can optionally use a supervised
        model. The result is a ranked list of careers that fit your strengths.
      </p>
    </div>
  </FadeInSection>

  {/* Image Block */}
  <FadeInSection>
    <figure className="w-full flex justify-center">
      <div className="group relative rounded-2xl overflow-hidden bg-primary-1400 p-4 transition-all duration-300 hover:shadow-[0_0_25px_rgba(56,189,248,0.8)] hover:scale-105">
        <img
          className="w-full h-auto max-w-lg transition-all duration-300 group-hover:brightness-110"
          src={CosineMatch}
          alt="Step 2 – Algorithm analyzes your profile"
        />
      </div>
    </figure>
  </FadeInSection>
</div>



        {/* STEP 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-10 lg:gap-16">
          <FadeInSection>
            <figure className="w-full flex justify-center">
              <div className="group relative rounded-2xl overflow-hidden bg-primary-1400 p-4 transition-all duration-300 hover:shadow-[0_0_25px_rgba(56,189,248,0.8)] hover:scale-105">
                <img
                  className="w-full h-auto max-w-lg transition-all duration-300 group-hover:brightness-110"
                  src={PersonalizedPath}
                  alt="Step 3 – Personalized career path and roadmap"
                />
              </div>
            </figure>
          </FadeInSection>
          <FadeInSection>
            <div className="max-w-lg md:justify-self-end">
              <p className="mb-4 inline-flex items-center gap-3 text-sm uppercase tracking-[0.2em] text-primary-300">
                <span className="grid place-items-center h-8 w-8 rounded-full border border-primary-700/60 bg-primary-1400 text-primary-200">
                  3
                </span>
                Step Three
              </p>
              <p className="mb-4 sm:mb-6 text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-semibold tracking-tight sm:tracking-tighter">
                Get Your Roadmap & Track Progress
              </p>
              <p className="text-primary-100 text-base sm:text-lg lg:text-xl font-light leading-relaxed">
                See top-matching roles with explanations, your skill gaps, suggested courses, and company ideas. Save
                results, export a PDF, and use the dashboard to track progress with charts that highlight improvements.
              </p>
            </div>
          </FadeInSection>
        </div>
      </div>
    </section>
  );
}
