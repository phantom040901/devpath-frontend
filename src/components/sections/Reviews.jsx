import { reviews } from "../../utils/content";
import { useTheme } from "../../contexts/ThemeContext";
import { useEffect, useRef } from "react";

export default function Reviews() {
  const { theme } = useTheme();
  const textRef = useRef(null);
  const numberRef = useRef(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    if (textRef.current) {
      if (theme === 'light') {
        textRef.current.style.setProperty('color', '#1f2937', 'important');
        textRef.current.style.setProperty('font-weight', '600', 'important');
      } else {
        textRef.current.style.removeProperty('color');
        textRef.current.style.removeProperty('font-weight');
      }
    }

    if (numberRef.current) {
      if (theme === 'light') {
        numberRef.current.style.setProperty('color', '#44e5e7', 'important');
      } else {
        numberRef.current.style.removeProperty('color');
      }
    }

    // Force background color to blend with Hero
    if (sectionRef.current) {
      if (theme === 'light') {
        sectionRef.current.style.setProperty('background-color', '#f9fafb', 'important');
      } else {
        sectionRef.current.style.removeProperty('background-color');
      }
    }
  }, [theme]);

  return (
    <section ref={sectionRef} className="dark:bg-primary-1500 light:bg-gray-50 dark:bg-[url('../src/assets/Noise.webp')] bg-repeat py-8 max-md:py-6">
      <div className="m-auto flex max-w-[90rem] flex-wrap items-center gap-x-4 gap-y-4 px-24 max-xl:gap-x-3 max-xl:px-16 max-lg:px-8 max-md:px-6">
      <ul className="flex">
        {reviews.map((review) => (
          <li key={review.id} className="-mr-4 last:mr-0">
            <img
              className="border-primary-100 h-12 rounded-full border-2 max-xl:h-10"
              src={review.src}
              alt={review.alt}
            />
          </li>
        ))}
      </ul>
      <p
        ref={textRef}
        className="dark:text-primary-100 text-xl/loose dark:font-light max-lg:text-base/loose"
      >
        With over{" "}
        <span
          ref={numberRef}
          className="dark:text-primary-500 font-bold tracking-tighter"
        >
          200+{" "}
        </span>
        learning resources from the internet
      </p>
      </div>
    </section>
  );
}
