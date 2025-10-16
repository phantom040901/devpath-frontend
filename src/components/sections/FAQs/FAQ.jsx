import { motion } from "motion/react";
import { useEffect, useRef } from "react";
import CaretUp from "../../icons/CaretUp";

export default function FAQ({ question, activeQuestion, handleQuestionClick, theme }) {
  const questionRef = useRef(null);
  const answerRef = useRef(null);
  const iconBorderRef = useRef(null);
  const iconRef = useRef(null);

  useEffect(() => {
    if (questionRef.current) {
      if (theme === 'light') {
        questionRef.current.style.setProperty('color', '#111827', 'important');
      } else {
        questionRef.current.style.removeProperty('color');
      }
    }
    if (answerRef.current) {
      if (theme === 'light') {
        answerRef.current.style.setProperty('color', '#1f2937', 'important');
      } else {
        answerRef.current.style.removeProperty('color');
      }
    }
    if (iconBorderRef.current) {
      if (theme === 'light') {
        iconBorderRef.current.style.setProperty('border-color', '#000000', 'important');
      } else {
        iconBorderRef.current.style.setProperty('border-color', '#ffffff', 'important');
      }
    }
    if (iconRef.current) {
      const svgElement = iconRef.current.querySelector('svg');
      const pathElements = iconRef.current.querySelectorAll('path');

      if (theme === 'light') {
        if (svgElement) {
          svgElement.style.setProperty('stroke', '#000000', 'important');
        }
        pathElements.forEach(path => {
          path.style.setProperty('stroke', '#000000', 'important');
        });
      } else {
        if (svgElement) {
          svgElement.style.removeProperty('stroke');
        }
        pathElements.forEach(path => {
          path.style.removeProperty('stroke');
        });
      }
    }
  }, [theme]);

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.li variants={itemVariants} className="shrink-0 grow-0">
      <button
        className="flex w-full cursor-pointer items-start max-sm:items-center"
        onClick={() => handleQuestionClick(question.id)}
      >
        <div
          ref={iconBorderRef}
          className="dark:border-white light:border-black mr-6 rounded-xl border-2 p-3.5 flex-shrink-0 max-sm:mr-3 max-sm:p-2.5 max-sm:rounded-lg"
        >
          <div ref={iconRef}>
            <question.Icon
              width={2}
              className="dark:stroke-white light:stroke-black max-sm:w-5 max-sm:h-5"
              alt={question.alt}
            />
          </div>
        </div>

        <p ref={questionRef} className="dark:text-primary-50 light:text-gray-900 mr-auto pr-4 text-left text-xl/loose font-medium tracking-tight max-lg:text-lg/8 max-lg:font-semibold max-sm:text-sm max-sm:leading-6 max-sm:font-medium max-sm:pr-2">
          {question.question}
        </p>
        <div className="flex h-12 w-12 shrink-0 items-center justify-center max-sm:h-10 max-sm:w-10">
          <CaretUp
            className="dark:stroke-primary-50 light:stroke-gray-900 max-sm:w-5 max-sm:h-5"
            activeQuestion={activeQuestion === question.id}
            width={2.5}
            alt="Caret Up Icon"
          />
        </div>
      </button>
      <motion.p
        ref={answerRef}
        className="dark:text-primary-100 light:text-gray-800 pt-0 pr-14 pl-20 text-lg/8 dark:font-light light:font-normal max-lg:text-base/loose max-lg:pl-16 max-md:pr-8 max-md:pl-14 max-sm:pr-0 max-sm:pl-11 max-sm:text-sm max-sm:leading-relaxed"
        initial={{ opacity: 0, maxHeight: 0, visibility: "hidden" }}
        animate={
          activeQuestion === question.id
            ? {
                opacity: 1,
                maxHeight: "400px",
                visibility: "visible",
                paddingTop: "1rem",
              }
            : {}
        }
        transition={{ duration: 0.3, ease: "easeIn" }}
        layout
      >
        {question.answer}
      </motion.p>
    </motion.li>
  );
}
