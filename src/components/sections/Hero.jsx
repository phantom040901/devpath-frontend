import { useModalContext } from "../../contexts/ModalContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useEffect, useRef } from "react";
import ArrowRight from "../icons/ArrowRight";
import ArrowRightLine from "../icons/ArrowRightLine";
import HeroRight from "../../assets/graphics/HeroRight.png";

export default function Hero({ id }) {
  const { setActiveModal } = useModalContext();
  const { theme } = useTheme();
  const buttonRef = useRef(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    if (buttonRef.current) {
      if (theme === 'light') {
        buttonRef.current.style.setProperty('background-color', '#44e5e7', 'important');
        buttonRef.current.style.setProperty('color', '#ffffff', 'important');
      } else {
        buttonRef.current.style.setProperty('background-color', '#44e5e7', 'important');
        buttonRef.current.style.setProperty('color', '#0e2e2e', 'important');
      }
    }

    // Force background color to blend with Organizations
    if (sectionRef.current) {
      if (theme === 'light') {
        sectionRef.current.style.setProperty('background-color', '#f9fafb', 'important');
      } else {
        sectionRef.current.style.removeProperty('background-color');
      }
    }
  }, [theme]);

  return (
    <section ref={sectionRef} id={id} className="relative w-full overflow-x-hidden dark:bg-primary-1500 light:bg-gray-50 dark:bg-[url('../src/assets/Noise.webp')] bg-repeat">
      <div
        className="m-auto max-w-[90rem] grid grid-cols-[1fr_1fr] items-center gap-x-12 px-24 pt-40 pb-16
          max-xl:grid-cols-2 max-xl:px-16 max-xl:pt-32 max-xl:pb-12
          max-lg:grid-cols-1 max-lg:gap-y-16 max-lg:px-8 max-lg:pt-24 max-lg:pb-10
          max-md:px-6 max-md:pb-8 max-sm:px-4"
      >
        {/* --- Left content --- */}
        {/* --- Left content --- */}
<div className="max-lg:text-center max-lg:flex max-lg:flex-col max-lg:items-center">
  {/* Headline */}
  <h1
    className="mb-6 text-6xl font-extrabold tracking-tight dark:text-white light:text-gray-900 dark:drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] light:drop-shadow-none
      max-xl:text-5xl max-lg:text-4xl max-sm:text-3xl"
  >
    Discover Your <br /> Tech Career Path
  </h1>

  {/* Subheadline */}
  <p
    className="mb-10 text-xl leading-relaxed dark:text-gray-200 light:text-gray-700 dark:drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)] light:drop-shadow-none
      max-xl:text-lg max-lg:mb-8"
  >
    DevPath helps students and aspiring tech professionals discover their ideal career in technology—from software development to data analytics, networking & security, quality assurance, IT management, technical support, and specialized IT roles. Match your skills to the right path and get personalized guidance to accelerate your career growth.
  </p>

  {/* CTA Button */}
  <button
    ref={buttonRef}
    className="group flex items-center gap-x-3 rounded-full
      px-10 py-5 text-xl font-semibold
      shadow-[0_0_25px_rgba(0,255,200,0.6)]
      transition-all hover:shadow-[0_0_40px_rgba(0,255,200,0.8)]"
    onMouseEnter={(e) => {
      if (theme === 'light') {
        e.currentTarget.style.setProperty('background-color', '#111827', 'important');
        e.currentTarget.style.setProperty('color', '#ffffff', 'important');
      } else {
        e.currentTarget.style.setProperty('background-color', '#ffffff', 'important');
        e.currentTarget.style.setProperty('color', '#111827', 'important');
      }
    }}
    onMouseLeave={(e) => {
      if (theme === 'light') {
        e.currentTarget.style.setProperty('background-color', '#44e5e7', 'important');
        e.currentTarget.style.setProperty('color', '#ffffff', 'important');
      } else {
        e.currentTarget.style.setProperty('background-color', '#44e5e7', 'important');
        e.currentTarget.style.setProperty('color', '#0e2e2e', 'important');
      }
    }}
    onClick={() => setActiveModal("sign-up")}
  >
    <span>Get Started</span>
    <div className="w-6" style={{ display: 'flex', alignItems: 'center' }}>
      <ArrowRightLine
        alt="Arrow right line"
        className="-mr-3 inline w-0 opacity-0 transition-all group-hover:w-3 group-hover:opacity-100"
        stroke={theme === 'light' ? '#ffffff' : '#0e2e2e'}
        width={3}
      />
      <ArrowRight
        alt="Arrow right icon"
        className="inline w-6"
        stroke={theme === 'light' ? '#ffffff' : '#0e2e2e'}
        width={2.5}
      />
    </div>
  </button>
</div>


        {/* --- Right-side Graphic + Reviews --- */}
        <div className="relative flex flex-col items-center">
          {/* Blurred circle toned down on mobile */}
          <div className="absolute bottom-0 h-72 w-72 rounded-full bg-primary-500/20 blur-[100px] max-sm:opacity-40" />

          <img
            src={HeroRight}
            alt="Hero graphic for DevPath"
            className="relative object-contain
              scale-110 max-lg:scale-100 max-md:scale-90
              max-sm:w-full max-sm:scale-95 max-sm:opacity-80"
          />
        </div>
      </div>
    </section>
  );
}
