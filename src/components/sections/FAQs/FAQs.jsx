import { useState } from "react";
import { frequentlyAskedQuestions } from "../../../utils/content";
import FAQList from "./FAQList";

export default function FAQs({ id = "faqs" }) {   // 👈 accept id prop
  const [category, setActiveCategory] = useState("General");
  const [activeQuestion, setActiveQuestion] = useState(null);

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
    <section id={id} className="relative overflow-hidden justify-items-center"> {/* 👈 id here */}
      {/* Smooth gradient blend to footer */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-1500 via-primary-1400 to-black" />

      <div className="relative w-full max-w-[90rem] py-32 px-24 max-xl:px-16 max-xl:py-24 max-lg:px-8 max-md:px-6 max-sm:px-4">
        <h2 className="text-primary-50 mb-8 text-center text-6xl/18 font-semibold tracking-tighter max-xl:mb-6 max-xl:text-5xl/16 max-lg:text-4xl/10 max-lg:tracking-tight max-md:mb-6 max-md:text-left max-sm:text-3xl/9 max-sm:tracking-tighter max-sm:mb-4">
          Frequently Asked Questions
        </h2>
        <div className="mb-8 text-xl/loose font-light max-lg:text-lg/8 max-sm:text-base/loose max-sm:mb-6">
          <p className="text-primary-100 text-center max-md:text-left max-sm:hidden">
            The most commonly asked questions about DevPath.{" "}
            <br className="max-md:hidden" />
            Have any other questions?{" "}
            <a
              href="#"
              className="group underline decoration-1 underline-offset-3 hover:text-primary-300 transition-colors"
            >
              Chat with our expert tech team
            </a>
          </p>
        </div>
        <ul className="mb-16 flex flex-wrap justify-center gap-x-3 gap-y-3 max-lg:mb-12 max-md:justify-start max-sm:gap-2">
          {frequentlyAskedQuestions.map((obj) => (
            <li key={obj.id}>
              <button
                className={`border-primary-50 text-primary-50 transition-properties cursor-pointer rounded-full border-2 px-8 py-3.5 text-lg/8 font-medium max-xl:px-6 max-xl:text-base/loose max-sm:px-5 max-sm:py-2.5 max-sm:text-sm ${
                  obj.category === category &&
                  "bg-primary-500 text-primary-1300 border-primary-500 primary-glow"
                } ${obj.category !== category && "hover:bg-primary-50 hover:text-primary-1300"}`}
                onClick={() => handleCategoryClick(obj.category)}
              >
                {obj.category}
              </button>
            </li>
          ))}
        </ul>
        <FAQList
          category={category}
          questions={questionsArr}
          activeQuestion={activeQuestion}
          handleQuestionClick={handleQuestionClick}
        />
      </div>
    </section>
  );
}
