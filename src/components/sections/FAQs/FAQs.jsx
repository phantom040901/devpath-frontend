import { useState, useEffect, useRef } from "react";
import { frequentlyAskedQuestions } from "../../../utils/content";
import FAQList from "./FAQList";
import { useTheme } from "../../../contexts/ThemeContext";

function CategoryButton({ obj, category, handleCategoryClick, theme }) {
  const buttonRef = useRef(null);

  useEffect(() => {
    if (buttonRef.current) {
      if (theme === 'light' && obj.category !== category) {
        // Non-active buttons in light mode: black border and text
        buttonRef.current.style.setProperty('border-color', '#000000', 'important');
        buttonRef.current.style.setProperty('color', '#000000', 'important');
        buttonRef.current.style.setProperty('background-color', 'transparent', 'important');
      } else if (theme === 'light' && obj.category === category) {
        // Active button in light mode: cyan border, black text, no background
        buttonRef.current.style.setProperty('border-color', '#06b6d4', 'important'); // cyan-500
        buttonRef.current.style.setProperty('color', '#000000', 'important');
        buttonRef.current.style.setProperty('background-color', 'transparent', 'important');
      } else {
        // Remove forced styles for dark mode
        buttonRef.current.style.removeProperty('border-color');
        buttonRef.current.style.removeProperty('color');
        buttonRef.current.style.removeProperty('background-color');
      }
    }
  }, [theme, obj.category, category]);

  return (
    <li>
      <button
        ref={buttonRef}
        className={`dark:border-white light:border-black dark:text-white light:text-black transition-properties cursor-pointer rounded-full border-2 px-8 py-3.5 text-lg/8 font-medium max-xl:px-6 max-xl:text-base/loose max-sm:px-5 max-sm:py-2.5 max-sm:text-sm ${
          obj.category === category &&
          "bg-primary-500 dark:text-primary-1300 light:text-white border-primary-500 primary-glow"
        } ${obj.category !== category && "dark:hover:bg-primary-50 light:hover:bg-gray-200 dark:hover:text-primary-1300 light:hover:text-gray-900"}`}
        onClick={() => handleCategoryClick(obj.category)}
      >
        {obj.category}
      </button>
    </li>
  );
}

export default function FAQs({ id = "faqs" }) {   // 👈 accept id prop
  const { theme } = useTheme();
  const [category, setActiveCategory] = useState("General");
  const [activeQuestion, setActiveQuestion] = useState(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const sectionRef = useRef(null);

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
    if (sectionRef.current) {
      if (theme === 'light') {
        sectionRef.current.style.setProperty('background-color', '#f9fafb', 'important');
      } else {
        sectionRef.current.style.removeProperty('background-color');
      }
    }
  }, [theme]);

  const categoryObj = frequentlyAskedQuestions
    .filter((obj) => obj.category === category)
    .at(0);
  const questionsArr = categoryObj.questions;

  const handleQuestionClick = (id) =>
    id === activeQuestion ? setActiveQuestion(null) : setActiveQuestion(id);

  const handleCategoryClick = (category) => {
    setActiveQuestion(null);
    setActiveCategory(category);
  };

  return (
    <section ref={sectionRef} id={id} className="relative overflow-hidden justify-items-center dark:bg-gradient-to-b dark:from-primary-1500 dark:via-primary-1400 dark:to-black light:bg-gray-50"> {/* 👈 id here */}
      {/* Smooth gradient blend to footer - dark mode only */}
      <div className="absolute inset-0 dark:bg-gradient-to-b dark:from-primary-1500 dark:via-primary-1400 dark:to-black light:hidden" />

      <div className="relative w-full max-w-[90rem] py-24 px-24 max-xl:px-16 max-xl:py-20 max-lg:px-8 max-lg:py-16 max-md:px-6 max-md:py-14 max-sm:px-4">
        <h2 ref={titleRef} className="dark:text-primary-50 light:text-gray-900 mb-8 text-center text-6xl/18 font-semibold tracking-tighter max-xl:mb-6 max-xl:text-5xl/16 max-lg:text-4xl/10 max-lg:tracking-tight max-md:mb-6 max-md:text-left max-sm:text-3xl/9 max-sm:tracking-tighter max-sm:mb-4">
          Frequently Asked Questions
        </h2>
        <div className="mb-8 text-xl/loose dark:font-light light:font-normal max-lg:text-lg/8 max-sm:text-base/loose max-sm:mb-6">
          <p ref={descRef} className="dark:text-primary-100 light:text-gray-800 text-center max-md:text-left max-sm:hidden">
            The most commonly asked questions about DevPath.{" "}
            <br className="max-md:hidden" />
            Have any other questions?{" "}
            <a
              href="#"
              className="group underline decoration-1 underline-offset-3 dark:hover:text-primary-300 light:hover:text-primary-600 transition-colors"
            >
              Chat with our expert tech team
            </a>
          </p>
        </div>
        <ul className="mb-16 flex flex-wrap justify-center gap-x-3 gap-y-3 max-lg:mb-12 max-md:justify-start max-sm:gap-2">
          {frequentlyAskedQuestions.map((obj) => (
            <CategoryButton
              key={obj.id}
              obj={obj}
              category={category}
              handleCategoryClick={handleCategoryClick}
              theme={theme}
            />
          ))}
        </ul>
        <FAQList
          category={category}
          questions={questionsArr}
          activeQuestion={activeQuestion}
          handleQuestionClick={handleQuestionClick}
          theme={theme}
        />
      </div>
    </section>
  );
}
