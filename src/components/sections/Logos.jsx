import FadeInSection from "../animations/FadeInSection";
import umLogo from "../../assets/logos/um.png";
import pwcLogo from "../../assets/logos/pwc.png";
import { useTheme } from "../../contexts/ThemeContext";
import { useEffect, useRef } from "react";

export default function Logos() {
  const { theme } = useTheme();
  const sectionRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    // Force background color to blend with About
    if (sectionRef.current) {
      if (theme === 'light') {
        sectionRef.current.style.setProperty('background-color', '#f9fafb', 'important');
      } else {
        sectionRef.current.style.removeProperty('background-color');
      }
    }

    // Force text color
    if (textRef.current) {
      if (theme === 'light') {
        textRef.current.style.setProperty('color', '#111827', 'important');
      } else {
        textRef.current.style.removeProperty('color');
      }
    }
  }, [theme]);

  return (
    <section ref={sectionRef} className="dark:bg-primary-1500 light:bg-gray-50 dark:bg-[url('../src/assets/Noise.webp')] bg-repeat">
      <div className="m-auto max-w-[90rem] px-24 py-28 max-xl:px-16 max-xl:py-24 max-lg:px-8 max-md:px-6">
        {/* Heading */}
        <FadeInSection>
          <p ref={textRef} className="dark:text-primary-50 light:text-gray-900 m-auto mb-20 text-center text-xl max-xl:text-lg/8 max-sm:mb-16">
            Organizations powered by{" "}
            <span className="font-bold tracking-tight">DevPath</span>
          </p>
        </FadeInSection>

        {/* Logos Grid */}
        <FadeInSection>
          <div className="flex flex-wrap items-center justify-center gap-16 max-md:gap-12">
            {/* University of Mindanao */}
            <img
              src={umLogo}
              alt="University of Mindanao Logo"
              className="h-48 max-xl:h-40 max-lg:h-36 max-md:h-32 object-contain
                         dark:drop-shadow-[0_0_25px_rgba(0,255,150,0.6)] light:drop-shadow-lg
                         transition-transform duration-500 ease-in-out hover:scale-110 dark:hover:drop-shadow-[0_0_35px_rgba(0,255,150,0.9)] light:hover:drop-shadow-xl"
            />

            {/* PwC Logo */}
            <img
              src={pwcLogo}
              alt="PwC Logo"
              className="h-48 max-xl:h-40 max-lg:h-36 max-md:h-32 object-contain
                         dark:drop-shadow-[0_0_25px_rgba(0,255,150,0.6)] light:drop-shadow-lg
                         transition-transform duration-500 ease-in-out hover:scale-110 dark:hover:drop-shadow-[0_0_35px_rgba(0,255,150,0.9)] light:hover:drop-shadow-xl"
            />
          </div>
        </FadeInSection>
      </div>
    </section>
  );
}
